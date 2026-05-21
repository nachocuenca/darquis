# Waitlist

La lista de espera de Darquis usa una integracion ligera sin base de datos propia.

## Flujo actual

1. El usuario completa el formulario.
2. El frontend valida email, perfil y privacidad con `validateWaitlistInput`.
3. El formulario envia un `POST` a `/api/waitlist`.
4. La API vuelve a validar los datos en servidor.
5. La API filtra honeypot, tiempo minimo, rate limit y Cloudflare Turnstile.
6. Si todo es valido, `registerWaitlistLead` envia el lead a Google Apps Script.
7. Apps Script hace `appendRow` en Google Sheets.
8. Si el lead queda guardado, Next.js intenta enviar el aviso por SMTP desde `lib/notify.ts`.

## Endpoint

```txt
GET /api/waitlist
POST /api/waitlist
```

Archivo:

```txt
app/api/waitlist/route.ts
```

`GET /api/waitlist` devuelve solo configuracion publica del formulario, incluida la site key publica de Turnstile si existe.

Payload esperado para `POST /api/waitlist`:

```json
{
  "email": "nombre@estudio.com",
  "profile": "arquitecto",
  "privacyAccepted": true,
  "source": "modal",
  "turnstileToken": "token",
  "website": "",
  "startedAt": 1779100000000
}
```

Campos:

- `email`: obligatorio.
- `profile`: opcional.
- `privacyAccepted`: obligatorio y debe ser `true`.
- `source`: opcional, permite distinguir formularios como `modal`.
- `turnstileToken`: token generado por Cloudflare Turnstile.
- `website`: honeypot oculto. Si viene relleno, se responde exito generico sin persistir.
- `startedAt`: timestamp de carga del formulario para detectar envios demasiado rapidos.

## Validaciones

Archivo:

```txt
lib/validations.ts
```

La validacion comprueba:

- Formato de email.
- Perfil profesional permitido si se envia.
- Aceptacion de privacidad.
- Normalizacion de campos auxiliares del formulario.

Perfiles aceptados:

- `arquitecto`
- `arquitecto-tecnico`
- `ingeniero`
- `otro-perfil-tecnico`

## Seguridad antirobots

Archivo:

```txt
lib/waitlist.ts
```

Medidas activas:

- Honeypot `website`.
- Tiempo minimo de 1,8 segundos desde `startedAt`.
- Validacion server-side de Cloudflare Turnstile con `TURNSTILE_SECRET_KEY`.
- Rate limit en memoria por IP y por email.

El rate limit en memoria es suficiente para el despliegue standalone actual en un unico proceso Docker. Si la app se ejecuta en varias instancias o serverless, habria que moverlo a almacenamiento compartido. No se ha introducido Redis ni base de datos para mantener la arquitectura ligera.

## Persistencia

Archivo:

```txt
lib/waitlist.ts
```

Funcion:

```ts
registerWaitlistLead(lead, metadata)
```

En produccion requiere:

```txt
GOOGLE_SCRIPT_WEBHOOK_URL
GOOGLE_SCRIPT_SECRET
TURNSTILE_SECRET_KEY
NEXT_PUBLIC_TURNSTILE_SITE_KEY
```

En desarrollo:

- Si falta `TURNSTILE_SECRET_KEY`, se permite bypass controlado con warning.
- Si faltan `GOOGLE_SCRIPT_WEBHOOK_URL` o `GOOGLE_SCRIPT_SECRET`, la API responde exito sin persistencia para facilitar trabajo local.

## Notificaciones SMTP

Archivo:

```txt
lib/notify.ts
```

Funcion:

```ts
sendWaitlistNotification(lead, metadata)
```

El aviso interno ya no depende de `MailApp` ni de Gmail. Despues de guardar en Google Sheets, `/api/waitlist` crea un transporter SMTP con las variables de entorno de IONOS y envia el correo a `WAITLIST_NOTIFY_TO`.

El remitente sale de `WAITLIST_NOTIFY_FROM` y el `reply-to` es el email del lead, para que Javi pueda responder directamente desde Outlook.

Variables requeridas para SMTP:

```txt
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASSWORD
WAITLIST_NOTIFY_TO
WAITLIST_NOTIFY_FROM
```

Variable opcional:

```txt
WAITLIST_SHEET_URL
```

Si existe, se incluye en el cuerpo del email.

Usar el servidor SMTP indicado por IONOS para la cuenta `info@darquis.com`. Normalmente sera `smtp.ionos.es` o el valor que figure en la configuracion de Outlook/IONOS. No se hardcodea en el codigo.

Regla de robustez:

- Si Google Sheets falla, el endpoint devuelve error porque el lead no se ha registrado.
- Si Google Sheets funciona pero falla SMTP, el endpoint responde exito con `persisted: true` y `notificationSent: false`, y deja un warning en logs.
- El usuario ve confirmacion cuando el lead queda persistido.

## Privacidad

No se guarda mas informacion de la necesaria para gestionar la solicitud.

La IP real se usa solo para Turnstile y rate limit. Hacia Google Apps Script se envia un hash SHA-256 salado en el campo `ip`, que el Sheet guarda como `ipHash`.

La aceptacion de privacidad queda guardada como `privacyAccepted`.

## Testing local

1. Configura `.env.local` con:

```txt
GOOGLE_SCRIPT_WEBHOOK_URL=
GOOGLE_SCRIPT_SECRET=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@darquis.com
SMTP_PASSWORD=
WAITLIST_NOTIFY_TO=info@darquis.com
WAITLIST_NOTIFY_FROM="Darquis <info@darquis.com>"
WAITLIST_SHEET_URL=
```

2. Ejecuta:

```bash
npm.cmd run dev
```

3. Envia el formulario real desde la landing local.

4. Comprueba:

- Nueva fila en Google Sheet.
- Email recibido en Outlook para `info@darquis.com`.
- Logs del servidor sin errores de Turnstile, Google Apps Script ni SMTP.

## Google Sheets

La guia completa de Google Sheet, Apps Script, shared secret y despliegue como Web App esta en:

```txt
docs/GOOGLE_SHEETS_WAITLIST.md
```
