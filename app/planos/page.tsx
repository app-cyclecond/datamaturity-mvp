"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Zap,
  Trophy,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PlanosPage() {
  const router = useRouter();

  const plans = [
    {
      name: "Bronze",
      price: 99,
      description: "Perfeito para começar sua jornada de maturidade de dados",
      icon: Target,
      color: "amber",
      tagline: "Perfeito para começar",
      features: [
        { name: "1 Diagnóstico por mês", included: true },
        { name: "Relatórios Básicos em PDF", included: true },
        { name: "Biblioteca Essencial", included: true },
        { name: "Recomendações Padrão", included: true },
        { name: "Exportação PDF", included: true },
        { name: "Suporte por Email", included: true },
        { name: "Recomendações Personalizadas", included: false },
        { name: "Biblioteca Completa", included: false },
        { name: "Benchmarking Setorial", included: false },
        { name: "Suporte Prioritário", included: false },
      ],
      cta: "Começar com Bronze",
      highlighted: false,
      planKey: "bronze",
    },
    {
      name: "Silver",
      price: 199,
      description: "Para empresas em crescimento que monitoram continuamente",
      icon: Zap,
      color: "slate",
      tagline: "Para empresas em crescimento",
      features: [
        { name: "3 Diagnósticos por mês", included: true },
        { name: "Relatórios Avançados em PDF", included: true },
        { name: "Biblioteca Completa", included: true },
        { name: "Recomendações Personalizadas", included: true },
        { name: "Exportação PDF", included: true },
        { name: "Suporte por Email", included: true },
        { name: "Benchmarking Setorial", included: false },
        { name: "Relatórios Executivos", included: false },
        { name: "Suporte Prioritário", included: false },
        { name: "Acesso Completo", included: false },
      ],
      cta: "Começar com Silver",
      highlighted: false,
      planKey: "silver",
    },
    {
      name: "Gold",
      price: 499,
      description: "Solução completa para empresas que levam dados a sério",
      icon: Trophy,
      color: "yellow",
      tagline: "Solução completa para empresas",
      features: [
        { name: "Diagnósticos Ilimitados", included: true },
        { name: "Acesso Completo", included: true },
        { name: "Relatórios Executivos em PDF", included: true },
        { name: "Biblioteca Premium", included: true },
        { name: "Recomendações Personalizadas", included: true },
        { name: "Exportação PDF", included: true },
        { name: "Benchmarking Setorial", included: true },
        { name: "Análise de Tendências", included: true },
        { name: "Suporte Prioritário", included: true },
        { name: "Consultoria Estratégica", included: true },
      ],
      cta: "Começar com Gold",
      highlighted: false,
      planKey: "gold",
    },
  ];

  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(priceId);
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar sessão de checkout");
      }

      const { sessionId } = await response.json();

      // Redirecionar para o Stripe Checkout
      const stripe = (window as any).Stripe;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  const faqs = [
    {
      question: "Posso mudar de plano a qualquer momento?",
      answer:
        "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A mudança será refletida no próximo ciclo de cobrança.",
    },
    {
      question: "O que acontece se eu atingir o limite de diagnósticos?",
      answer:
        "Ao atingir o limite do seu plano, você poderá fazer upgrade para um plano superior ou aguardar o próximo ciclo mensal para um novo diagnóstico.",
    },
    {
      question: "O que está incluído na 'Biblioteca Essencial' vs 'Completa' vs 'Premium'?",
      answer:
        "A Biblioteca Essencial contém artigos e guias básicos. A Completa adiciona frameworks, templates e estudos de caso. A Premium inclui tudo isso mais conteúdos exclusivos, webinars e materiais de consultoria.",
    },
    {
      question: "O que é Benchmarking Setorial?",
      answer:
        "Comparação do seu score de maturidade com empresas do mesmo setor, permitindo entender como você se posiciona no mercado.",
    },
    {
      question: "Qual plano vocês recomendam para começar?",
      answer:
        "Para empresas que estão iniciando, o Bronze é ideal. Para quem já tem uma operação de dados estruturada e quer monitorar a evolução regularmente, recomendamos o Silver.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="fixed top-0 w-full border-b bg-white/80 backdrop-blur-md z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white font-bold">
                DM
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">DataMaturity</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Button asChild className="bg-brand-primary text-white hover:bg-brand-primary/90">
              <Link href="/signup">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-brand-primary/10 to-transparent">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Planos Simples e Transparentes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Escolha o plano ideal para sua empresa e comece sua jornada de maturidade em dados
          </p>
        </div>
      </section>

      {/* CARDS DE PLANOS */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, i) => {
              const PlanIcon = plan.icon;
              return (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all flex flex-col border-gray-200 bg-white shadow-sm hover:shadow-md`}
                >
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600">
                        <PlanIcon className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-5xl font-extrabold text-gray-900">R$ {plan.price}</span>
                      <span className="text-gray-600 ml-2">/mês</span>
                    </div>

                    <Button
                      onClick={() => handleCheckout(plan.planKey === 'bronze' ? process.env.NEXT_PUBLIC_STRIPE_PRICE_BRONZE! : plan.planKey === 'silver' ? process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER! : process.env.NEXT_PUBLIC_STRIPE_PRICE_GOLD!)}
                      disabled={loading === plan.planKey}
                      className={`w-full mb-8 py-3 text-lg bg-brand-primary text-white hover:bg-brand-primary/90 disabled:opacity-50`}
                    >
                      {loading === plan.planKey ? "Processando..." : plan.cta}
                    </Button>

                    <div className="space-y-3 border-t border-gray-200 pt-6 flex-1">
                      {plan.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={feature.included ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="mt-6 text-center text-xs italic text-gray-400">{plan.tagline}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TABELA COMPARATIVA */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Comparação Completa</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-700 w-1/2">Recurso</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-700">Bronze<br /><span className="font-normal text-gray-500">R$ 99/mês</span></th>
                  <th className="text-center py-4 px-4 font-bold text-brand-primary">Silver<br /><span className="font-normal text-gray-500">R$ 199/mês</span></th>
                  <th className="text-center py-4 px-4 font-bold text-gray-700">Gold<br /><span className="font-normal text-gray-500">R$ 499/mês</span></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Diagnósticos por mês", bronze: "1", silver: "3", gold: "Ilimitados" },
                  { feature: "Relatórios em PDF", bronze: true, silver: true, gold: true },
                  { feature: "Nível dos Relatórios", bronze: "Básico", silver: "Avançado", gold: "Executivo" },
                  { feature: "Biblioteca de Conteúdo", bronze: "Essencial", silver: "Completa", gold: "Premium" },
                  { feature: "Recomendações", bronze: "Padrão", silver: "Personalizadas", gold: "Personalizadas" },
                  { feature: "Benchmarking Setorial", bronze: false, silver: false, gold: true },
                  { feature: "Análise de Tendências", bronze: false, silver: false, gold: true },
                  { feature: "Suporte", bronze: "Email", silver: "Email", gold: "Prioritário" },
                  { feature: "Consultoria Estratégica", bronze: false, silver: false, gold: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">{row.feature}</td>
                    {[row.bronze, row.silver, row.gold].map((val, j) => (
                      <td key={j} className={`py-4 px-4 text-center ${j === 1 ? "bg-brand-primary/5" : ""}`}>
                        {typeof val === "boolean" ? (
                          val ? (
                            <Check className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700 font-medium">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Pronto para começar?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Crie sua conta gratuitamente e faça seu primeiro diagnóstico hoje mesmo
          </p>
          <Button
            asChild
            size="lg"
            className="h-14 px-10 text-lg bg-brand-primary text-white hover:bg-brand-primary/90"
          >
            <Link href="/signup">Começar Grátis</Link>
          </Button>
          <p className="mt-6 text-sm text-gray-500">Sem necessidade de cartão de crédito</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-primary font-bold text-xs">
              DM
            </div>
            <span className="font-bold">DataMaturity</span>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} DataMaturity. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
