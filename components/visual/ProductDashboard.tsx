import Image from "next/image";
import { visualAssets } from "@/components/visual/visual-assets";

export function ProductDashboard() {
  return (
    <div
      className="darquis-hero-visual relative mx-auto w-full max-w-[33rem] lg:-mt-8 lg:max-w-[45rem]"
      aria-hidden="true"
    >
      <div className="absolute -left-10 top-12 h-56 w-56 rounded-full bg-[rgba(31,166,186,0.10)] blur-3xl" />
      <div className="absolute -right-8 bottom-6 h-72 w-72 rounded-full bg-[rgba(31,166,186,0.18)] blur-3xl" />

      <div className="darquis-float-slow darquis-blueprint-shell relative overflow-hidden rounded-xl border border-white/80 bg-white/72 p-2 shadow-[0_34px_90px_rgba(35,75,105,0.18)] backdrop-blur-md">
        <div className="absolute inset-0 darquis-grid opacity-30" />
        <DashboardLines />
        <div className="darquis-sheen pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 opacity-50" />

        <Image
          src={visualAssets.dashboard}
          alt=""
          width={1448}
          height={1086}
          priority
          sizes="(min-width: 1024px) 45rem, 96vw"
          className="relative z-[1] h-auto w-full rounded-lg object-contain"
        />

        <div className="absolute left-4 top-4 z-[2] hidden rounded-md border border-[rgba(31,166,186,0.18)] bg-white/92 px-3 py-2 text-xs font-semibold text-[var(--darquis-blue-dark)] shadow-[0_14px_34px_rgba(35,75,105,0.10)] sm:block">
          Formularios guiados
        </div>
        <div className="absolute bottom-5 left-6 z-[2] hidden rounded-md border border-[rgba(31,166,186,0.18)] bg-white/92 px-3 py-2 text-xs font-semibold text-[var(--darquis-blue-dark)] shadow-[0_14px_34px_rgba(35,75,105,0.10)] sm:block">
          Revisión y firma
        </div>
        <div className="absolute bottom-7 right-5 z-[2] hidden rounded-md border border-[rgba(31,166,186,0.18)] bg-white/92 px-3 py-2 text-xs font-semibold text-[var(--darquis-blue-dark)] shadow-[0_14px_34px_rgba(35,75,105,0.10)] sm:block">
          Exportar PDF
        </div>
      </div>
    </div>
  );
}

function DashboardLines() {
  return (
    <svg
      className="absolute inset-0 h-full w-full text-[var(--darquis-blue)]"
      fill="none"
      viewBox="0 0 760 560"
      preserveAspectRatio="none"
    >
      <path
        className="darquis-line-draw"
        d="M20 420C124 282 238 338 358 210C498 58 596 130 740 54"
        stroke="currentColor"
        strokeOpacity="0.12"
      />
      <path d="M34 92h136M596 460h118M650 0v110M110 392v168" stroke="currentColor" strokeOpacity="0.09" />
      <circle cx="358" cy="210" r="4" fill="currentColor" fillOpacity="0.22" />
    </svg>
  );
}
