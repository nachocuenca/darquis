import { landing } from "@/content/landing";

export type ProfessionalProfile = (typeof landing.profiles)[number]["value"];

export type WaitlistLead = {
  email: string;
  profile?: ProfessionalProfile;
  source?: string;
  privacyAccepted: true;
  turnstileToken?: string;
  website?: string;
  startedAt?: number;
};

export type WaitlistErrors = {
  email?: string;
  profile?: string;
  privacyAccepted?: string;
  turnstileToken?: string;
};

type ValidationResult =
  | { success: true; data: WaitlistLead }
  | { success: false; errors: WaitlistErrors };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxEmailLength = 254;
const maxSourceLength = 80;
const maxTurnstileTokenLength = 2048;
const profileValues = new Set<string>(landing.profiles.map((profile) => profile.value));
const profileLabels = new Map<string, string>(
  landing.profiles.map((profile) => [profile.value, profile.label]),
);

export function validateWaitlistInput(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { success: false, errors: { email: "Introduce un email válido." } };
  }

  const data = input as Record<string, unknown>;
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const profile = typeof data.profile === "string" ? data.profile.trim() : "";
  const source = typeof data.source === "string" ? data.source.trim().slice(0, maxSourceLength) : undefined;
  const turnstileToken =
    typeof data.turnstileToken === "string"
      ? data.turnstileToken.trim().slice(0, maxTurnstileTokenLength)
      : "";
  const website = typeof data.website === "string" ? data.website.trim() : "";
  const startedAt = parseStartedAt(data.startedAt);
  const privacyAccepted = data.privacyAccepted === true;
  const errors: WaitlistErrors = {};

  if (!email || email.length > maxEmailLength || !emailPattern.test(email)) {
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
      ...(turnstileToken ? { turnstileToken } : {}),
      ...(website ? { website } : {}),
      ...(typeof startedAt === "number" ? { startedAt } : {}),
    },
  };
}

export function getProfessionalProfileLabel(profile?: ProfessionalProfile) {
  if (!profile) {
    return "";
  }

  return profileLabels.get(profile) ?? profile;
}

function parseStartedAt(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}
