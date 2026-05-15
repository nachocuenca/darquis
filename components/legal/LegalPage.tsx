import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

type LegalPageProps = {
  title: string;
  intro: string;
  sections: readonly {
    title: string;
    body: readonly string[];
  }[];
};

export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link
            className="darquis-focus inline-flex rounded-sm text-sm font-medium text-[var(--darquis-blue-dark)] underline underline-offset-4"
            href="/"
          >
            Volver a inicio
          </Link>

          <div className="mt-8 rounded-lg border border-[var(--darquis-border)] bg-[#fbfdfe] p-5 sm:p-8">
            <p className="text-sm font-semibold uppercase text-[var(--darquis-blue-dark)]">
              Texto base pendiente de revisión legal.
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-[var(--darquis-ink)] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--darquis-muted)] sm:text-lg sm:leading-8">
              {intro}
            </p>
          </div>

          <div className="mt-8 grid gap-6">
            {sections.map((section) => (
              <section key={section.title} className="rounded-lg border border-[var(--darquis-border)] bg-white p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-[var(--darquis-ink)]">{section.title}</h2>
                <div className="mt-4 grid gap-3 text-base leading-7 text-[var(--darquis-muted)]">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
