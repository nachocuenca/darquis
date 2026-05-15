"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { landing } from "@/content/landing";
import { validateWaitlistInput, type WaitlistErrors } from "@/lib/validations";

type WaitlistFormProps = {
  ctaLabel: string;
  source: "hero" | "final";
};

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistForm({ ctaLabel, source }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<WaitlistErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setFieldErrors({});

    const validation = validateWaitlistInput({ email, profile, privacyAccepted, source });

    if (!validation.success) {
      setStatus("error");
      setFieldErrors(validation.errors);
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        errors?: WaitlistErrors;
      };

      if (!response.ok || !result.success) {
        setStatus("error");
        setFieldErrors(result.errors ?? {});
        setMessage(result.message ?? "No hemos podido registrar la solicitud.");
        return;
      }

      setStatus("success");
      setEmail("");
      setProfile("");
      setPrivacyAccepted(false);
      setMessage(result.message ?? landing.waitlist.confirmationText);
    } catch {
      setStatus("error");
      setMessage("No hemos podido conectar con el servidor. Inténtalo de nuevo en unos minutos.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-lg border border-[rgba(35,151,173,0.22)] bg-white p-5 shadow-[0_18px_55px_rgba(16,24,32,0.08)] sm:p-6"
        role="status"
        aria-live="polite"
      >
        <p className="text-base font-semibold text-[var(--darquis-ink)]">
          {landing.waitlist.confirmationTitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--darquis-muted)]">
          {message || landing.waitlist.confirmationText}
        </p>
      </div>
    );
  }

  const emailErrorId = `${source}-email-error`;
  const privacyErrorId = `${source}-privacy-error`;
  const formStatusId = `${source}-form-status`;

  return (
    <form
      className="rounded-lg border border-[var(--darquis-border)] bg-white p-4 shadow-[0_18px_55px_rgba(16,24,32,0.08)] sm:p-5"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--darquis-ink)]" htmlFor={`${source}-email`}>
            Email profesional
          </label>
          <input
            id={`${source}-email`}
            className="darquis-focus h-12 w-full rounded-lg border border-[var(--darquis-border)] bg-white px-4 text-base text-[var(--darquis-ink)] shadow-sm transition placeholder:text-slate-400"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nombre@estudio.com"
            autoComplete="email"
            aria-describedby={fieldErrors.email ? emailErrorId : undefined}
            aria-invalid={Boolean(fieldErrors.email)}
            required
          />
          {fieldErrors.email ? (
            <p id={emailErrorId} className="mt-2 text-sm font-medium text-red-700">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--darquis-ink)]" htmlFor={`${source}-profile`}>
            Perfil profesional
          </label>
          <select
            id={`${source}-profile`}
            className="darquis-focus h-12 w-full rounded-lg border border-[var(--darquis-border)] bg-white px-4 text-base text-[var(--darquis-ink)] shadow-sm transition"
            value={profile}
            onChange={(event) => setProfile(event.target.value)}
          >
            <option value="">Selecciona una opción</option>
            {landing.profiles.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-[rgba(16,24,32,0.08)] bg-[#fbfdfe] p-3">
          <label className="flex gap-3 text-sm leading-6 text-[var(--darquis-muted)]" htmlFor={`${source}-privacy`}>
            <input
              id={`${source}-privacy`}
              className="darquis-focus mt-1 h-4 w-4 shrink-0 rounded border-[var(--darquis-border)] accent-[var(--darquis-blue)]"
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => setPrivacyAccepted(event.target.checked)}
              aria-describedby={fieldErrors.privacyAccepted ? privacyErrorId : undefined}
              aria-invalid={Boolean(fieldErrors.privacyAccepted)}
              required
            />
            <span>
              Acepto la{" "}
              <Link
                className="darquis-focus rounded-sm font-medium text-[var(--darquis-blue-dark)] underline underline-offset-4"
                href="/privacidad"
              >
                política de privacidad
              </Link>{" "}
              y el tratamiento de mis datos para recibir información sobre Darquis.
            </span>
          </label>
          {fieldErrors.privacyAccepted ? (
            <p id={privacyErrorId} className="mt-2 text-sm font-medium text-red-700">
              {fieldErrors.privacyAccepted}
            </p>
          ) : null}
        </div>

        <button
          className="darquis-focus flex h-12 w-full items-center justify-center rounded-lg bg-[var(--darquis-blue)] px-5 text-base font-semibold text-white shadow-[0_16px_35px_rgba(35,151,173,0.25)] transition hover:bg-[var(--darquis-blue-dark)] disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Enviando..." : ctaLabel}
        </button>
      </div>

      <div id={formStatusId} className="mt-3 min-h-6" aria-live="polite">
        {message && status === "error" ? (
          <p className="text-sm leading-6 text-red-700">{message}</p>
        ) : null}
      </div>
    </form>
  );
}
