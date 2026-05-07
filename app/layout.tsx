import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: {
    default: "DataMaturity — Diagnóstico de Maturidade em Dados & IA",
    template: "%s | DataMaturity",
  },
  description:
    "Descubra em qual nível de maturidade de dados sua empresa está. Diagnóstico completo em 7 dimensões, roadmap personalizado e biblioteca de documentos estratégicos.",
  keywords: [
    "maturidade de dados",
    "diagnóstico de dados",
    "governança de dados",
    "data maturity",
    "DAMA-DMBOK",
    "estratégia de dados",
    "data-driven",
    "IA e analytics",
    "roadmap de dados",
  ],
  authors: [{ name: "DataMaturity" }],
  creator: "DataMaturity",
  metadataBase: new URL("https://datamaturity.com.br"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://datamaturity.com.br",
    siteName: "DataMaturity",
    title: "DataMaturity — Diagnóstico de Maturidade em Dados & IA",
    description:
      "Descubra em qual nível de maturidade de dados sua empresa está. Diagnóstico completo em 7 dimensões, roadmap personalizado e biblioteca estratégica.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DataMaturity — Diagnóstico de Maturidade em Dados & IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DataMaturity — Diagnóstico de Maturidade em Dados & IA",
    description:
      "Descubra em qual nível de maturidade de dados sua empresa está. Diagnóstico completo em 7 dimensões.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script src="https://js.stripe.com/v3/" async></script>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
