import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataMaturity",
  description: "Diagnóstico de maturidade em Dados & AI",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script src="https://js.stripe.com/v3/" async></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
