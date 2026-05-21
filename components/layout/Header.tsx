import Image from "next/image";
import Link from "next/link";
import { WaitlistTrigger } from "@/components/ui/WaitlistModal";
import { landing } from "@/content/landing";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 shadow-[0_1px_0_rgba(255,255,255,0.72)_inset] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          className="darquis-focus flex min-w-0 items-center rounded-lg"
          href="/#inicio"
          aria-label="Ir al inicio de Darquis"
        >
          <Image
            src="/brand/darquis-marca-normal.png"
            alt="Darquis"
            width={244}
            height={72}
            priority
            className="h-[46px] w-auto drop-shadow-[0_1px_0_rgba(11,117,136,0.18)] sm:h-[50px]"
          />
        </Link>

        <WaitlistTrigger
          className="darquis-focus inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.42)] bg-[var(--darquis-blue)] px-3 text-[0.72rem] font-semibold !text-white shadow-none transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--darquis-blue-dark)] sm:h-11 sm:px-5 sm:text-sm"
        >
          <span className="sm:hidden">Lista de espera</span>
          <span className="hidden sm:inline">{landing.header.cta}</span>
        </WaitlistTrigger>
      </div>
    </header>
  );
}
