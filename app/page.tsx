import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Documents } from "@/components/sections/Documents";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { Hero } from "@/components/sections/Hero";
import { Waitlist } from "@/components/sections/Waitlist";
import { WaitlistModal } from "@/components/ui/WaitlistModal";
import { BlueprintBackground } from "@/components/visual/BlueprintBackground";
import { WorkflowStrip } from "@/components/visual/WorkflowStrip";

export default function Home() {
  return (
    <>
      <BlueprintBackground />
      <Header />
      <main className="relative z-10">
        <Hero />
        <FeatureCards />
        <WorkflowStrip />
        <Documents />
        <Waitlist />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <WaitlistModal />
    </>
  );
}
