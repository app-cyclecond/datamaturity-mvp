import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataMaturity MVP",
  description: "Diagnóstico de maturidade em Dados & AI"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
