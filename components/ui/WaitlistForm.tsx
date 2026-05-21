"use client";

import Link from "next/link";
import Script from "next/script";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { landing } from "@/content/landing";
import { validateWaitlistInput, type WaitlistErrors } from "@/lib/validations";

type WaitlistFormProps = {
  ctaLabel?: string;
  source?: string;
};

type Status = "idle" | "loading" | "success" | "error";

type WaitlistConfig = {
  turnstileSiteKey?: string | null;
  turnstileRequired?: boolean;
  devBypass?: boolean;
};

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement | string, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function WaitlistForm({
  ctaLabel = landing.waitlist.cta,
  source = "modal",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [website, setWebsite] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [turnstileConfig, setTurnstileConfig] = useState<WaitlistConfig>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<WaitlistErrors>({});

  const resetTurnstile = useCallback(() => {
    setTurnstileToken("");
    setTurnstileResetSignal((value) => value + 1);
  }, []);

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileError = useCallback((errorMessage: string) => {
    setTurnstileToken("");
    setStatus("error");
    setMessage(errorMessage);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        const response = await fetch("/api/waitlist", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const config = (await response.json()) as WaitlistConfig;
        if (!isMounted) {
          return;
        }

        setTurnstileConfig(config);

        if (config.devBypass) {
          console.warn(
            "Darquis waitlist: NEXT_PUBLIC_TURNSTILE_SITE_KEY is not configured. Development mode continues without the Turnstile widget.",
          );
        }
      } catch (error) {
        console.warn("Darquis waitlist: unable to load Turnstile configuration.", error);
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setFieldErrors({});

    if (turnstileConfig.turnstileSiteKey && !turnstileToken) {
      setStatus("error");
      setMessage("Estamos preparando la verificación. Espera unos segundos e inténtalo de nuevo.");
      return;
    }

    const validation = validateWaitlistInput({
      email,
      profile,
      privacyAccepted,
      source,
      turnstileToken,
      website,
      startedAt,
    });

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
        resetTurnstile();
        return;
      }

      setStatus("success");
      setEmail("");
      setProfile("");
      setPrivacyAccepted(false);
      setWebsite("");
      setStartedAt(Date.now());
      resetTurnstile();
      setMessage(result.message ?? landing.waitlist.confirmationText);
    } catch {
      setStatus("error");
      setMessage("No hemos podido conectar con el servidor. Inténtalo de nuevo en unos minutos.");
      resetTurnstile();
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-lg border border-[rgba(35,151,173,0.22)] bg-white/95 p-5 shadow-[0_18px_45px_rgba(35,75,105,0.10)]"
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
  const profileErrorId = `${source}-profile-error`;
  const privacyErrorId = `${source}-privacy-error`;
  const formStatusId = `${source}-form-status`;
  const turnstileSiteKey = turnstileConfig.turnstileSiteKey ?? "";

  return (
    <form
      className="relative rounded-lg border border-[rgba(35,151,173,0.18)] bg-white/86 p-4 shadow-[0_20px_60px_rgba(35,75,105,0.12)] backdrop-blur sm:p-5"
      onSubmit={handleSubmit}
      noValidate
    >
      <HoneypotField
        source={source}
        value={website}
        onChange={setWebsite}
      />
      <input type="hidden" name="startedAt" value={startedAt} readOnly />
      <input type="hidden" name="turnstileToken" value={turnstileToken} readOnly />

      <div className="grid gap-4">
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-[var(--darquis-ink)]"
            htmlFor={`${source}-email`}
          >
            Email profesional
          </label>
          <input
            id={`${source}-email`}
            className="darquis-focus h-13 w-full rounded-lg border border-[var(--darquis-border)] bg-white px-4 text-[1.02rem] text-[var(--darquis-ink)] shadow-sm transition placeholder:text-slate-400 hover:border-[rgba(35,151,173,0.42)]"
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
            <p id={emailErrorId} className="mt-1.5 text-sm font-medium text-red-700">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-semibold text-[var(--darquis-ink)]"
            htmlFor={`${source}-profile`}
          >
            Perfil profesional
          </label>
          <select
            id={`${source}-profile`}
            className="darquis-focus h-13 w-full rounded-lg border border-[var(--darquis-border)] bg-white px-4 text-[1.02rem] text-[var(--darquis-ink)] shadow-sm transition hover:border-[rgba(35,151,173,0.42)]"
            value={profile}
            onChange={(event) => setProfile(event.target.value)}
            aria-describedby={fieldErrors.profile ? profileErrorId : undefined}
            aria-invalid={Boolean(fieldErrors.profile)}
          >
            <option value="">Selecciona una opción</option>
            {landing.profiles.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.profile ? (
            <p id={profileErrorId} className="mt-1.5 text-sm font-medium text-red-700">
              {fieldErrors.profile}
            </p>
          ) : null}
        </div>

        <div>
          <PrivacyField
            source={source}
            checked={privacyAccepted}
            onChange={setPrivacyAccepted}
            error={fieldErrors.privacyAccepted}
            errorId={privacyErrorId}
          />
        </div>

        {turnstileSiteKey ? (
          <TurnstileWidget
            siteKey={turnstileSiteKey}
            resetSignal={turnstileResetSignal}
            onTokenChange={handleTurnstileToken}
            onError={handleTurnstileError}
          />
        ) : null}

        <button
          className="darquis-focus mt-1 flex h-13 w-full items-center justify-center rounded-lg bg-[var(--darquis-blue)] px-5 text-[1.05rem] font-semibold text-white shadow-none transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--darquis-blue-dark)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Enviando..." : ctaLabel}
        </button>
      </div>

      <div id={formStatusId} className="mt-2 min-h-5" aria-live="polite">
        {message && status === "error" ? (
          <p className="text-sm leading-6 text-red-700">{message}</p>
        ) : null}
      </div>
    </form>
  );
}

function HoneypotField({
  source,
  value,
  onChange,
}: {
  source: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
      aria-hidden="true"
    >
      <label htmlFor={`${source}-website`}>Website</label>
      <input
        id={`${source}-website`}
        name="website"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

function TurnstileWidget({
  siteKey,
  resetSignal,
  onTokenChange,
  onError,
}: {
  siteKey: string;
  resetSignal: number;
  onTokenChange: (token: string) => void;
  onError: (message: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const handleScriptReady = useCallback(() => {
    setScriptReady(true);
  }, []);

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile || widgetIdRef.current) {
      return;
    }

    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
      size: "flexible",
      callback: onTokenChange,
      "expired-callback": () => onTokenChange(""),
      "error-callback": () => {
        onTokenChange("");
        onError("No hemos podido cargar la verificación. Inténtalo de nuevo.");
      },
    });

    widgetIdRef.current = widgetId;

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = null;
    };
  }, [onError, onTokenChange, scriptReady, siteKey]);

  useEffect(() => {
    if (resetSignal === 0 || !widgetIdRef.current || !window.turnstile) {
      return;
    }

    window.turnstile.reset(widgetIdRef.current);
    onTokenChange("");
  }, [onTokenChange, resetSignal]);

  return (
    <div className="min-h-[65px] overflow-hidden rounded-lg border border-[rgba(16,24,32,0.08)] bg-[#fbfdfe]/92 px-2 py-2">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={handleScriptReady}
        onReady={handleScriptReady}
      />
      <div ref={containerRef} className="min-h-[52px] w-full" />
    </div>
  );
}

function PrivacyField({
  source,
  checked,
  onChange,
  error,
  errorId,
}: {
  source: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  errorId: string;
}) {
  return (
    <div className="rounded-lg border border-[rgba(16,24,32,0.08)] bg-[#fbfdfe]/92 px-3 py-3">
      <label
        className="flex gap-2.5 text-left text-sm leading-6 text-[var(--darquis-muted)]"
        htmlFor={`${source}-privacy`}
      >
        <input
          id={`${source}-privacy`}
          className="darquis-focus mt-1 h-4 w-4 shrink-0 rounded border-[var(--darquis-border)] accent-[var(--darquis-blue)]"
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          required
        />
        <span>
          Acepto la{" "}
          <Link
            className="darquis-focus rounded-sm font-semibold text-[var(--darquis-blue-dark)] underline underline-offset-4"
            href="/privacidad"
          >
            política de privacidad
          </Link>{" "}
          y solicito recibir información sobre el acceso privado y las primeras pruebas de Darquis.
        </span>
      </label>
      {error ? (
        <p id={errorId} className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
