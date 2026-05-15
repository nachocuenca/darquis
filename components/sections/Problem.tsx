import { landing } from "@/content/landing";

export function Problem() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-[var(--darquis-blue-dark)]">
            {landing.problem.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-[var(--darquis-ink)] sm:text-4xl">
            {landing.problem.title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-[var(--darquis-muted)]">{landing.problem.text}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {landing.problem.items.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-[var(--darquis-border)] bg-[#fbfdfe] p-5"
            >
              <div className="mb-5 h-1 w-12 rounded-full bg-[var(--darquis-blue)]" />
              <h3 className="text-base font-semibold text-[var(--darquis-ink)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--darquis-muted)]">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
