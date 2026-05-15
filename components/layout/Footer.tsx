import Image from "next/image";
import Link from "next/link";
import { landing } from "@/content/landing";

export function Footer() {
  return (
    <footer className="border-t border-[var(--darquis-border)] bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 text-sm text-[var(--darquis-muted)] sm:px-6 lg:px-8">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/darquis-logo-normal.png"
              alt=""
              width={42}
              height={42}
              className="h-10 w-10"
            />
            <div>
              <p className="text-base font-semibold text-[var(--darquis-ink)]">Darquis</p>
              <a
                className="darquis-focus rounded-sm underline-offset-4 hover:text-[var(--darquis-blue-dark)] hover:underline"
                href={`mailto:${landing.footer.email}`}
              >
                {landing.footer.email}
              </a>
            </div>
          </div>

          <nav className="grid gap-3 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2" aria-label="Enlaces legales">
            {landing.footer.legal.map((item) => (
              <Link
                key={item.href}
                className="darquis-focus w-fit rounded-sm underline-offset-4 hover:text-[var(--darquis-blue-dark)] hover:underline"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
