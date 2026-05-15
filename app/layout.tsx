import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Darquis · Documentación técnica sin pelearte con Word";
const description =
  "Software en desarrollo para arquitectos y arquitectos técnicos que elaboran certificados, informes y memorias técnicas mediante formularios guiados y documentos listos para firmar.";

export const metadata: Metadata = {
  metadataBase: new URL("https://darquis.com"),
  title,
  description,
  applicationName: "Darquis",
  openGraph: {
    title,
    description,
    url: "https://darquis.com",
    siteName: "Darquis",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
