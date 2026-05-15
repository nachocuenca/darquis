import Image from "next/image";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { landing } from "@/content/landing";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden px-4 pb-10 pt-7 sm:px-6 sm:pb-14 sm:pt-9">
      <div className="darquis-cloud darquis-cloud-a" aria-hidden="true" />
      <div className="darquis-cloud darquis-cloud-b" aria-hidden="true" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <div className="min-w-0 text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(35,151,173,0.18)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[var(--darquis-blue-dark)] shadow-[0_10px_30px_rgba(35,151,173,0.10)] sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--darquis-blue)]" aria-hidden="true" />
              {landing.hero.eyebrow}
            </p>

            <h1 className="mt-5 whitespace-pre-line text-balance text-[2.35rem] font-semibold leading-[1.07] text-[var(--darquis-ink)] sm:text-5xl lg:text-[3.65rem]">
              {landing.hero.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--darquis-muted)] sm:text-lg sm:leading-8 lg:mx-0">
              {landing.hero.subtitle}
            </p>

            <div className="mx-auto mt-6 max-w-[36rem] lg:mx-0">
              <WaitlistForm ctaLabel={landing.hero.cta} source="hero" />
              <p className="mt-3 text-center text-sm leading-6 text-[var(--darquis-muted)] lg:text-left">
                {landing.hero.microcopy}
              </p>
            </div>
          </div>

          <DocumentVisual />
        </div>
      </div>
    </section>
  );
}

function DocumentVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-[38rem]" aria-hidden="true">
      <div className="absolute -left-5 top-7 h-44 w-44 rounded-full bg-[rgba(104,132,255,0.16)] blur-3xl" />
      <div className="absolute -right-3 bottom-4 h-56 w-56 rounded-full bg-[rgba(35,151,173,0.18)] blur-3xl" />

      <div className="relative min-h-[19.5rem] overflow-hidden rounded-lg border border-white/80 bg-[linear-gradient(140deg,rgba(255,255,255,0.92),rgba(232,246,248,0.74))] p-4 shadow-[0_24px_70px_rgba(35,75,105,0.16)] sm:min-h-[23rem] sm:p-5">
        <div className="absolute inset-0 darquis-grid opacity-40" />
        <div className="absolute left-5 top-5 h-2 w-2 rounded-full bg-[#ff7c66]" />
        <div className="absolute left-9 top-5 h-2 w-2 rounded-full bg-[#ffd166]" />
        <div className="absolute left-[3.25rem] top-5 h-2 w-2 rounded-full bg-[#52c788]" />

        <div className="relative ml-auto w-[86%] rounded-lg border border-[rgba(35,151,173,0.16)] bg-white/95 p-4 shadow-[0_18px_45px_rgba(35,75,105,0.12)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-[var(--darquis-border)] pb-4">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/darquis-logo-normal.png"
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 object-contain"
              />
              <div>
                <div className="h-2.5 w-28 rounded-full bg-slate-800/80 sm:w-36" />
                <div className="mt-2 h-2 w-20 rounded-full bg-slate-200 sm:w-24" />
              </div>
            </div>
            <div className="hidden h-9 w-24 rounded-lg border border-[rgba(35,151,173,0.20)] bg-[var(--darquis-blue-soft)] sm:block" />
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_0.72fr]">
            <div className="rounded-lg border border-[var(--darquis-border)] bg-[#fbfdfe] p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="h-2.5 w-28 rounded-full bg-slate-800/80" />
                <div className="h-2.5 w-9 rounded-full bg-[var(--darquis-blue)]" />
              </div>
              <div className="space-y-2.5">
                {[92, 74, 86].map((width) => (
                  <div key={width} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="h-2 rounded-full bg-slate-200" style={{ width: `${width}%` }} />
                    <div
                      className="mt-2 h-2 rounded-full bg-[rgba(35,151,173,0.18)]"
                      style={{ width: `${Math.max(width - 20, 42)}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-lg border border-[rgba(35,151,173,0.20)] bg-[var(--darquis-blue-soft)] p-3">
                <div className="h-2.5 w-20 rounded-full bg-[var(--darquis-blue-dark)]" />
                <div className="mt-3 space-y-2">
                  <div className="h-2 rounded-full bg-white" />
                  <div className="h-2 w-5/6 rounded-full bg-white" />
                  <div className="h-2 w-3/5 rounded-full bg-white" />
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="h-2.5 w-16 rounded-full bg-slate-800/80" />
                <div className="mt-4 h-px w-full bg-slate-200" />
                <div className="mt-3 h-7 rounded-lg border border-dashed border-[rgba(35,151,173,0.36)] bg-[#fbfdfe]" />
              </div>
            </div>
          </div>
        </div>

        <FloatingDocument className="left-3 top-20 w-[36%]" titleWidth="68%" lineWidths={[92, 70]} />
        <FloatingDocument className="bottom-5 left-8 w-[31%]" titleWidth="58%" lineWidths={[86, 64]} />
        <FloatingDocument className="bottom-9 right-3 w-[34%]" titleWidth="72%" lineWidths={[88, 52]} highlight />
      </div>
    </div>
  );
}

function FloatingDocument({
  className,
  titleWidth,
  lineWidths,
  highlight = false,
}: {
  className: string;
  titleWidth: string;
  lineWidths: number[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`absolute rounded-lg border border-[rgba(35,151,173,0.20)] bg-white/95 p-3 shadow-[0_16px_38px_rgba(35,75,105,0.14)] ${className}`}
    >
      <div
        className={`h-2.5 rounded-full ${highlight ? "bg-[var(--darquis-blue)]" : "bg-slate-800/70"}`}
        style={{ width: titleWidth }}
      />
      <div className="mt-3 space-y-2">
        {lineWidths.map((width) => (
          <div
            key={width}
            className="h-2 rounded-full bg-[rgba(35,151,173,0.16)]"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
    </div>
  );
}
