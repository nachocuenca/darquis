import { landing } from "@/content/landing";

type DocumentCategory = (typeof landing.documents.categories)[number];

export function Documents() {
  const firstRow = landing.documents.categories.slice(0, 4);
  const secondRow = landing.documents.categories.slice(4);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase text-[var(--darquis-blue-dark)]">
            Documentos
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-[var(--darquis-ink)] sm:text-4xl">
            {landing.documents.title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-[var(--darquis-muted)]">{landing.documents.text}</p>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {firstRow.map((category) => (
              <DocumentCard key={category.name} category={category} />
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:mx-auto xl:w-[78%]">
            {secondRow.map((category) => (
              <DocumentCard key={category.name} category={category} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DocumentCard({ category }: { category: DocumentCategory }) {
  return (
    <article className="flex min-h-32 flex-col rounded-lg border border-[var(--darquis-border)] bg-[#fbfdfe] p-5 transition hover:border-[rgba(35,151,173,0.36)] hover:bg-white">
      <span className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--darquis-blue-soft)] text-[var(--darquis-blue-dark)]">
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M7 4h7l4 4v12H7z" />
          <path d="M14 4v5h4" />
          <path d="M10 13h5" />
          <path d="M10 17h4" />
        </svg>
      </span>
      <h3 className="text-lg font-semibold text-[var(--darquis-ink)]">{category.name}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--darquis-muted)]">{category.description}</p>
    </article>
  );
}
