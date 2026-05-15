import type { WaitlistLead } from "@/lib/validations";

export async function registerWaitlistLead(lead: WaitlistLead) {
  void lead;

  // TODO: Conectar persistencia real antes de publicar: Supabase, Google Sheets,
  // Airtable, Resend o un backend propio acordado con el cliente.
  return { persisted: false };
}
