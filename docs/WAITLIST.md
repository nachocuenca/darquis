# Waitlist

La lista de espera de Darquis usa una integración ligera sin base de datos propia.

## Flujo Actual

1. El usuario completa el formulario.
2. El frontend valida email, perfil y privacidad con `validateWaitlistInput`.
3. El formulario envía un `POST` a `/api/waitlist`.
4. La API vuelve a validar los datos en servidor.
5. La API filtra honeypot, tiempo mínimo, rate limit y Cloudflare Turnstile.
6. Si todo es válido, `registerWaitlistLead` envía el lead a Google Apps Script.
7. Apps Script hace `appendRow` en Google Sheets y envía un email interno.

## Endpoint

```txt
GET /api/waitlist
POST /api/waitlist
```

Archivo:

```txt
app/api/waitlist/route.ts
```

`GET /api/waitlist` devuelve solo configuración pública del formulario, incluida la site key pública de Turnstile si existe.

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
- `website`: honeypot oculto. Si viene relleno, se responde éxito genérico sin persistir.
- `startedAt`: timestamp de carga del formulario para detectar envíos demasiado rápidos.

## Validaciones

Archivo:

```txt
lib/validations.ts
```

La validación comprueba:

- Formato de email.
- Perfil profesional permitido si se envía.
- Aceptación de privacidad.
- Normalización de campos auxiliares del formulario.

Perfiles aceptados:

- `arquitecto`
- `arquitecto-tecnico`
- `ingeniero`
- `otro-perfil-tecnico`

## Seguridad Antirobots

Archivo:

```txt
lib/waitlist.ts
```

Medidas activas:

- Honeypot `website`.
- Tiempo mínimo de 1,8 segundos desde `startedAt`.
- Validación server-side de Cloudflare Turnstile con `TURNSTILE_SECRET_KEY`.
- Rate limit en memoria por IP y por email.

El rate limit en memoria es suficiente para el despliegue standalone actual en un único proceso Docker. Si la app se ejecuta en varias instancias o serverless, habría que moverlo a almacenamiento compartido. No se ha introducido Redis ni base de datos para mantener la arquitectura ligera.

## Persistencia

Archivo:

```txt
lib/waitlist.ts
```

Función:

```ts
registerWaitlistLead(lead, metadata)
```

En producción requiere:

```txt
GOOGLE_SCRIPT_WEBHOOK_URL
GOOGLE_SCRIPT_SECRET
TURNSTILE_SECRET_KEY
NEXT_PUBLIC_TURNSTILE_SITE_KEY
```

En desarrollo:

- Si falta `TURNSTILE_SECRET_KEY`, se permite bypass controlado con warning.
- Si faltan `GOOGLE_SCRIPT_WEBHOOK_URL` o `GOOGLE_SCRIPT_SECRET`, la API responde éxito sin persistencia para facilitar trabajo local.

## Privacidad

No se guarda más información de la necesaria para gestionar la solicitud.

La IP real se usa solo para Turnstile y rate limit. Hacia Google Apps Script se envía un hash SHA-256 salado en el campo `ip`, que el Sheet guarda como `ipHash`.

La aceptación de privacidad queda guardada como `privacyAccepted`.

## Google Sheets

La guía completa de Google Sheet, Apps Script, shared secret, despliegue como Web App y email automático está en:

```txt
docs/GOOGLE_SHEETS_WAITLIST.md
```
