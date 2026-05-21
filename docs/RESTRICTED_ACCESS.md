# Acceso restringido — Página 403 personalizada

## Por qué no se usa una ruta Next.js

Cuando Nginx bloquea una petición con `allow`/`deny`, el rechazo ocurre en la capa del proxy
**antes** de que la petición llegue a la aplicación Next.js que corre en Docker.
Por tanto, cualquier página creada dentro del proyecto Next.js (por ejemplo `/app/403/page.tsx`)
nunca se ejecutaría: Nginx ya habría cortado la conexión y devuelto el `403` sin delegar
al contenedor.

La solución correcta es indicarle a Nginx una página HTML estática que él mismo pueda servir
directamente cuando genera el error 403, mediante la directiva `error_page`.

---

## Archivo de la página de error

El HTML personalizado vive en el repositorio en:

```
ops/nginx/darquis-403.html
```

Es un fichero **totalmente autocontenido** (sin dependencias externas, sin fuentes remotas,
sin imágenes, sin JS) para garantizar que Nginx puede servirlo sin errores adicionales
aunque el acceso al resto del site esté bloqueado.

---

## Instalación en el VPS

### 1. Copiar el fichero al servidor

```bash
# Desde tu máquina local, tras hacer pull del repo en el VPS:
cd /home/debian/repos/darquis
git pull origin main

# Crear el directorio de errores si no existe
sudo mkdir -p /var/www/darquis-errors

# Copiar la página
sudo cp ops/nginx/darquis-403.html /var/www/darquis-errors/403.html

# Asegurar permisos de lectura para Nginx (usuario www-data en Debian/Ubuntu)
sudo chown www-data:www-data /var/www/darquis-errors/403.html
sudo chmod 644 /var/www/darquis-errors/403.html
```

### 2. Snippet de Nginx

Abre el fichero de configuración del vhost:

```bash
sudo nano /etc/nginx/sites-available/darquis.com
```

#### Bloque `server` HTTPS (puerto 443) — **obligatorio**

Dentro del bloque `server { listen 443 ssl; ... }`, añadir:

```nginx
# ── Página de error 403 personalizada ───────────────────────────
error_page 403 /_errors/darquis-403.html;

location = /_errors/darquis-403.html {
    internal;
    alias /var/www/darquis-errors/403.html;
}
```

> **`internal`** impide que la ruta `/_errors/darquis-403.html` sea accesible directamente
> desde el exterior. Solo Nginx la usa internamente al generar el error.

#### Bloque `server` HTTP (puerto 80) — opcional / recomendado

Si el bloque HTTP solo redirige al HTTPS, no es necesario repetirlo.
Pero si el bloque HTTP también tiene directivas `allow`/`deny` propias, añadir el mismo
snippet para que las peticiones bloqueadas en HTTP también vean la página personalizada:

```nginx
# ── Página de error 403 personalizada (bloque HTTP) ─────────────
error_page 403 /_errors/darquis-403.html;

location = /_errors/darquis-403.html {
    internal;
    alias /var/www/darquis-errors/403.html;
}
```

#### Estructura de referencia del vhost

```nginx
# Redirección HTTP → HTTPS
server {
    listen 80;
    server_name darquis.com www.darquis.com;

    # Solo si este bloque tiene allow/deny propios:
    # error_page 403 /_errors/darquis-403.html;
    # location = /_errors/darquis-403.html {
    #     internal;
    #     alias /var/www/darquis-errors/403.html;
    # }

    return 301 https://$host$request_uri;
}

# HTTPS principal
server {
    listen 443 ssl;
    server_name darquis.com www.darquis.com;

    # ... certificados SSL, etc.

    # Control de acceso por IP (ejemplo orientativo)
    location / {
        allow 1.2.3.4;      # IP de oficina
        allow 5.6.7.8;      # IP adicional
        deny all;

        proxy_pass http://127.0.0.1:13080;
        # ... resto de proxy headers
    }

    # IMPORTANTE: no añadir allow/deny en este location
    # para que Nginx pueda servirlo en respuesta al 403
    error_page 403 /_errors/darquis-403.html;

    location = /_errors/darquis-403.html {
        internal;
        alias /var/www/darquis-errors/403.html;
    }

    # No tocar este bloque si existe
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}
```

> **Nota:** revisar el fichero real del VPS antes de pegar el snippet.
> Si hay `include` de configuraciones parciales, localizar dónde van los `location` del
> dominio principal.

---

## Verificación y recarga de Nginx

### Comprobar sintaxis

```bash
sudo nginx -t
```

Debe devolver:

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Recargar sin interrumpir tráfico

```bash
sudo systemctl reload nginx
```

---

## Pruebas

### Desde una IP **no** permitida (móvil, red externa)

Abrir `https://darquis.com` en el navegador.
Debe aparecer la pantalla personalizada "Acceso no disponible" con el estilo Darquis.
El código HTTP devuelto sigue siendo **403**, pero el cuerpo es el HTML personalizado.

### Desde una IP **permitida**

Acceso normal a la landing de Darquis. Sin cambios.

### Con `curl` desde una IP no permitida

```bash
curl -I https://darquis.com
# → HTTP/2 403

curl https://darquis.com | grep -i "acceso no disponible"
# → Debe encontrar el texto de la página personalizada
```

### Verificar que la ruta interna no es accesible directamente

```bash
curl -I https://darquis.com/_errors/darquis-403.html
# → HTTP/2 404  (internal impide el acceso directo)
```

---

## Rollback

Si algo falla, restaurar la configuración anterior:

```bash
# 1. Restaurar el backup del vhost (si lo hiciste antes de editar)
sudo cp /etc/nginx/sites-available/darquis.com.bak \
        /etc/nginx/sites-available/darquis.com

# 2. Verificar sintaxis
sudo nginx -t

# 3. Recargar
sudo systemctl reload nginx
```

Si no tienes backup previo, eliminar o comentar las líneas añadidas en este paso
(`error_page 403` y el `location = /_errors/...`) y recargar.

---

## Recomendación: hacer backup antes de editar

```bash
sudo cp /etc/nginx/sites-available/darquis.com \
        /etc/nginx/sites-available/darquis.com.bak
```

Hacerlo **antes** de cualquier edición para tener siempre un rollback limpio.
