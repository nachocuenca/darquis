import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Documents } from "@/components/sections/Documents";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Waitlist } from "@/components/sections/Waitlist";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <FeatureCards />
        <Documents />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
