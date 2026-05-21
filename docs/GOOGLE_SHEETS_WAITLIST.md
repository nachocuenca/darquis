# Google Sheets Waitlist

Esta guia conecta el formulario de Darquis con Google Sheets mediante Google Apps Script.

Flujo:

```txt
Formulario Darquis
-> /api/waitlist
-> validaciones servidor + honeypot + tiempo minimo + Turnstile
-> Google Apps Script Web App
-> Google Sheet
-> SMTP IONOS desde Next.js
-> email a info@darquis.com
```

Google Apps Script queda como receptor para guardar filas en Google Sheets. La notificacion principal por email sale desde Next.js usando SMTP.

## 1. Crear el Google Sheet

1. Crea una hoja nueva en Google Drive, por ejemplo `Darquis - Waitlist`.
2. Renombra la primera pestana como `Waitlist`.
3. Crea esta cabecera en la fila 1:

```txt
createdAt | email | professionalProfile | privacyAccepted | source | userAgent | ipHash | turnstileStatus | notes
```

El endpoint de Next envia el campo `ip` como hash SHA-256 salado, no como IP en claro. Si se prefiere no guardar nada relacionado con IP, elimina el valor en Apps Script antes de `appendRow`. Si se decide guardar IP real, documentarlo en privacidad.

## 2. Crear el Apps Script

Desde el Sheet:

1. Abre `Extensiones` -> `Apps Script`.
2. Pega este codigo en `Code.gs`.
3. Guarda el proyecto.

```js
const SHEET_NAME = "Waitlist";
const NOTIFY_EMAIL = "";

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("GOOGLE_SCRIPT_SECRET");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return json_({ success: false, message: "Unauthorized" });
    }

    validatePayload_(payload);

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet_(spreadsheet);
    ensureHeader_(sheet);

    sheet.appendRow([
      payload.createdAt || new Date().toISOString(),
      normalizeEmail_(payload.email),
      payload.professionalProfile || "",
      payload.privacyAccepted === true ? "si" : "no",
      payload.source || "darquis.com",
      payload.userAgent || "",
      payload.ip || "",
      payload.turnstileStatus || "",
      payload.notes || "",
    ]);

    // El aviso principal sale desde Next.js por SMTP IONOS.
    // Deja NOTIFY_EMAIL vacio para evitar duplicados.
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "Nueva solicitud en Darquis",
        body: buildEmailBody_(payload, spreadsheet.getUrl()),
      });
    }

    return json_({ success: true });
  } catch (error) {
    console.error(error);
    return json_({
      success: false,
      message: error && error.message ? error.message : "Internal error",
    });
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Missing body");
  }

  return JSON.parse(e.postData.contents);
}

function validatePayload_(payload) {
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
    throw new Error("Invalid email");
  }

  if (payload.privacyAccepted !== true) {
    throw new Error("Privacy must be accepted");
  }
}

function getOrCreateSheet_(spreadsheet) {
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeader_(sheet) {
  const headers = [
    "createdAt",
    "email",
    "professionalProfile",
    "privacyAccepted",
    "source",
    "userAgent",
    "ipHash",
    "turnstileStatus",
    "notes",
  ];
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeader = current.some(function (value) {
    return String(value || "").trim() !== "";
  });

  if (!hasHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function normalizeEmail_(email) {
  return String(email || "").trim().toLowerCase();
}

function buildEmailBody_(payload, sheetUrl) {
  return [
    "Nueva solicitud en la lista de espera de Darquis.",
    "",
    "Email: " + normalizeEmail_(payload.email),
    "Perfil: " + (payload.professionalProfile || "No indicado"),
    "Fecha: " + (payload.createdAt || new Date().toISOString()),
    "Privacidad aceptada: " + (payload.privacyAccepted === true ? "si" : "no"),
    "Origen: " + (payload.source || "darquis.com"),
    "Estado antirobots: " + (payload.turnstileStatus || ""),
    "",
    "Ver Google Sheet: " + sheetUrl,
  ].join("\n");
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Configurar el shared secret

En Apps Script:

1. Abre `Configuracion del proyecto`.
2. En `Propiedades de la secuencia de comandos`, anade:

```txt
GOOGLE_SCRIPT_SECRET=un_valor_largo_aleatorio
```

Ese mismo valor debe ir en la variable de entorno `GOOGLE_SCRIPT_SECRET` de Next.js.

## 4. Desplegar como Web App

1. Pulsa `Implementar` -> `Nueva implementacion`.
2. Tipo: `Aplicacion web`.
3. Ejecutar como: `Yo`.
4. Quien tiene acceso: `Cualquier usuario`.
5. Autoriza permisos de Sheets cuando Google lo pida. Mail solo sera necesario si mantienes el bloque opcional de `MailApp`.
6. Copia la URL `/exec` generada.

Esa URL es el valor de:

```txt
GOOGLE_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
```

Aunque la Web App sea accesible publicamente, el codigo valida `GOOGLE_SCRIPT_SECRET` y rechaza cualquier payload que no lo incluya.

## 5. Payload que recibe Apps Script

Next.js envia JSON con estos campos:

```json
{
  "secret": "shared-secret",
  "email": "nombre@estudio.com",
  "professionalProfile": "Arquitecto",
  "privacyAccepted": true,
  "source": "darquis.com/modal",
  "userAgent": "Mozilla/5.0...",
  "ip": "sha256:...",
  "createdAt": "2026-05-18T10:00:00.000Z",
  "turnstileStatus": "verified",
  "notes": "ip contains a salted SHA-256 hash, not the raw IP address."
}
```

## 6. Notificaciones por email

Antes, Apps Script podia mandar emails internos con `MailApp.sendEmail`. Ahora el aviso principal se envia desde Next.js usando SMTP IONOS y las variables `SMTP_*`.

Si se mantiene `MailApp` activo en Apps Script, puede haber duplicados: uno desde Google y otro desde SMTP IONOS.

Recomendacion:

- Mantener `appendRow`.
- Desactivar o comentar `MailApp.sendEmail` en Apps Script.
- O dejar `NOTIFY_EMAIL` vacio para que el bloque opcional no se ejecute.

Ejemplo de envio Apps Script desactivado:

```js
const NOTIFY_EMAIL = "";

if (NOTIFY_EMAIL) {
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: "Nueva solicitud en Darquis",
    body: buildEmailBody_(payload, spreadsheet.getUrl()),
  });
}
```

El email principal debe salir desde:

```txt
SMTP_USER=info@darquis.com
WAITLIST_NOTIFY_FROM=Darquis <info@darquis.com>
WAITLIST_NOTIFY_TO=info@darquis.com
```

El `reply-to` lo pone Next.js con el email del lead.

## 7. Variables de entorno en Darquis

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

Usar el servidor SMTP indicado por IONOS para la cuenta `info@darquis.com`. Normalmente sera `smtp.ionos.es` o el valor que figure en la configuracion de Outlook/IONOS.

En desarrollo, si falta `TURNSTILE_SECRET_KEY`, `/api/waitlist` permite un bypass controlado y escribe un warning en consola. En produccion, falta de `TURNSTILE_SECRET_KEY` bloquea el envio.

Si faltan `GOOGLE_SCRIPT_WEBHOOK_URL` o `GOOGLE_SCRIPT_SECRET` en desarrollo, el endpoint responde exito sin persistencia para poder trabajar localmente. En produccion se considera error de configuracion.

## 8. Configurar Cloudflare Turnstile

1. Entra en Cloudflare Dashboard.
2. Ve a `Turnstile` -> `Add widget`.
3. Nombre orientativo: `Darquis waitlist`.
4. Tipo recomendado: `Managed`.
5. Hostnames:

```txt
darquis.com
www.darquis.com
localhost
```

6. Copia la site key publica en:

```txt
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

7. Copia la secret key privada en:

```txt
TURNSTILE_SECRET_KEY=
```

El cliente solo recibe la site key publica desde `GET /api/waitlist`. El token generado por el widget se manda a `POST /api/waitlist`, y el servidor lo valida contra Cloudflare antes de enviar nada a Google Apps Script.

Para desarrollo tambien se pueden usar claves de prueba de Cloudflare Turnstile. Si no configuras claves en desarrollo, Darquis permite bypass controlado con warning; no ocurre en produccion.
