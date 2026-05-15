import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalPages } from "@/content/legal";

export const metadata: Metadata = {
  title: "Cookies · Darquis",
  description: "Política de cookies provisional de Darquis.",
};

export default function CookiesPage() {
  return <LegalPage {...legalPages.cookies} />;
}
