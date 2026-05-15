import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { landing } from "@/content/landing";

export function Waitlist() {
  return (
    <section id="lista-de-espera" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-[rgba(35,151,173,0.22)] bg-[linear-gradient(135deg,#0f2b35_0%,#126d80_58%,#2397ad_100%)] shadow-[0_30px_90px_rgba(16,24,32,0.18)]">
          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[0.95fr_0.75fr] lg:p-12">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase text-white/70">
                Lista de espera
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {landing.waitlist.title}
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">{landing.waitlist.text}</p>
              <p className="mt-6 max-w-xl text-sm leading-6 text-white/70">
                Darquis está en desarrollo. El acceso se abrirá de forma progresiva para recoger feedback real de profesionales técnicos.
              </p>
            </div>

            <WaitlistForm ctaLabel={landing.waitlist.cta} source="final" />
          </div>
        </div>
      </div>
    </section>
  );
}
