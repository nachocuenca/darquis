import { landing } from "@/content/landing";

export function FeatureCards() {
  return (
    <section className="relative px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--darquis-blue-dark)]">
            {landing.featuresIntro.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--darquis-ink)] sm:text-4xl">
            {landing.featuresIntro.title}
          </h2>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {landing.features.map((feature) => (
            <article
              key={feature.key}
              className="group relative overflow-hidden rounded-lg border border-[rgba(35,151,173,0.18)] bg-white/90 p-5 shadow-[0_14px_42px_rgba(35,75,105,0.08)] transition hover:-translate-y-0.5 hover:border-[rgba(35,151,173,0.36)] hover:shadow-[0_22px_55px_rgba(35,75,105,0.12)] sm:p-6"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-[rgba(104,132,255,0.08)]" />
              <div className="relative flex items-start gap-4">
                <FeatureIcon name={feature.key} />
                <div>
                  <span className="inline-flex rounded-md bg-[var(--darquis-blue-soft)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase text-[var(--darquis-blue-dark)]">
                    {feature.label}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold leading-tight text-[var(--darquis-ink)]">
                    {feature.title}
                  </h3>
                </div>
              </div>
              <p className="relative mt-4 text-[0.96rem] leading-7 text-[var(--darquis-muted)]">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ name }: { name: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[rgba(35,151,173,0.24)] bg-[linear-gradient(145deg,#ffffff,#e8f6f8)] text-[var(--darquis-blue)] shadow-[0_12px_26px_rgba(35,75,105,0.10)]">
      <svg
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        {name === "normativas" ? (
          <>
            <path d="M7 4h7l4 4v12H7z" />
            <path d="M14 4v5h4" />
            <path d="M9.5 14.5 11 16l3.5-4" />
          </>
        ) : null}
        {name === "word" ? (
          <>
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h11" />
            <path d="M8 4v16" />
          </>
        ) : null}
        {name === "estilo" ? (
          <>
            <path d="M5 5h14v14H5z" />
            <path d="M8 9h8" />
            <path d="M8 13h5" />
            <path d="m15.5 16.5 3 3" />
          </>
        ) : null}
        {name === "rapidez" ? (
          <>
            <path d="M12 4a8 8 0 1 1-7.45 5" />
            <path d="M12 8v5l3 2" />
            <path d="M4 4h5" />
          </>
        ) : null}
      </svg>
    </div>
  );
}
