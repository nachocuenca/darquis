import Image from "next/image";
import { WaitlistTrigger } from "@/components/ui/WaitlistModal";
import { visualAssets } from "@/components/visual/visual-assets";
import { landing } from "@/content/landing";

export function Waitlist() {
  return (
    <section id="lista-de-espera" className="relative px-4 py-10 sm:px-6 sm:py-14">
      <div className="darquis-cloud darquis-cloud-c" aria-hidden="true" />

      <div className="darquis-reveal darquis-blueprint-shell relative mx-auto grid w-full max-w-6xl items-center gap-7 overflow-hidden rounded-lg border border-[rgba(35,151,173,0.20)] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(232,246,248,0.80))] p-5 shadow-[0_24px_70px_rgba(35,75,105,0.13)] sm:p-7 lg:grid-cols-[0.9fr_0.72fr] lg:p-9">
        <Image
          src={visualAssets.ambient}
          alt=""
          fill
          sizes="(min-width: 1024px) 72rem, 100vw"
          className="pointer-events-none object-cover opacity-[0.24] mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.96),rgba(255,255,255,0.76))]" />
        <div className="absolute inset-0 darquis-grid opacity-[0.32]" aria-hidden="true" />
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full text-[var(--darquis-blue)]"
          fill="none"
          viewBox="0 0 1120 380"
          preserveAspectRatio="none"
        >
          <path
            className="darquis-line-draw darquis-line-draw-slow"
            d="M30 300C180 180 310 250 470 126C640 -6 790 80 1090 42"
            stroke="currentColor"
            strokeOpacity="0.12"
          />
          <path d="M64 64h160M896 300h160M244 0v92M890 288v92" stroke="currentColor" strokeOpacity="0.10" />
        </svg>
        <div className="relative text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--darquis-blue-dark)]">
            {landing.waitlist.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--darquis-ink)] sm:text-4xl">
            {landing.waitlist.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[var(--darquis-muted)] sm:text-lg lg:mx-0">
            {landing.waitlist.text}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
            {["Acceso prioritario", "Sin compromiso"].map((item) => (
              <span
                key={item}
                className="rounded-md border border-[rgba(35,151,173,0.18)] bg-white/80 px-3 py-1.5 text-sm font-semibold text-[var(--darquis-blue-dark)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative rounded-lg border border-[rgba(35,151,173,0.16)] bg-white/78 p-4 shadow-[0_20px_54px_rgba(35,75,105,0.11)] backdrop-blur sm:p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--darquis-blue-dark)]">
            Acceso temprano
          </p>
          <p className="mt-3 text-lg font-semibold leading-tight text-[var(--darquis-ink)]">
            Déjanos tus datos y te avisamos cuando abramos las primeras pruebas.
          </p>
          <WaitlistTrigger className="darquis-focus mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[var(--darquis-blue)] px-5 text-base font-semibold !text-white shadow-none transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--darquis-blue-dark)]">
            {landing.waitlist.cta}
          </WaitlistTrigger>
          <p className="mt-3 text-sm leading-6 text-[var(--darquis-muted)]">
            Email profesional, perfil opcional y privacidad en un único paso.
          </p>
        </div>
      </div>
    </section>
  );
}
