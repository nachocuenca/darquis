import Image from "next/image";
import { landing } from "@/content/landing";

export function FeatureCards() {
  return (
    <section className="relative px-4 py-10 sm:px-6 sm:py-14">
      <div className="darquis-section-shell mx-auto w-full max-w-6xl rounded-lg border border-[rgba(35,151,173,0.14)] px-4 py-9 shadow-[0_20px_70px_rgba(35,75,105,0.06)] sm:px-6 sm:py-11">
        <div className="darquis-reveal mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--darquis-blue-dark)]">
            {landing.featuresIntro.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--darquis-ink)] sm:text-4xl">
            {landing.featuresIntro.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--darquis-muted)] sm:text-lg">
            {landing.featuresIntro.text}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {landing.features.map((feature, index) => (
            <article
              key={feature.key}
              className="darquis-reveal relative rounded-lg border border-[rgba(35,151,173,0.16)] bg-white/92 p-5 shadow-[0_10px_28px_rgba(35,75,105,0.06)] transition duration-200 hover:border-[rgba(35,151,173,0.30)] hover:shadow-[0_16px_36px_rgba(35,75,105,0.10)]"
            >
              <div className="absolute bottom-3 right-4 text-4xl font-semibold text-[rgba(31,166,186,0.07)]">
                0{index + 1}
              </div>

              <div className="relative flex items-center gap-5">
                <FeatureIcon name={feature.key} />
                <div className="min-w-0">
                  <span className="inline-flex rounded-md border border-[rgba(31,166,186,0.14)] bg-[var(--darquis-blue-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.02em] text-[var(--darquis-blue-dark)]">
                    {feature.label}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold leading-tight text-[var(--darquis-ink)]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-6 text-[var(--darquis-muted)]">
                    {feature.text}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const featureIconByKey: Record<string, string> = {
  normativas: "/brand/icon/normativa.png",
  word: "/brand/icon/plantillas.png",
  estilo: "/brand/icon/criterio.png",
  rapidez: "/brand/icon/pdf.png",
};

function FeatureIcon({ name }: { name: string }) {
  const src = featureIconByKey[name] ?? featureIconByKey.normativas;

  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
      <Image src={src} alt="" fill sizes="5rem" className="object-contain" />
    </div>
  );
}
