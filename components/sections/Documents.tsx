import { landing } from "@/content/landing";

type DocumentCategory = (typeof landing.documents.categories)[number];

export function Documents() {
  return (
    <section className="relative px-4 py-10 sm:px-6 sm:py-14">
      <div className="darquis-section-shell mx-auto w-full max-w-6xl overflow-hidden rounded-lg border border-[rgba(35,151,173,0.14)] px-4 py-9 shadow-[0_20px_70px_rgba(35,75,105,0.06)] sm:px-6 sm:py-11">
        <div className="darquis-reveal mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--darquis-blue-dark)]">
            {landing.documents.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--darquis-ink)] sm:text-4xl">
            {landing.documents.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--darquis-muted)] sm:text-lg">
            {landing.documents.text}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {landing.documents.categories.map((category, index) => (
            <DocumentCard key={category.key} category={category} index={index} />
          ))}
        </div>

        <div className="darquis-reveal mt-6 flex flex-wrap justify-center gap-2">
          {landing.documents.extras.map((item) => (
            <span
              key={item}
              className="rounded-md border border-[rgba(35,151,173,0.18)] bg-white/86 px-3 py-1.5 text-sm font-semibold text-[var(--darquis-blue-dark)] shadow-[0_8px_20px_rgba(35,75,105,0.06)] transition hover:-translate-y-0.5 hover:border-[rgba(35,151,173,0.36)] hover:bg-white"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocumentCard({ category, index }: { category: DocumentCategory; index: number }) {
  return (
    <article className="darquis-reveal group relative min-h-56 overflow-hidden rounded-lg border border-[rgba(35,151,173,0.18)] bg-white/95 p-5 text-left shadow-[0_14px_42px_rgba(35,75,105,0.08)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(35,151,173,0.40)] hover:shadow-[0_24px_60px_rgba(35,75,105,0.13)]">
      <DocumentLines />
      <div className="absolute right-5 top-5 h-px w-20 bg-[linear-gradient(90deg,transparent,rgba(31,166,186,0.28))]" />
      <div className="absolute right-5 top-8 h-px w-12 bg-[linear-gradient(90deg,transparent,rgba(31,166,186,0.18))]" />
      <div className="absolute bottom-4 right-5 text-4xl font-semibold text-[rgba(35,151,173,0.08)]">
        0{index + 1}
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[rgba(35,151,173,0.22)] bg-[linear-gradient(145deg,#ffffff,#e8f6f8)] text-[var(--darquis-blue)] shadow-[0_12px_26px_rgba(35,75,105,0.10)] transition duration-200 group-hover:-translate-y-0.5">
          <DocumentIcon name={category.key} />
        </span>
        <span className="rounded-md bg-[var(--darquis-blue-soft)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase text-[var(--darquis-blue-dark)]">
          {category.key}
        </span>
      </div>

      <h3 className="relative mt-5 text-xl font-semibold leading-tight text-[var(--darquis-ink)]">
        {category.name}
      </h3>
      <p className="relative mt-3 text-[0.96rem] leading-7 text-[var(--darquis-muted)]">
        {category.description}
      </p>
    </article>
  );
}

function DocumentLines() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full text-[var(--darquis-blue)] opacity-70"
      fill="none"
      viewBox="0 0 280 260"
      preserveAspectRatio="none"
    >
      <path d="M0 72h84M206 184h74M36 0v96M244 150v110" stroke="currentColor" strokeOpacity="0.10" />
      <path
        className="darquis-line-draw"
        d="M18 224C68 158 112 178 152 112C184 58 222 52 268 38"
        stroke="currentColor"
        strokeOpacity="0.13"
      />
    </svg>
  );
}

function DocumentIcon({ name }: { name: string }) {
  return (
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
      {name === "certificados" ? (
        <>
          <path d="M7 4h7l4 4v12H7z" />
          <path d="M14 4v5h4" />
          <path d="m10 15 1.5 1.5L15 12" />
        </>
      ) : null}
      {name === "informes" ? (
        <>
          <path d="M6 4h12v16H6z" />
          <path d="M9 9h6" />
          <path d="M9 13h6" />
          <path d="M9 17h3" />
        </>
      ) : null}
      {name === "memorias" ? (
        <>
          <path d="M5 6h10a3 3 0 0 1 3 3v11H8a3 3 0 0 1-3-3z" />
          <path d="M9 10h5" />
          <path d="M9 14h6" />
        </>
      ) : null}
      {name === "anexos" ? (
        <>
          <path d="M8 4h8v16H8z" />
          <path d="M5 7h3" />
          <path d="M16 7h3" />
          <path d="M11 10h2" />
          <path d="M11 14h2" />
        </>
      ) : null}
    </svg>
  );
}
