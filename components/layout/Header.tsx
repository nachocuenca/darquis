import Image from "next/image";
import Link from "next/link";
import { landing } from "@/content/landing";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="darquis-focus flex min-w-0 items-center gap-2 rounded-lg"
          href="/#inicio"
          aria-label="Ir al inicio de Darquis"
        >
          <Image
            src="/brand/darquis-logo-normal.png"
            alt=""
            width={36}
            height={36}
            priority
            className="h-8 w-8 object-contain sm:hidden"
          />
          <span className="text-lg font-semibold text-[var(--darquis-ink)] sm:hidden">Darquis</span>
          <Image
            src="/brand/darquis-marca-normal.png"
            alt="Darquis"
            width={244}
            height={72}
            priority
            className="hidden h-10 w-auto sm:block"
          />
        </Link>

        <Link
          className="darquis-focus inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(35,151,173,0.24)] bg-white px-4 text-sm font-semibold text-[var(--darquis-blue-dark)] shadow-sm transition hover:border-[rgba(35,151,173,0.48)] hover:bg-[var(--darquis-blue-soft)] sm:h-11 sm:px-5"
          href="/#lista-de-espera"
        >
          {landing.header.cta}
        </Link>
      </div>
    </header>
  );
}
