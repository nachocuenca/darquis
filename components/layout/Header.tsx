import Image from "next/image";
import Link from "next/link";
import { landing } from "@/content/landing";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          className="darquis-focus flex min-w-0 items-center rounded-lg"
          href="/#inicio"
          aria-label="Ir al inicio de Darquis"
        >
          <Image
            src="/brand/darquis-marca-normal.png"
            alt="Darquis"
            width={194}
            height={55}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <Link
          className="darquis-focus inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-[var(--darquis-blue)] px-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(35,151,173,0.22)] transition hover:bg-[var(--darquis-blue-dark)] sm:h-10 sm:px-4"
          href="/#lista-de-espera"
        >
          {landing.header.cta}
        </Link>
      </div>
    </header>
  );
}
