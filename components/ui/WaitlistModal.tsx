"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { visualAssets } from "@/components/visual/visual-assets";
import { landing } from "@/content/landing";

const WAITLIST_EVENT = "darquis:open-waitlist";

type WaitlistTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

export function openWaitlistModal() {
  window.dispatchEvent(new CustomEvent(WAITLIST_EVENT));
}

export function WaitlistTrigger({
  children = landing.waitlist.cta,
  className,
  onClick,
  type,
  ...props
}: WaitlistTriggerProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (!event.defaultPrevented) {
      openWaitlistModal();
    }
  }

  return (
    <button
      {...props}
      className={className}
      type={type ?? "button"}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export function WaitlistModal() {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    function handleOpen() {
      setIsOpen(true);
    }

    window.addEventListener(WAITLIST_EVENT, handleOpen);
    return () => window.removeEventListener(WAITLIST_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
      <button
        className="absolute inset-0 bg-[rgba(7,19,28,0.42)] backdrop-blur-sm"
        type="button"
        aria-label="Cerrar formulario de lista de espera"
        onClick={() => setIsOpen(false)}
      />

      <div
        className="darquis-modal-panel darquis-blueprint-shell relative w-full max-w-[52rem] overflow-hidden rounded-xl border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(232,246,248,0.90))] shadow-[0_34px_110px_rgba(5,30,44,0.30)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        {/* Decorative background — kept outside scroll so it always fills the visible panel */}
        <Image
          src={visualAssets.ambient}
          alt=""
          fill
          sizes="52rem"
          className="pointer-events-none object-cover opacity-[0.16] mix-blend-multiply"
        />
        <div className="absolute inset-0 darquis-grid opacity-[0.30]" aria-hidden="true" />
        <div className="darquis-modal-lines absolute inset-0" aria-hidden="true" />
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full text-[var(--darquis-blue)]"
          fill="none"
          viewBox="0 0 820 520"
          preserveAspectRatio="none"
        >
          <path
            className="darquis-line-draw darquis-line-draw-slow"
            d="M28 420C138 260 268 342 376 214C498 72 642 126 792 44"
            stroke="currentColor"
            strokeOpacity="0.16"
          />
          <path d="M70 82h166M652 440h112M690 0v120M128 380v140" stroke="currentColor" strokeOpacity="0.11" />
          <circle cx="376" cy="214" r="5" fill="currentColor" fillOpacity="0.22" />
        </svg>

        {/* Scrollable content — constrained to viewport height so the form is always reachable */}
        <div className="relative flex max-h-[calc(100dvh-4rem)] flex-col overflow-y-auto overscroll-contain">
          {/* Sticky close button — stays visible as user scrolls */}
          <div className="sticky top-0 z-10 flex justify-end px-4 pt-4 sm:px-6 sm:pt-5">
            <button
              className="darquis-focus flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(35,151,173,0.18)] bg-white/90 text-sm font-semibold text-[var(--darquis-ink)] shadow-sm transition hover:-translate-y-0.5 hover:border-[rgba(35,151,173,0.38)]"
              type="button"
              aria-label="Cerrar"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          {/* Content grid */}
          <div className="relative grid gap-5 px-4 pb-5 pt-2 sm:px-6 sm:pb-6 lg:grid-cols-[0.72fr_1fr] lg:items-center">
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--darquis-blue-dark)]">
                Lista de espera
              </p>
              <h2
                id={titleId}
                className="mt-3 text-2xl font-semibold leading-tight text-[var(--darquis-ink)] sm:text-3xl lg:text-4xl"
              >
                Únete a las primeras versiones de
                <span className="mt-1 block">
                  <Image
                    src="/brand/darquis-marca-normal.png"
                    alt="Darquis"
                    width={244}
                    height={72}
                    className="-ml-1 h-12 w-auto sm:h-16 lg:h-20"
                  />
                </span>
              </h2>
              <p id={descriptionId} className="mt-3 text-sm leading-6 text-[var(--darquis-muted)] sm:text-base sm:leading-7">
                Déjanos tu email profesional y tu perfil. Te avisaremos cuando abramos el acceso para probar el software con técnicos reales.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Acceso prioritario", "Sin compromiso"].map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-[rgba(35,151,173,0.18)] bg-white/78 px-3 py-1.5 text-sm font-semibold text-[var(--darquis-blue-dark)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <WaitlistForm ctaLabel={landing.waitlist.cta} source="modal" />
          </div>
        </div>
      </div>
    </div>
  );
}
