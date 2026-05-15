import Image from "next/image";
import { visualAssets } from "@/components/visual/visual-assets";
import { landing } from "@/content/landing";

const steps = [
  {
    number: "1.",
    title: "Elige qué vas a preparar",
    items: ["Certificado", "Informe técnico", "Memoria técnica"],
  },
  {
    number: "2.",
    title: "Rellena formularios guiados",
    items: ["Datos generales", "Contenido", "Revisión", "Firma"],
  },
  {
    number: "3.",
    title: "Revisa antes de firmar",
    items: ["Estructura clara", "Contenido completo", "Listo para firmar"],
  },
  {
    number: "4.",
    title: "Exporta el PDF",
    items: ["PDF", "Presentación", "Archivo final"],
  },
] as const;

export function WorkflowStrip() {
  return (
    <section className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10">
      <div className="darquis-reveal relative mx-auto max-w-6xl overflow-hidden rounded-lg border border-[rgba(35,151,173,0.16)] bg-white/80 px-4 py-7 shadow-[0_22px_70px_rgba(35,75,105,0.09)] backdrop-blur sm:px-6">
        <Image
          src={visualAssets.workflow}
          alt=""
          fill
          sizes="(min-width: 1024px) 72rem, 100vw"
          className="pointer-events-none object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.94),rgba(255,255,255,0.70),rgba(255,255,255,0.94))]" />
        <div className="relative mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--darquis-blue-dark)]">
            {landing.workflow.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--darquis-ink)] sm:text-3xl">
            {landing.workflow.title}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-[var(--darquis-muted)]">
            {landing.workflow.text}
          </p>
        </div>

        <div className="relative overflow-x-auto pb-2">
          <div className="grid min-w-[58rem] grid-cols-4 items-stretch gap-4 lg:min-w-0">
            {steps.map((step, index) => (
              <WorkflowCard key={step.title} step={step} isLast={index === steps.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowCard({
  step,
  isLast,
}: {
  step: (typeof steps)[number];
  isLast: boolean;
}) {
  return (
    <article className="group relative rounded-lg border border-[rgba(35,151,173,0.18)] bg-white/95 p-4 shadow-[0_14px_34px_rgba(35,75,105,0.09)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(35,151,173,0.38)]">
      {!isLast ? (
        <div className="absolute -right-4 top-1/2 z-10 hidden h-px w-4 bg-[var(--darquis-blue)] opacity-60 lg:block">
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[var(--darquis-blue)]" />
        </div>
      ) : null}
      <p className="text-sm font-semibold text-[var(--darquis-blue-dark)]">
        {step.number} <span className="text-[var(--darquis-ink)]">{step.title}</span>
      </p>
      <div className="mt-4 space-y-2">
        {step.items.map((item, index) => (
          <div
            key={item}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold ${
              index === 0
                ? "border-[rgba(35,151,173,0.28)] bg-[var(--darquis-blue-soft)] text-[var(--darquis-blue-dark)]"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <span>{item}</span>
            <span className={`h-4 w-4 rounded-full ${index === 0 ? "bg-[var(--darquis-blue)]" : "border border-slate-300"}`} />
          </div>
        ))}
      </div>
    </article>
  );
}
