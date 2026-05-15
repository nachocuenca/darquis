# Darquis landing V1

Landing pre-MVP para validar interés y captar registros cualificados en lista de espera.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Endpoint provisional `/api/waitlist`

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Verificación

```bash
npm run lint
npm run build
```

## Pendientes antes de publicar

- Conectar persistencia real para la lista de espera en `lib/waitlist.ts`.
- Generar una imagen Open Graph 1200x630 y añadirla a `app/layout.tsx`.
- Crear las páginas legales reales si se enlazan desde el footer.
