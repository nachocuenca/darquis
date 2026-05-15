import { landing } from "@/content/landing";

export function FeatureCards() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-[var(--darquis-blue-dark)]">
            Beneficios
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-[var(--darquis-ink)] sm:text-4xl">
            Una forma más ordenada de preparar documentación técnica.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {landing.features.map((feature) => (
            <article
              key={feature.key}
              className="group rounded-lg border border-[var(--darquis-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[rgba(35,151,173,0.36)] hover:shadow-[0_22px_55px_rgba(16,24,32,0.08)]"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <FeatureIcon name={feature.key} />
                <span className="rounded-lg bg-[var(--darquis-blue-soft)] px-3 py-1.5 text-xs font-semibold uppercase text-[var(--darquis-blue-dark)]">
                  {feature.label}
                </span>
              </div>
              <h3 className="text-xl font-semibold leading-tight text-[var(--darquis-ink)]">{feature.title}</h3>
              <p className="mt-4 text-base leading-7 text-[var(--darquis-muted)]">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ name }: { name: string }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[rgba(35,151,173,0.22)] bg-white text-[var(--darquis-blue)] shadow-sm">
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
            <path d="M10 13h5" />
            <path d="M10 17h4" />
          </>
        ) : null}
        {name === "word" ? (
          <>
            <path d="M5 6h14" />
            <path d="M5 12h14" />
            <path d="M5 18h10" />
            <path d="M8 4v16" />
          </>
        ) : null}
        {name === "estilo" ? (
          <>
            <path d="M5 5h14v14H5z" />
            <path d="M8 9h8" />
            <path d="M8 13h5" />
            <path d="M16 16l3 3" />
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
