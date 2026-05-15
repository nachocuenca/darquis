import { WaitlistTrigger } from "@/components/ui/WaitlistModal";
import { ProductDashboard } from "@/components/visual/ProductDashboard";
import { landing } from "@/content/landing";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden px-4 pb-8 pt-8 sm:px-6 sm:pb-12 sm:pt-10">
      <div className="darquis-cloud darquis-cloud-a" aria-hidden="true" />
      <div className="darquis-cloud darquis-cloud-b" aria-hidden="true" />
      <div className="darquis-grid absolute inset-x-0 top-0 -z-10 h-full opacity-40" aria-hidden="true" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
          <div className="darquis-hero-copy min-w-0 text-center lg:text-left">
            <p className="inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-[rgba(35,151,173,0.20)] bg-white/80 px-3 py-1.5 text-[clamp(0.62rem,3.2vw,0.875rem)] font-semibold text-[var(--darquis-blue-dark)] shadow-[0_12px_30px_rgba(35,151,173,0.10)] sm:px-3.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--darquis-blue)]" aria-hidden="true" />
              {landing.hero.eyebrow}
            </p>

            <h1 className="mt-5 whitespace-pre-line text-balance text-[2.35rem] font-semibold leading-[1.04] text-[var(--darquis-ink)] sm:text-5xl lg:text-[3.35rem]">
              {landing.hero.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--darquis-muted)] sm:text-lg sm:leading-8 lg:mx-0">
              {landing.hero.subtitle}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
              {landing.hero.bullets.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-[rgba(35,151,173,0.18)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[var(--darquis-blue-dark)] shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mx-auto mt-6 flex max-w-[40rem] flex-col items-center gap-3 lg:mx-0 lg:items-start">
              <WaitlistTrigger className="darquis-focus inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--darquis-blue)] px-6 text-base font-semibold !text-white shadow-none transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--darquis-blue-dark)]">
                {landing.hero.cta}
              </WaitlistTrigger>
              <p className="mt-3 text-center text-sm leading-6 text-[var(--darquis-muted)] lg:text-left">
                {landing.hero.microcopy}
              </p>
            </div>
          </div>

          <ProductDashboard />
        </div>
      </div>
    </section>
  );
}
