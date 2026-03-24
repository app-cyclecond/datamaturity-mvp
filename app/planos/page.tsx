"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Check,
  X,
  Zap,
  Trophy,
  Target,
  MessageSquare,
  Users,
  BarChart3,
  FileText,
  Headphones,
} from "lucide-react";
import Link from "next/link";

export default function PlanosPage() {
  const router = useRouter();

  const plans = [
    {
      name: "Bronze",
      price: 99,
      description: "Para empresas começando sua jornada de dados",
      icon: Target,
      features: [
        { name: "Diagnósticos por ano", value: 1, included: true },
        { name: "Relatório Básico", value: true, included: true },
        { name: "Benchmarking de Indústria", value: true, included: true },
        { name: "Relatório Executivo", value: false, included: false },
        { name: "Recomendações Priorizadas", value: false, included: false },
        { name: "Roadmap Customizado", value: false, included: false },
        { name: "Suporte por Email", value: true, included: true },
        { name: "Chat Support", value: false, included: false },
        { name: "Dedicated Manager", value: false, included: false },
        { name: "API Access", value: false, included: false },
      ],
      cta: "Começar com Bronze",
      highlighted: false,
    },
    {
      name: "Silver",
      price: 299,
      description: "Para empresas estruturando sua governança",
      icon: Zap,
      features: [
        { name: "Diagnósticos por ano", value: 4, included: true },
        { name: "Relatório Básico", value: true, included: true },
        { name: "Benchmarking de Indústria", value: true, included: true },
        { name: "Relatório Executivo", value: true, included: true },
        { name: "Recomendações Priorizadas", value: true, included: true },
        { name: "Roadmap Customizado", value: false, included: false },
        { name: "Suporte por Email", value: true, included: true },
        { name: "Chat Support", value: true, included: true },
        { name: "Dedicated Manager", value: false, included: false },
        { name: "API Access", value: false, included: false },
      ],
      cta: "Começar com Silver",
      highlighted: true,
    },
    {
      name: "Gold",
      price: 999,
      description: "Para empresas otimizando maturidade completa",
      icon: Trophy,
      features: [
        { name: "Diagnósticos por ano", value: "Ilimitado", included: true },
        { name: "Relatório Básico", value: true, included: true },
        { name: "Benchmarking de Indústria", value: true, included: true },
        { name: "Relatório Executivo", value: true, included: true },
        { name: "Recomendações Priorizadas", value: true, included: true },
        { name: "Roadmap Customizado", value: true, included: true },
        { name: "Suporte por Email", value: true, included: true },
        { name: "Chat Support", value: true, included: true },
        { name: "Dedicated Manager", value: true, included: true },
        { name: "API Access", value: true, included: true },
      ],
      cta: "Começar com Gold",
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: "Posso mudar de plano a qualquer momento?",
      answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A mudança será refletida no próximo ciclo de cobrança.",
    },
    {
      question: "Existe período de teste gratuito?",
      answer: "Sim, oferecemos 7 dias de teste gratuito em qualquer plano. Sem necessidade de cartão de crédito.",
    },
    {
      question: "O que está incluído no 'Roadmap Customizado'?",
      answer: "Um plano detalhado de 12 meses com milestones, ações específicas, orçamento estimado e indicadores de sucesso, desenvolvido com base no seu diagnóstico.",
    },
    {
      question: "Como funciona o 'Dedicated Manager'?",
      answer: "Um especialista em maturidade de dados fica disponível para sua empresa, ajudando na implementação das recomendações e acompanhando o progresso.",
    },
    {
      question: "Qual plano vocês recomendam para começar?",
      answer: "Recomendamos começar com Silver. Oferece um bom equilíbrio entre funcionalidades e custo, permitindo diagnósticos regulares e suporte adequado.",
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
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, i) => {
              const PlanIcon = plan.icon;
              return (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all ${
                    plan.highlighted
                      ? "border-brand-primary bg-white shadow-2xl scale-105"
                      : "border-gray-200 bg-white shadow-sm hover:shadow-md"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="bg-brand-primary text-white text-center py-2 text-sm font-bold rounded-t-2xl">
                      MAIS POPULAR
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        plan.highlighted
                          ? "bg-brand-primary text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
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
                      asChild
                      className={`w-full mb-8 py-3 text-lg ${
                        plan.highlighted
                          ? "bg-brand-primary text-white hover:opacity-90"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      <Link href="/signup">{plan.cta}</Link>
                    </Button>

                    <div className="space-y-3 border-t border-gray-200 pt-6">
                      {plan.features.slice(0, 5).map((feature, j) => (
                        <div key={j} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={feature.included ? "text-gray-900" : "text-gray-500"}>
                            {feature.name}
                            {typeof feature.value === "number" && feature.value > 1 && `: ${feature.value}`}
                            {typeof feature.value === "string" && `: ${feature.value}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TABELA COMPARATIVA COMPLETA */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comparação Completa</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Feature</th>
                  {plans.map((plan, i) => (
                    <th key={i} className="text-center py-4 px-4 font-bold text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans[0].features.map((_, featureIndex) => (
                  <tr key={featureIndex} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      {plans[0].features[featureIndex].name}
                    </td>
                    {plans.map((plan, planIndex) => (
                      <td key={planIndex} className="py-4 px-4 text-center">
                        {plan.features[featureIndex].included ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
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
            Escolha seu plano e comece sua jornada de maturidade em dados hoje mesmo
          </p>
          <Button asChild size="lg" className="h-14 px-10 text-lg bg-brand-primary text-white hover:bg-brand-primary/90">
            <Link href="/signup">Começar Teste Gratuito de 7 Dias</Link>
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
