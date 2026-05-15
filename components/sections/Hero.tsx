import Image from "next/image";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { landing } from "@/content/landing";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="darquis-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-9 px-4 py-10 sm:px-6 sm:py-14 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.92fr)] lg:gap-12 lg:px-8 lg:py-16">
        <div className="min-w-0 max-w-3xl">
          <p className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[rgba(35,151,173,0.18)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[var(--darquis-blue-dark)] shadow-sm sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--darquis-blue)]" aria-hidden="true" />
            <span className="truncate">{landing.hero.eyebrow}</span>
          </p>
          <h1 className="max-w-4xl text-[2.15rem] font-semibold leading-[1.06] text-[var(--darquis-ink)] sm:text-5xl lg:text-[4.25rem]">
            {landing.hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--darquis-muted)] sm:mt-6 sm:text-xl sm:leading-8">
            {landing.hero.subtitle}
          </p>

          <div className="mt-7 max-w-xl sm:mt-8">
            <WaitlistForm ctaLabel={landing.hero.cta} source="hero" />
            <p className="mt-3 text-sm leading-6 text-[var(--darquis-muted)]">
              {landing.hero.microcopy}
            </p>
          </div>
        </div>

        <DocumentVisual />
      </div>
    </section>
  );
}

function DocumentVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-[38rem] lg:justify-self-end" aria-hidden="true">
      <div className="relative overflow-hidden rounded-lg border border-[rgba(16,24,32,0.08)] bg-white p-4 shadow-[0_28px_80px_rgba(16,24,32,0.14)] sm:p-6">
        <div className="absolute left-5 top-7 h-[72%] w-10 rounded-md border border-[rgba(35,151,173,0.22)] bg-[var(--darquis-blue-soft)]" />
        <div className="absolute left-9 top-5 h-[78%] w-10 rounded-md border border-[rgba(35,151,173,0.22)] bg-white" />

        <div className="relative ml-10 rounded-lg border border-[rgba(16,24,32,0.08)] bg-[#fbfdfe] p-4 sm:ml-14 sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-[var(--darquis-border)] pb-4">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/darquis-logo-normal.png"
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 sm:h-12 sm:w-12"
              />
              <div>
                <div className="h-2.5 w-28 rounded-full bg-slate-900/85 sm:w-36" />
                <div className="mt-2 h-2 w-20 rounded-full bg-slate-200 sm:w-24" />
              </div>
            </div>
            <div className="hidden h-9 w-24 rounded-lg border border-[rgba(35,151,173,0.2)] bg-[var(--darquis-blue-soft)] sm:block" />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_0.72fr]">
            <div className="rounded-lg border border-[var(--darquis-border)] bg-white p-3 sm:p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-2.5 w-28 rounded-full bg-slate-800/80 sm:w-36" />
                <div className="h-2.5 w-10 rounded-full bg-[var(--darquis-blue)]" />
              </div>
              <div className="space-y-3">
                {[92, 74, 86, 62].map((width) => (
                  <div key={width} className="rounded-lg border border-slate-200 bg-[#fbfdfe] p-3">
                    <div className="h-2 rounded-full bg-slate-200" style={{ width: `${width}%` }} />
                    <div
                      className="mt-2 h-2 rounded-full bg-[rgba(35,151,173,0.18)]"
                      style={{ width: `${Math.max(width - 18, 36)}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:block sm:space-y-4">
              <div className="rounded-lg border border-[rgba(35,151,173,0.2)] bg-[var(--darquis-blue-soft)] p-4">
                <div className="h-2.5 w-24 rounded-full bg-[var(--darquis-blue-dark)]" />
                <div className="mt-4 space-y-2">
                  <div className="h-2 rounded-full bg-white" />
                  <div className="h-2 w-5/6 rounded-full bg-white" />
                  <div className="h-2 w-3/5 rounded-full bg-white" />
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="h-2.5 w-20 rounded-full bg-slate-800/80" />
                <div className="mt-5 h-px w-full bg-slate-200" />
                <div className="mt-3 h-8 rounded-lg border border-dashed border-[rgba(35,151,173,0.36)] bg-[#fbfdfe]" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["PDF", "Revisión", "Firma", "Presentación"].map((item) => (
              <span
                key={item}
                className="rounded-lg border border-[rgba(35,151,173,0.18)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--darquis-blue-dark)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
