import { validateWaitlistInput } from "@/lib/validations";
import {
  checkWaitlistRateLimit,
  checkWaitlistTiming,
  getClientIp,
  getTurnstileSiteKey,
  registerWaitlistLead,
  verifyTurnstileToken,
  WaitlistIntegrationError,
} from "@/lib/waitlist";

const successMessage =
  "Gracias por apuntarte. Te avisaremos en cuanto el acceso esté disponible para los primeros usuarios de Darquis.";

export async function GET() {
  const turnstileSiteKey = getTurnstileSiteKey();
  const isProduction = process.env.NODE_ENV === "production";

  return Response.json({
    turnstileSiteKey: turnstileSiteKey || null,
    turnstileRequired: isProduction,
    devBypass: !isProduction && !turnstileSiteKey,
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      {
        success: false,
        message: "No hemos podido leer la solicitud. Revisa los datos e inténtalo de nuevo.",
      },
      { status: 400 },
    );
  }

  const validation = validateWaitlistInput(payload);

  if (!validation.success) {
    return Response.json(
      {
        success: false,
        message: "Revisa los campos marcados antes de continuar.",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const lead = validation.data;

  if (lead.website) {
    return Response.json({
      success: true,
      persisted: false,
      message: successMessage,
    });
  }

  const timing = checkWaitlistTiming(lead.startedAt);
  if (!timing.allowed) {
    return Response.json(
      {
        success: false,
        message: "No hemos podido verificar el envío. Espera unos segundos e inténtalo de nuevo.",
      },
      { status: 400 },
    );
  }

  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? undefined;
  const rateLimit = checkWaitlistRateLimit({ ip, email: lead.email });

  if (!rateLimit.allowed) {
    return Response.json(
      {
        success: false,
        message: "Hemos recibido demasiados intentos seguidos. Inténtalo de nuevo en unos minutos.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const turnstile = await verifyTurnstileToken(lead.turnstileToken, ip);
  if (!turnstile.success) {
    const isServerConfigError = turnstile.status === "missing-secret";

    return Response.json(
      {
        success: false,
        message: isServerConfigError
          ? "La lista de espera no está configurada correctamente. Inténtalo de nuevo más tarde."
          : "No hemos podido verificar que la solicitud sea legítima. Actualiza el formulario e inténtalo de nuevo.",
        errors: isServerConfigError ? undefined : { turnstileToken: "Verificación no válida." },
      },
      { status: isServerConfigError ? 503 : 400 },
    );
  }

  try {
    const result = await registerWaitlistLead(lead, {
      createdAt: new Date().toISOString(),
      ip,
      userAgent,
      turnstileStatus: turnstile.status,
    });

    return Response.json({
      success: true,
      persisted: result.persisted,
      message: successMessage,
    });
  } catch (error) {
    console.error("Waitlist registration failed", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof WaitlistIntegrationError && error.code === "missing-config"
            ? "La lista de espera no está configurada correctamente. Inténtalo de nuevo más tarde."
            : "No hemos podido registrar la solicitud ahora mismo. Inténtalo de nuevo en unos minutos.",
      },
      {
        status:
          error instanceof WaitlistIntegrationError && error.code === "missing-config"
            ? 503
            : 500,
      },
    );
  }
}
