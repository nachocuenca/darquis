import { validateWaitlistInput } from "@/lib/validations";
import { registerWaitlistLead } from "@/lib/waitlist";

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

  try {
    await registerWaitlistLead(validation.data);

    return Response.json({
      success: true,
      persisted: false,
      message:
        "Gracias por apuntarte. Te avisaremos en cuanto el acceso esté disponible para los primeros usuarios de Darquis.",
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "No hemos podido registrar la solicitud ahora mismo. Inténtalo de nuevo en unos minutos.",
      },
      { status: 500 },
    );
  }
}
