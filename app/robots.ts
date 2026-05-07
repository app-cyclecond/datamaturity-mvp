import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/planos", "/dashboard-demo", "/biblioteca-publica", "/privacidade", "/lgpd", "/termos"],
        disallow: ["/dashboard", "/assessment", "/diagnostico", "/historico", "/roadmap", "/benchmarking", "/biblioteca", "/configuracoes", "/assinatura", "/api/"],
      },
    ],
    sitemap: "https://datamaturity.com.br/sitemap.xml",
  };
}
