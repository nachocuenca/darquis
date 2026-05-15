import { landing } from "@/content/landing";

export type ProfessionalProfile = (typeof landing.profiles)[number]["value"];

export type WaitlistLead = {
  email: string;
  profile?: ProfessionalProfile;
  source?: string;
  privacyAccepted: true;
};

export type WaitlistErrors = {
  email?: string;
  profile?: string;
  privacyAccepted?: string;
};

type ValidationResult =
  | { success: true; data: WaitlistLead }
  | { success: false; errors: WaitlistErrors };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const profileValues = new Set<string>(landing.profiles.map((profile) => profile.value));

export function validateWaitlistInput(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { success: false, errors: { email: "Introduce un email válido." } };
  }

  const data = input as Record<string, unknown>;
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const profile = typeof data.profile === "string" ? data.profile.trim() : "";
  const source = typeof data.source === "string" ? data.source.trim() : undefined;
  const privacyAccepted = data.privacyAccepted === true;
  const errors: WaitlistErrors = {};

  if (!email || !emailPattern.test(email)) {
    errors.email = "Introduce un email válido.";
  }

  if (profile && !profileValues.has(profile)) {
    errors.profile = "Selecciona un perfil profesional válido.";
  }

  if (!privacyAccepted) {
    errors.privacyAccepted = "Debes aceptar la política de privacidad para apuntarte.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      email,
      ...(profile ? { profile: profile as ProfessionalProfile } : {}),
      ...(source ? { source } : {}),
      privacyAccepted: true,
    },
  };
}
