import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { landing } from "@/content/landing";

export function Waitlist() {
  return (
    <section id="lista-de-espera" className="relative px-4 py-10 sm:px-6 sm:py-14">
      <div className="darquis-cloud darquis-cloud-c" aria-hidden="true" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-7 lg:grid-cols-[0.86fr_0.92fr]">
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--darquis-blue-dark)]">
            Lista de espera
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--darquis-ink)] sm:text-4xl">
            {landing.waitlist.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[var(--darquis-muted)] sm:text-lg lg:mx-0">
            {landing.waitlist.text}
          </p>
          <p className="mt-4 text-sm font-medium text-[var(--darquis-blue-dark)]">
            {landing.waitlist.microcopy}
          </p>
        </div>

        <WaitlistForm ctaLabel={landing.waitlist.cta} source="final" />
      </div>
    </section>
  );
}
