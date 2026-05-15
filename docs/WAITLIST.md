# Waitlist

La lista de espera de Darquis está preparada como una integración interna sencilla, sin persistencia real todavía.

## Flujo Actual

1. El usuario completa el formulario.
2. El frontend valida los datos con `validateWaitlistInput`.
3. El formulario envía un `POST` a `/api/waitlist`.
4. La API vuelve a validar los datos en servidor.
5. Si los datos son válidos, llama a `registerWaitlistLead`.
6. `registerWaitlistLead` devuelve `{ persisted: false }` porque todavía no hay proveedor conectado.

## Endpoint

```txt
POST /api/waitlist
```

Archivo:

```txt
app/api/waitlist/route.ts
```

Payload esperado:

```json
{
  "email": "nombre@estudio.com",
  "profile": "arquitecto",
  "privacyAccepted": true,
  "source": "hero"
}
```

Campos:

- `email`: obligatorio.
- `profile`: opcional.
- `privacyAccepted`: obligatorio y debe ser `true`.
- `source`: opcional, permite distinguir formularios como `hero` o `final`.

## Validaciones

Archivo:

```txt
lib/validations.ts
```

La validación comprueba:

- Formato de email.
- Perfil profesional permitido si se envía.
- Aceptación de privacidad.

Perfiles aceptados:

- `arquitecto`
- `arquitecto-tecnico`
- `ingeniero`
- `otro-perfil-tecnico`

## Punto de Integración

Archivo:

```txt
lib/waitlist.ts
```

Función:

```ts
registerWaitlistLead(lead)
```

Aquí debe conectarse la persistencia real.

Opciones previstas:

- Supabase.
- Google Sheets.
- Airtable.
- Resend.
- Backend propio.

## Supabase

Implementación prevista:

1. Crear tabla `waitlist_leads`.
2. Guardar `email`, `profile`, `source`, `privacyAccepted`, fecha de creación y metadatos mínimos.
3. Añadir variables de entorno en local y en el entorno de producción del VPS.
4. Usar clave server-side, nunca exponer claves privadas al cliente.

## Google Sheets

Implementación prevista:

1. Crear hoja con columnas para email, perfil, fuente, aceptación legal y fecha.
2. Crear credenciales server-side.
3. Enviar los datos desde `registerWaitlistLead`.

## Airtable

Implementación prevista:

1. Crear base y tabla de leads.
2. Añadir API key/base ID como variables de entorno.
3. Mapear campos desde `WaitlistLead`.

## Resend

Resend puede usarse para notificaciones internas o confirmaciones por email.

No sustituye por sí solo a una base de datos salvo que se decida tratar el email como única trazabilidad operativa.

## Consideraciones Antes de Producción

- Añadir persistencia real.
- Revisar política de privacidad final.
- Evitar duplicados por email o decidir una estrategia de actualización.
- Añadir rate limiting si el tráfico lo justifica.
- Registrar errores de integración en servidor.
- No guardar datos en `localStorage` como solución final.
