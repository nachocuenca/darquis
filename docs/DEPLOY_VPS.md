# Despliegue VPS

Guía prevista para desplegar Darquis Landing V1 en un VPS propio con Docker y Nginx.

No ejecutar estos pasos desde el entorno local salvo que se esté trabajando directamente en el servidor.

## Objetivo

Servir la landing de Darquis en producción detrás de Nginx, usando el build standalone de Next.js dentro de Docker.

## Datos del Despliegue

- Repositorio remoto: `https://github.com/nachocuenca/darquis.git`
- Ruta del repo en VPS: `/home/debian/repos/darquis`
- Ruta runtime prevista: `/srv/apps/darquis`
- Puerto local del host: `13080`
- Puerto interno del contenedor: `3000`
- Dominios:
  - `darquis.com`
  - `www.darquis.com`
- Proxy Nginx hacia: `http://127.0.0.1:13080`

Nota importante: no tocar ni modificar la configuración de `portal.gestioneslaborales.es`.

## Estado Funcional

- La landing está preparada para producción con `output: "standalone"`.
- `/api/waitlist` valida email, perfil, aceptación de privacidad, honeypot, tiempo mínimo, Turnstile y rate limit.
- La persistencia real de la lista de espera se hace por Google Apps Script hacia Google Sheets.
- No hay base de datos SQL, Supabase ni backend administrativo propio.

## Preparar Código en el VPS

Primera instalación:

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

En esta primera versión se puede levantar desde el repo. Para una separación más estricta, copiar o sincronizar el contenido validado a `/srv/apps/darquis`.

## Docker Compose

Crear o actualizar un `.env` en `/home/debian/repos/darquis` antes de construir:

```bash
cat > .env <<'EOF'
GOOGLE_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
GOOGLE_SCRIPT_SECRET=valor_largo_aleatorio
TURNSTILE_SECRET_KEY=0x...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x...
EOF
```

No subir este archivo al repositorio. `docker-compose.yml` pasa estas variables al contenedor en runtime.

Validar configuración:

```bash
cd /home/debian/repos/darquis
docker compose config
```

Construir y levantar:

```bash
docker compose up -d --build
```

Ver contenedores:

```bash
docker compose ps
```

Ver logs:

```bash
docker compose logs -f darquis
```

Reiniciar:

```bash
docker compose restart darquis
```

Parar:

```bash
docker compose down
```

## Verificación Local en el VPS

Comprobar respuesta directa del contenedor a través del puerto publicado en localhost:

```bash
curl -I http://127.0.0.1:13080
curl -I http://127.0.0.1:13080/privacidad
```

Probar validación de waitlist:

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

## Checklist Post-Deploy

- `docker compose ps` muestra `darquis-web` en ejecución.
- `curl -I http://127.0.0.1:13080` devuelve respuesta HTTP.
- `nginx -t` pasa correctamente.
- `https://darquis.com` carga la landing.
- `https://www.darquis.com` carga o redirige según se decida.
- `/api/waitlist` valida datos, exige Turnstile en producción y guarda en Google Sheets mediante Apps Script.
- `/aviso-legal`, `/privacidad` y `/cookies` cargan correctamente.
- No se ha tocado `portal.gestioneslaborales.es`.
