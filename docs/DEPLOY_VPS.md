# Despliegue VPS

Guia prevista para desplegar Darquis Landing V1 en un VPS propio con Docker y Nginx.

No ejecutar estos pasos desde el entorno local salvo que se este trabajando directamente en el servidor.

## Objetivo

Servir la landing de Darquis en produccion detras de Nginx, usando el build standalone de Next.js dentro de Docker.

## Datos del despliegue

- Repositorio remoto: `https://github.com/nachocuenca/darquis.git`
- Ruta del repo en VPS: `/home/debian/repos/darquis`
- Ruta runtime prevista: `/srv/apps/darquis`
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

## Preparar codigo en el VPS

Primera instalacion:

```bash
sudo mkdir -p /home/debian/repos
sudo chown -R debian:debian /home/debian/repos
cd /home/debian/repos
git clone https://github.com/nachocuenca/darquis.git
cd /home/debian/repos/darquis
```

Actualizaciones posteriores:

```bash
cd /home/debian/repos/darquis
git pull origin main
```

En esta primera version se puede levantar desde el repo. Para una separacion mas estricta, copiar o sincronizar el contenido validado a `/srv/apps/darquis`.

## Variables de entorno

Crear o actualizar un `.env` en `/home/debian/repos/darquis` antes de construir. No subir este archivo al repositorio.

```bash
cd /home/debian/repos/darquis
sudo nano .env
```

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

## Docker Compose

`docker-compose.yml` lee las variables desde `.env` y las pasa al contenedor en runtime.

Validar configuracion:

```bash
cd /home/debian/repos/darquis
docker compose config
```

Construir y levantar:

```bash
sudo docker compose up -d --build
```

Ver logs tras levantar:

```bash
sudo docker compose logs --tail=120 darquis
```

Ver logs en seguimiento:

```bash
sudo docker compose logs -f darquis
```

Ver contenedores:

```bash
sudo docker compose ps
```

Reiniciar:

```bash
sudo docker compose restart darquis
```

Parar:

```bash
sudo docker compose down
```

## Verificacion local en el VPS

Comprobar respuesta directa del contenedor a traves del puerto publicado en localhost:

```bash
curl -I http://127.0.0.1:13080
curl -I http://127.0.0.1:13080/privacidad
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

Crear un server block para `darquis.com` y `www.darquis.com` apuntando al puerto local `13080`.

Ejemplo orientativo:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name darquis.com www.darquis.com;

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

- `docker compose ps` muestra `darquis-web` en ejecucion.
- `curl -I http://127.0.0.1:13080` devuelve respuesta HTTP.
- `nginx -t` pasa correctamente.
- `https://darquis.com` carga la landing.
- `https://www.darquis.com` carga o redirige segun se decida.
- `/api/waitlist` valida datos, exige Turnstile en produccion, guarda en Google Sheets y envia notificacion SMTP IONOS.
- Si SMTP falla pero Google Sheets guarda el lead, la respuesta del formulario sigue siendo correcta y los logs muestran `notificationSent=false`.
- `/aviso-legal`, `/privacidad` y `/cookies` cargan correctamente.
- No se ha tocado `portal.gestioneslaborales.es`.
