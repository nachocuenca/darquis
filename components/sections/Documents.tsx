import { landing } from "@/content/landing";

type DocumentCategory = (typeof landing.documents.categories)[number];

export function Documents() {
  return (
    <section className="relative bg-white/50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--darquis-blue-dark)]">
            Documentos
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--darquis-ink)] sm:text-4xl">
            {landing.documents.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--darquis-muted)] sm:text-lg">
            {landing.documents.text}
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {landing.documents.categories.map((category) => (
            <DocumentCard key={category.key} category={category} />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {landing.documents.extras.map((item) => (
            <span
              key={item}
              className="rounded-md border border-[rgba(35,151,173,0.18)] bg-white/80 px-3 py-1.5 text-sm font-medium text-[var(--darquis-blue-dark)]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocumentCard({ category }: { category: DocumentCategory }) {
  return (
    <article className="min-h-40 rounded-lg border border-[rgba(35,151,173,0.18)] bg-[#fbfdfe] p-4 text-center shadow-[0_10px_28px_rgba(35,75,105,0.07)] transition hover:-translate-y-0.5 hover:border-[rgba(35,151,173,0.34)] hover:bg-white">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--darquis-blue-soft)] text-[var(--darquis-blue-dark)]">
        <DocumentIcon name={category.key} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-[var(--darquis-ink)]">{category.name}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--darquis-muted)]">{category.description}</p>
    </article>
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
