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

La versión actual no requiere variables de entorno.

Cuando se conecte la persistencia real de la lista de espera, habrá que añadir las variables del proveedor elegido, por ejemplo Supabase, Google Sheets, Airtable, Resend o backend propio.

## Estado del Waitlist

El formulario de lista de espera envía datos a `/api/waitlist`.

Actualmente la API:

- Valida email obligatorio.
- Valida perfil profesional si llega informado.
- Valida aceptación obligatoria de privacidad.
- Devuelve respuesta de éxito si los datos son válidos.
- No persiste todavía los datos en ninguna base de datos ni servicio externo.

El punto preparado para conectar persistencia está en:

```txt
lib/waitlist.ts
```

Más detalle en [docs/WAITLIST.md](docs/WAITLIST.md).

## Documentación

- [Despliegue en VPS](docs/DEPLOY_VPS.md)
- [Waitlist y persistencia futura](docs/WAITLIST.md)

## Pendientes Antes de Producción

- Conectar persistencia real para la lista de espera.
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
