# Darquis Landing V1

Landing pre-MVP para Darquis, orientada a validar interes y captar registros cualificados en una lista de espera.

Darquis es un software en desarrollo para arquitectos, arquitectos tecnicos/aparejadores e ingenieros vinculados a edificacion, certificados, informes, memorias tecnicas, aperturas y documentacion administrativa.

La V1 no vende el producto ni muestra una demo falsa: comunica el posicionamiento del proyecto y recoge solicitudes de acceso.

## Stack tecnico

- Next.js con App Router
- TypeScript
- Tailwind CSS
- React
- Endpoint interno `/api/waitlist`
- Google Apps Script como webhook ligero hacia Google Sheets
- SMTP IONOS desde Next.js para avisos internos de waitlist
- Cloudflare Turnstile, honeypot y rate limit sencillo para proteger el formulario
- Preparado para despliegue en VPS con Docker y Nginx

## Requisitos

- Node.js compatible con Next.js 16
- npm

## Instalacion

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abrir:

```bash
http://localhost:3000
```

## Verificacion

```bash
npm run lint
npm run build
```

## Variables de entorno

Copiar `.env.example` a `.env.local` en desarrollo y configurar los valores reales en el VPS:

```bash
GOOGLE_SCRIPT_WEBHOOK_URL=
GOOGLE_SCRIPT_SECRET=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASSWORD=
WAITLIST_NOTIFY_TO=
WAITLIST_NOTIFY_FROM=
WAITLIST_SHEET_URL=
```

En desarrollo, si falta `TURNSTILE_SECRET_KEY`, el endpoint permite un bypass controlado con warning en consola. En produccion Turnstile es obligatorio.

## Estado del waitlist

El formulario de lista de espera envia datos a `/api/waitlist`.

Actualmente la API:

- Valida email obligatorio.
- Valida perfil profesional si llega informado.
- Valida aceptacion obligatoria de privacidad.
- Filtra honeypot y envios demasiado rapidos.
- Valida Cloudflare Turnstile en servidor.
- Aplica un rate limit sencillo en memoria.
- Envia los datos a Google Apps Script para guardar en Google Sheets.
- Si Google Sheets persiste el lead, envia el aviso interno por SMTP IONOS desde Next.js.

El punto de integracion con Google Sheets esta en:

```txt
lib/waitlist.ts
```

El punto de integracion SMTP esta en:

```txt
lib/notify.ts
```

Mas detalle en [docs/WAITLIST.md](docs/WAITLIST.md) y [docs/GOOGLE_SHEETS_WAITLIST.md](docs/GOOGLE_SHEETS_WAITLIST.md).

## Documentacion

- [Despliegue en VPS](docs/DEPLOY_VPS.md)
- [Waitlist](docs/WAITLIST.md)
- [Google Sheets Waitlist](docs/GOOGLE_SHEETS_WAITLIST.md)

## Pendientes antes de produccion

- Revisar textos legales con asesoria o responsable legal.
- Crear imagen Open Graph 1200x630 en `/public/og/darquis-og.png`.
- Revisar vulnerabilidades moderadas cuando Next publique un parche compatible.
- Configurar dominio `darquis.com` y despliegue en VPS detras de Nginx.

## Comandos utiles

```bash
npm install
npm run dev
npm run lint
npm run build
```
