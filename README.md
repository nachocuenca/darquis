# Darquis Landing V1

Landing pre-MVP para Darquis, orientada a validar interés y captar registros cualificados en una lista de espera.

Darquis es un software en desarrollo para arquitectos, arquitectos técnicos/aparejadores e ingenieros vinculados a edificación, certificados, informes, memorias técnicas, aperturas y documentación administrativa.

La V1 no vende el producto ni muestra una demo falsa: comunica el posicionamiento del proyecto y recoge solicitudes de acceso.

## Stack Técnico

- Next.js con App Router
- TypeScript
- Tailwind CSS
- React
- Endpoint interno `/api/waitlist`
- Google Apps Script como webhook ligero hacia Google Sheets
- Cloudflare Turnstile, honeypot y rate limit sencillo para proteger el formulario
- Preparado para despliegue en VPS con Docker y Nginx

## Requisitos

- Node.js compatible con Next.js 16
- npm

## Instalación

```bash
npm install
```

## Desarrollo Local

```bash
npm run dev
```

Abrir:

```bash
http://localhost:3000
```

## Verificación

```bash
npm run lint
npm run build
```

## Variables de Entorno

Copiar `.env.example` a `.env.local` en desarrollo y configurar los valores reales en el VPS:

```bash
GOOGLE_SCRIPT_WEBHOOK_URL=
GOOGLE_SCRIPT_SECRET=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

En desarrollo, si falta `TURNSTILE_SECRET_KEY`, el endpoint permite un bypass controlado con warning en consola. En producción Turnstile es obligatorio.

## Estado del Waitlist

El formulario de lista de espera envía datos a `/api/waitlist`.

Actualmente la API:

- Valida email obligatorio.
- Valida perfil profesional si llega informado.
- Valida aceptación obligatoria de privacidad.
- Filtra honeypot y envíos demasiado rápidos.
- Valida Cloudflare Turnstile en servidor.
- Aplica un rate limit sencillo en memoria.
- Envía los datos a Google Apps Script para guardar en Google Sheets y notificar por email.

El punto de integración está en:

```txt
lib/waitlist.ts
```

Más detalle en [docs/WAITLIST.md](docs/WAITLIST.md) y [docs/GOOGLE_SHEETS_WAITLIST.md](docs/GOOGLE_SHEETS_WAITLIST.md).

## Documentación

- [Despliegue en VPS](docs/DEPLOY_VPS.md)
- [Waitlist](docs/WAITLIST.md)
- [Google Sheets Waitlist](docs/GOOGLE_SHEETS_WAITLIST.md)

## Pendientes Antes de Producción

- Revisar textos legales con asesoría o responsable legal.
- Crear imagen Open Graph 1200x630 en `/public/og/darquis-og.png`.
- Revisar vulnerabilidades moderadas cuando Next publique un parche compatible.
- Configurar dominio `darquis.com` y despliegue en VPS detrás de Nginx.

## Comandos Útiles

```bash
npm install
npm run dev
npm run lint
npm run build
```
