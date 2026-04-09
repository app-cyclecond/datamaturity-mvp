"use client";

import { useRouter } from "next/navigation";
import {
  Check, X, Zap, Trophy, Target, ArrowRight, Star,
  ChevronDown, ChevronUp, MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PlanosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
      } catch { setUser(null); } finally { setIsCheckingAuth(false); }
    };
    checkAuth();
  }, []);

  const handleCheckout = async (plan: any) => {
    if (!user) { router.push("/signup"); return; }
    setLoading(plan.planKey);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      });
      if (!response.ok) throw new Error("Erro ao criar sessão");
      const data = await response.json();
      if (data.sessionId) window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally { setLoading(null); }
  };

  const handleGoldWhatsApp = () => {
    window.open("https://wa.me/5511919771377?text=Olá!%20Tenho%20interesse%20no%20Plano%20Gold%20do%20DataMaturity.%20Podemos%20conversar%3F", "_blank");
  };

  const plans = [
    {
      name: "Bronze", price: "4.900", tagline: "Para começar com clareza",
      description: "Ideal para empresas que querem entender onde estão e dar o primeiro passo estruturado na jornada de dados.",
      icon: Target, badge: null, planKey: "bronze",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BRONZE,
      features: [
        { name: "Diagnóstico completo de maturidade", included: true },
        { name: "Score em 7 dimensões", included: true },
        { name: "Relatório básico em PDF", included: true },
        { name: "Benchmarking do seu setor", included: true },
        { name: "Biblioteca Essencial (5 docs)", included: true },
        { name: "Suporte por email", included: true },
        { name: "Roadmap personalizado", included: false },
        { name: "Biblioteca Completa (20+ docs)", included: false },
        { name: "Benchmarking multi-setorial", included: false },
        { name: "Diagnósticos ilimitados", included: false },
      ],
      cta: "Começar com Bronze", isPopular: false, isGold: false,
    },
    {
      name: "Silver", price: "9.900", tagline: "Para quem quer evoluir rápido",
      description: "Para empresas em crescimento que precisam de estrutura, roadmap personalizado e acesso completo à biblioteca.",
      icon: Zap, badge: "Mais Popular", planKey: "silver",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER,
      features: [
        { name: "Diagnósticos ilimitados", included: true },
        { name: "Score em 7 dimensões", included: true },
        { name: "Relatório avançado em PDF", included: true },
        { name: "Benchmarking do seu setor", included: true },
        { name: "Biblioteca Completa (20+ docs)", included: true },
        { name: "Roadmap personalizado", included: true },
        { name: "Suporte prioritário", included: true },
        { name: "Benchmarking multi-setorial", included: false },
        { name: "Política de IA e frameworks Gold", included: false },
        { name: "Consultoria estratégica", included: false },
      ],
      cta: "Começar com Silver", isPopular: true, isGold: false,
    },
    {
      name: "Gold", price: null, tagline: "Para líderes que levam dados a sério",
      description: "Proposta customizada para a realidade da sua organização. O que consultorias cobram em centenas de milhares, você acessa por uma fração.",
      icon: Trophy, badge: "Completo", planKey: "gold",
      priceId: null,
      features: [
        { name: "Diagnósticos ilimitados", included: true },
        { name: "Score em 7 dimensões", included: true },
        { name: "Relatório executivo premium", included: true },
        { name: "Benchmarking multi-setorial", included: true },
        { name: "Biblioteca Completa (20+ docs)", included: true },
        { name: "Roadmap personalizado", included: true },
        { name: "Política de IA e frameworks Gold", included: true },
        { name: "Análise de tendências", included: true },
        { name: "Suporte prioritário + consultoria", included: true },
        { name: "Acesso antecipado a novidades", included: true },
      ],
      cta: "Solicitar Proposta", isPopular: false, isGold: true,
    },
  ];

  const faqs = [
    { question: "Como funciona a licença anual?", answer: "Você paga uma única vez e tem acesso completo ao plano escolhido por 12 meses. Ao final do período, você pode renovar ou fazer upgrade para um plano superior." },
    { question: "O diagnóstico é realmente gratuito?", answer: "Sim. Qualquer pessoa pode criar uma conta e realizar o diagnóstico completo de maturidade sem custo. Os planos pagos desbloqueiam o roadmap personalizado, a biblioteca completa e os benchmarkings avançados." },
    { question: "O que é o Benchmarking Setorial?", answer: "Comparamos o seu score com empresas do mesmo setor (Tech, Financeiro, Retail, Saúde, Manufatura), mostrando onde você está em relação à média e ao top 10% do mercado." },
    { question: "O Roadmap é realmente personalizado?", answer: "Sim. Para cada dimensão com score abaixo da média, geramos automaticamente 3 ações concretas e priorizadas baseadas no seu nível atual, com o objetivo de evoluir para o próximo nível." },
    { question: "O que está incluído na Biblioteca?", answer: "A Biblioteca tem 20+ documentos em 6 categorias: Executivo, Governança, Cultura, Analytics, Talentos e Toolkit. Cada documento é um guia prático, framework ou template — do nível de qualidade de uma consultoria McKinsey." },
    { question: "Por que o Gold não tem preço fixo?", answer: "Porque o valor real depende do tamanho da sua organização, do número de usuários e dos objetivos estratégicos. Assim conseguimos oferecer uma proposta justa para uma startup de 20 pessoas e para um grupo com 5.000 colaboradores." },
    { question: "Qual plano recomendam para começar?", answer: "Para empresas iniciando a jornada de dados, o Bronze é o ponto de entrada ideal. Para quem já tem uma operação de dados e precisa de roadmap e biblioteca completa, o Silver oferece o melhor custo-benefício." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <header className="fixed top-0 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">DM</div>
            <span className="text-xl font-bold text-gray-900">DataMaturity</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Home</Link>
            {user ? (
              <Link href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">Meu Dashboard</Link>
            ) : (
              <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">Diagnóstico Gratuito</Link>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-indigo-50 to-white px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5 fill-indigo-500" />
            Licença Anual · Acesso por 12 meses
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            O que consultorias cobram em<br />
            <span className="text-indigo-600">centenas de milhares</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-6">
            Diagnóstico de maturidade, roadmap personalizado e biblioteca completa de frameworks — por uma fração do custo de uma consultoria tradicional.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" />Diagnóstico gratuito para começar</div>
            <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" />Acesso por 12 meses</div>
            <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" />Renovação anual sem surpresas</div>
          </div>
        </div>
      </section>

      {/* CARDS DE PLANOS */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => {
              const PlanIcon = plan.icon;
              return (
                <div key={i} className={`relative rounded-2xl flex flex-col transition-all hover:-translate-y-1 ${
                  plan.isPopular ? "border-2 border-indigo-600 shadow-xl shadow-indigo-100"
                  : plan.isGold ? "border-2 border-amber-400 shadow-lg shadow-amber-50"
                  : "border border-gray-200 shadow-sm hover:shadow-md"
                }`}>
                  {plan.badge && (
                    <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white ${plan.isPopular ? "bg-indigo-600" : "bg-amber-500"}`}>
                      {plan.badge}
                    </div>
                  )}
                  <div className={`p-8 rounded-t-2xl ${plan.isPopular ? "bg-indigo-600 text-white" : plan.isGold ? "bg-amber-50" : "bg-white"}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${plan.isPopular ? "bg-white/20" : plan.isGold ? "bg-amber-100" : "bg-gray-100"}`}>
                        <PlanIcon className={`h-5 w-5 ${plan.isPopular ? "text-white" : plan.isGold ? "text-amber-600" : "text-gray-600"}`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${plan.isPopular ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                        <p className={`text-xs font-medium ${plan.isPopular ? "text-indigo-200" : "text-gray-500"}`}>{plan.tagline}</p>
                      </div>
                    </div>
                    <div className="mt-4 mb-2">
                      {plan.price ? (
                        <>
                          <span className={`text-4xl font-extrabold ${plan.isPopular ? "text-white" : "text-gray-900"}`}>R$ {plan.price}</span>
                          <span className={`text-sm ml-1 ${plan.isPopular ? "text-indigo-200" : "text-gray-500"}`}>/ano</span>
                        </>
                      ) : (
                        <div>
                          <span className={`text-2xl font-extrabold ${plan.isGold ? "text-amber-700" : "text-gray-900"}`}>Proposta Customizada</span>
                          <p className={`text-xs mt-1 ${plan.isGold ? "text-amber-600" : "text-gray-500"}`}>Valor adaptado ao tamanho e objetivos da sua organização</p>
                        </div>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${plan.isPopular ? "text-indigo-100" : "text-gray-500"}`}>{plan.description}</p>
                  </div>
                  <div className="p-8 bg-white rounded-b-2xl flex flex-col flex-1">
                    {plan.isGold ? (
                      <button
                        onClick={handleGoldWhatsApp}
                        className="w-full py-3 rounded-xl font-bold text-sm mb-6 transition-all flex items-center justify-center gap-2 bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-100"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Falar com Especialista
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCheckout(plan)}
                        disabled={loading === plan.planKey || isCheckingAuth}
                        className={`w-full py-3 rounded-xl font-bold text-sm mb-6 transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                          plan.isPopular ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                        }`}
                      >
                        {loading === plan.planKey ? "Processando..." : plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    <div className="space-y-2.5 flex-1">
                      {plan.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-2.5">
                          {feature.included ? (
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.isPopular ? "bg-indigo-100" : "bg-emerald-100"}`}>
                              <Check className={`w-2.5 h-2.5 ${plan.isPopular ? "text-indigo-600" : "text-emerald-600"}`} />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <X className="w-2.5 h-2.5 text-gray-400" />
                            </div>
                          )}
                          <span className={`text-sm ${feature.included ? "text-gray-800" : "text-gray-400"}`}>{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ÂNCORA DE VALOR */}
      <section className="py-12 px-6 bg-indigo-50">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl border border-indigo-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Por que vale o investimento?</h2>
            <p className="text-gray-500 text-center text-sm mb-8">Compare o custo do DataMaturity com alternativas tradicionais</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Consultoria tradicional", value: "R$ 80.000–300.000", sub: "por projeto de diagnóstico (3 meses)", color: "text-red-600" },
                { label: "DataMaturity Gold", value: "Proposta customizada", sub: "acesso por 12 meses, resultados em minutos", color: "text-amber-600" },
                { label: "DataMaturity Silver", value: "R$ 9.900/ano", sub: "equivale a menos de 1 dia de consultoria", color: "text-indigo-600" },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{item.label}</p>
                  <p className={`text-xl font-extrabold ${item.color} mb-1`}>{item.value}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TABELA COMPARATIVA */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Comparativo Completo</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-5 font-semibold text-gray-700 w-1/2">Recurso</th>
                  <th className="text-center p-5 font-bold text-amber-700">Bronze</th>
                  <th className="text-center p-5 font-bold text-indigo-700 bg-indigo-50">Silver</th>
                  <th className="text-center p-5 font-bold text-amber-600">Gold</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Diagnósticos", bronze: "Completo", silver: "Ilimitados", gold: "Ilimitados" },
                  { feature: "Score em 7 dimensões", bronze: "✅", silver: "✅", gold: "✅" },
                  { feature: "Relatório em PDF", bronze: "Básico", silver: "Avançado", gold: "Executivo Premium" },
                  { feature: "Benchmarking setorial", bronze: "Seu setor", silver: "Seu setor", gold: "Todos os setores" },
                  { feature: "Roadmap personalizado", bronze: "—", silver: "✅", gold: "✅" },
                  { feature: "Biblioteca de conteúdo", bronze: "5 docs", silver: "20+ docs", gold: "20+ docs + exclusivos" },
                  { feature: "Política de IA (DOCX editável)", bronze: "—", silver: "—", gold: "✅" },
                  { feature: "Análise de tendências", bronze: "—", silver: "—", gold: "✅" },
                  { feature: "Suporte", bronze: "Email", silver: "Prioritário", gold: "Prioritário + Consultoria" },
                  { feature: "Licença", bronze: "Anual", silver: "Anual", gold: "Customizada" },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="p-4 text-gray-700 font-medium">{row.feature}</td>
                    <td className="p-4 text-center text-gray-600">{row.bronze}</td>
                    <td className="p-4 text-center text-indigo-700 font-medium bg-indigo-50/50">{row.silver}</td>
                    <td className="p-4 text-center text-amber-700 font-medium">{row.gold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="py-16 px-6 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">O que nossos clientes dizem</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Ana Paula M.", role: "CDO · Fintech", text: "O diagnóstico revelou gaps que não víamos há anos. Em 3 meses, nosso score subiu de 2.1 para 3.4 seguindo o roadmap.", plan: "Gold" },
              { name: "Carlos R.", role: "Head de Dados · Varejo", text: "O benchmarking setorial foi um divisor de águas. Mostrou exatamente onde estávamos em relação ao mercado.", plan: "Silver" },
              { name: "Fernanda L.", role: "CTO · Startup B2B", text: "Simples, direto e acionável. Em 10 minutos tínhamos um diagnóstico completo e um plano de ação para os próximos 6 meses.", plan: "Bronze" },
            ].map((t, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                  <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Plano {t.plan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-gray-900 text-sm">{faq.question}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Comece pelo diagnóstico gratuito</h2>
          <p className="text-indigo-200 text-lg mb-8">Em 10 minutos você descobre onde sua empresa está na jornada de maturidade em dados — sem custo, sem compromisso.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-all text-sm shadow-lg">
                Fazer Diagnóstico Gratuito →
              </button>
            </Link>
            <button
              onClick={handleGoldWhatsApp}
              className="px-8 py-4 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Falar sobre o Plano Gold
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
