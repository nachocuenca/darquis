import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalPages } from "@/content/legal";

export const metadata: Metadata = {
  title: "Política de privacidad · Darquis",
  description: "Política de privacidad provisional de Darquis.",
};

export default function PrivacidadPage() {
  return <LegalPage {...legalPages.privacidad} />;
}
