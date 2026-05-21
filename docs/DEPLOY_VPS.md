# Despliegue VPS

Guia de despliegue de Darquis Landing V1 en el VPS propio con Docker y Nginx.

No ejecutar estos pasos desde el entorno local salvo que se este trabajando directamente en el servidor.

## Objetivo

Servir la landing de Darquis en produccion detras de Nginx, usando el build standalone de Next.js dentro de Docker.

## Layout de directorios en el VPS

```
/home/debian/repos/darquis          # Repo fuente. Aqui se hace git pull. NO es el runtime activo.
/srv/apps/darquis/
  shared/
    .env                            # Variables y secretos reales de produccion. Nunca en el repo.
  releases/
    <timestamp>/                    # Releases desplegadas (p.ej. 20260522_143000).
  current -> releases/<timestamp>   # Symlink a la release activa. Este es el runtime.
/var/www/darquis-errors/
  403.html                          # Pagina 403 personalizada servida por Nginx.
```

**Regla fundamental:**
- `/home/debian/repos/darquis` es solo el repo fuente. Se usa para hacer `git pull`.
- `/srv/apps/darquis/current` es el runtime activo desde donde Docker Compose levanta el contenedor.
- **No levantar Darquis desde `/home/debian/repos/darquis` salvo rollback de emergencia** (ver seccion Rollback).
- El `.env` real de produccion vive en `/srv/apps/darquis/shared/.env`. No subir `.env` ni `.env.local` al repo.

## Datos del despliegue

- Repositorio remoto: `https://github.com/nachocuenca/darquis.git`
- Repo fuente en VPS: `/home/debian/repos/darquis`
- Runtime activo: `/srv/apps/darquis/current`
- Puerto local del host: `13080`
- Puerto interno del contenedor: `3000`
- Dominios:
  - `darquis.com`
  - `www.darquis.com`
- Proxy Nginx hacia: `http://127.0.0.1:13080`

Nota importante: no tocar ni modificar la configuracion de `portal.gestioneslaborales.es`.

## Estado funcional

- La landing esta preparada para produccion con `output: "standalone"`.
- `/api/waitlist` valida email, perfil, aceptacion de privacidad, honeypot, tiempo minimo, Turnstile y rate limit.
- La persistencia real de la lista de espera se hace por Google Apps Script hacia Google Sheets.
- La notificacion interna por email se envia desde Next.js usando SMTP IONOS.
- No hay base de datos SQL, Supabase ni backend administrativo propio.

## Primera instalacion (solo una vez)

```bash
# Crear estructura de directorios
sudo mkdir -p /home/debian/repos
sudo chown -R debian:debian /home/debian/repos
sudo mkdir -p /srv/apps/darquis/shared
sudo mkdir -p /srv/apps/darquis/releases

# Clonar repo fuente
cd /home/debian/repos
git clone https://github.com/nachocuenca/darquis.git

# Crear el .env de produccion (rellenar con valores reales)
sudo nano /srv/apps/darquis/shared/.env
```

## Variables de entorno

El `.env` real de produccion vive en `/srv/apps/darquis/shared/.env`. **No subir este archivo al repositorio.**

Contenido orientativo:

```txt
GOOGLE_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
GOOGLE_SCRIPT_SECRET=valor_largo_aleatorio
TURNSTILE_SECRET_KEY=0x...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x...
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@darquis.com
SMTP_PASSWORD=
WAITLIST_NOTIFY_TO=info@darquis.com
WAITLIST_NOTIFY_FROM=Darquis <info@darquis.com>
WAITLIST_SHEET_URL=
```

Usar el servidor SMTP indicado por IONOS para la cuenta `info@darquis.com`. Normalmente sera `smtp.ionos.es` o el valor que figure en la configuracion de Outlook/IONOS. No hardcodear ese host en el codigo.

`SMTP_PASSWORD` debe ser la contrasena o password de aplicacion de IONOS para esa cuenta. No poner secretos en `docker-compose.yml`.

## Flujo de deploy

Este es el flujo completo y correcto para desplegar una nueva version:

```bash
# 1. Actualizar repo fuente
cd /home/debian/repos/darquis
git pull origin main

# 2. Crear directorio de release con timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RELEASE_DIR=/srv/apps/darquis/releases/$TIMESTAMP
sudo mkdir -p "$RELEASE_DIR"

# 3. Sincronizar fuente a la release (excluir artefactos y secretos)
sudo rsync -a --delete \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='.env.local' \
  --exclude='.env*.local' \
  /home/debian/repos/darquis/ "$RELEASE_DIR/"

# 4. Enlazar el .env compartido de produccion a la release
sudo ln -sf /srv/apps/darquis/shared/.env "$RELEASE_DIR/.env"

# 5. Actualizar el symlink current a la nueva release
sudo ln -sfn "$RELEASE_DIR" /srv/apps/darquis/current

# 6. Levantar Docker Compose desde current
cd /srv/apps/darquis/current
sudo docker compose up -d --build

# 7. Actualizar la pagina de error 403
sudo mkdir -p /var/www/darquis-errors
sudo cp /srv/apps/darquis/current/ops/nginx/darquis-403.html /var/www/darquis-errors/403.html
sudo chown www-data:www-data /var/www/darquis-errors/403.html
sudo chmod 644 /var/www/darquis-errors/403.html

# 8. Validar Nginx y recargar
sudo nginx -t && sudo systemctl reload nginx
```

Tras el deploy, ejecutar los healthchecks de la seccion correspondiente.

## Docker Compose — operaciones habituales

`docker-compose.yml` lee las variables desde `.env` (enlazado desde `shared/.env`) y las pasa al contenedor en runtime. Todos los comandos se ejecutan desde `/srv/apps/darquis/current`.

```bash
cd /srv/apps/darquis/current

# Validar configuracion
sudo docker compose config

# Ver logs tras levantar
sudo docker compose logs --tail=120 darquis

# Ver logs en seguimiento
sudo docker compose logs -f darquis

# Ver contenedores
sudo docker compose ps

# Reiniciar
sudo docker compose restart darquis

# Parar
sudo docker compose down
```

## Rollback rapido

### Opcion 1 — Volver a una release anterior (preferido)

```bash
# Listar releases disponibles
ls -lt /srv/apps/darquis/releases/

# Apuntar current a la release anterior (sustituir <timestamp_anterior>)
sudo ln -sfn /srv/apps/darquis/releases/<timestamp_anterior> /srv/apps/darquis/current

# Levantar desde la release restaurada
cd /srv/apps/darquis/current
sudo docker compose up -d --build
```

### Opcion 2 — Emergencia: levantar desde repo fuente

Solo si `current` falla y no hay releases validas disponibles:

```bash
cd /home/debian/repos/darquis

# Enlazar el .env compartido al repo fuente (necesario para que el contenedor arranque)
sudo ln -sf /srv/apps/darquis/shared/.env .env

sudo docker compose up -d --build
```

Restaurar el flujo normalizado tan pronto como sea posible creando una nueva release.

## Healthcheck

Verificar el estado completo del despliegue:

```bash
# Confirmar release activa
readlink -f /srv/apps/darquis/current

# Ver contenedores en ejecucion
sudo docker ps

# Comprobar respuesta directa del contenedor
curl -I http://127.0.0.1:13080

# Comprobar respuesta publica
curl -I https://darquis.com
curl -I https://darquis.com/privacidad
curl -I https://darquis.com/aviso-legal
curl -I https://darquis.com/cookies
```

Probar validacion de waitlist:

```bash
STARTED_AT=$(($(date +%s%3N)-5000))
curl -X POST http://127.0.0.1:13080/api/waitlist \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"profile\":\"arquitecto\",\"privacyAccepted\":true,\"source\":\"vps-check\",\"startedAt\":$STARTED_AT,\"turnstileToken\":\"TOKEN_REAL_DE_TURNSTILE\",\"website\":\"\"}"
```

Con Turnstile activo en produccion, `turnstileToken` debe ser un token real generado desde el formulario. Para una prueba sin token, usar entorno de desarrollo o claves de prueba de Turnstile.

## Nginx

El vhost de Nginx proxya `darquis.com` y `www.darquis.com` hacia el puerto local `13080` donde escucha el contenedor Docker.

Ejemplo orientativo:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name darquis.com www.darquis.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name darquis.com www.darquis.com;

    # ... certificados SSL ...

    location / {
        proxy_pass http://127.0.0.1:13080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Ver `docs/RESTRICTED_ACCESS.md` para la configuracion de la pagina 403 personalizada y el control de acceso por IP.

Validar Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## HTTPS

Cuando DNS apunte correctamente al VPS, emitir certificado TLS para ambos dominios con la herramienta ya usada en el servidor.

Ejemplo si se usa Certbot:

```bash
sudo certbot --nginx -d darquis.com -d www.darquis.com
```

Antes de ejecutar Certbot, comprobar que no afecta a otros virtual hosts existentes, especialmente `portal.gestioneslaborales.es`.

## Checklist post-deploy

- `readlink -f /srv/apps/darquis/current` apunta a la release correcta.
- `sudo docker ps` muestra `darquis-web` en ejecucion.
- `curl -I http://127.0.0.1:13080` devuelve `200`.
- `curl -I https://darquis.com` devuelve `200`.
- `curl -I https://darquis.com/privacidad` devuelve `200`.
- `curl -I https://darquis.com/aviso-legal` devuelve `200`.
- `curl -I https://darquis.com/cookies` devuelve `200`.
- `sudo nginx -t` pasa correctamente.
- `https://darquis.com` carga la landing.
- `https://www.darquis.com` carga o redirige segun se decida.
- `/api/waitlist` valida datos, exige Turnstile en produccion, guarda en Google Sheets y envia notificacion SMTP IONOS.
- Si SMTP falla pero Google Sheets guarda el lead, la respuesta del formulario sigue siendo correcta y los logs muestran `notificationSent=false`.
- `/aviso-legal`, `/privacidad` y `/cookies` cargan correctamente.
- No se ha tocado `portal.gestioneslaborales.es`.
