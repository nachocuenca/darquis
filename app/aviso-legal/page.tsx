import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalPages } from "@/content/legal";

export const metadata: Metadata = {
  title: "Aviso legal · Darquis",
  description: "Aviso legal provisional de Darquis.",
};

export default function AvisoLegalPage() {
  return <LegalPage {...legalPages.avisoLegal} />;
}
