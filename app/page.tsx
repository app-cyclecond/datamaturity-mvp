"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Users,
  Zap,
  LogOut,
  User,
  Shield,
  Target,
  Clock,
  Star,
  ChevronRight,
  Award,
  BookOpen,
  Lightbulb,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setIsLoggedIn(true);
        setUserEmail(data.user.email || "");
      }
      setIsLoading(false);
    };
    checkAuth();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              <span className={`font-bold text-xl ${isScrolled ? "text-gray-900" : "text-white"}`}>DataMaturity</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#como-funciona" className={`transition text-sm font-medium ${isScrolled ? "text-gray-600 hover:text-indigo-600" : "text-white/90 hover:text-white"}`}>Como Funciona</a>
              <a href="#framework" className={`transition text-sm font-medium ${isScrolled ? "text-gray-600 hover:text-indigo-600" : "text-white/90 hover:text-white"}`}>Metodologia</a>
              <a href="#roi" className={`transition text-sm font-medium ${isScrolled ? "text-gray-600 hover:text-indigo-600" : "text-white/90 hover:text-white"}`}>Resultados</a>
              <Link href="/planos" className={`transition text-sm font-medium ${isScrolled ? "text-gray-600 hover:text-indigo-600" : "text-white/90 hover:text-white"}`}>Planos</Link>
            </div>
            <div className="flex items-center gap-3">
              {isLoading ? null : isLoggedIn ? (
                <>
                  <Link href="/dashboard" className={`flex items-center gap-2 text-sm transition font-medium ${isScrolled ? "text-gray-700 hover:text-indigo-600" : "text-white/90 hover:text-white"}`}>
                    <User className="w-4 h-4" />
                    {userEmail.split("@")[0]}
                  </Link>
                  <button onClick={handleLogout} className={`flex items-center gap-1 text-sm transition ${isScrolled ? "text-gray-500 hover:text-red-600" : "text-white/70 hover:text-white"}`}>
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className={`text-sm transition font-medium ${isScrolled ? "text-gray-700 hover:text-indigo-600" : "text-white/90 hover:text-white"}`}>Entrar</Link>
                  <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">Começar Grátis</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-800/60 border border-indigo-600/40 rounded-full px-4 py-1.5 text-sm text-indigo-200 mb-8">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Baseado em frameworks DAMA-DMBOK, CMMI e TDWI
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
            Sua empresa toma decisões
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              baseadas em dados
            </span>
            <br />
            ou em achismos?
          </h1>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Em 10 minutos, descubra o nível de maturidade de dados da sua organização em 7 dimensões críticas. Receba um diagnóstico detalhado, benchmarking setorial e um roadmap prático de evolução.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href={isLoggedIn ? "/assessment" : "/signup"}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5"
            >
              {isLoggedIn ? "Fazer Novo Diagnóstico" : "Descobrir Meu Score Agora"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/planos"
              className="inline-flex items-center justify-center gap-2 border-2 border-indigo-400/50 text-indigo-200 hover:border-indigo-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              Ver Planos
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm text-white">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Gratuito para começar</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Resultado em 10 minutos</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Relatório executivo completo</span></div>
          </div>
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Estratégia & Governança", score: "3.8", color: "emerald" },
              { label: "Arquitetura & Engenharia", score: "2.5", color: "amber" },
              { label: "Analytics & Valor", score: "4.2", color: "emerald" },
              { label: "IA & Advanced Analytics", score: "1.8", color: "red" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 text-left">
                <p className="text-xs text-indigo-300 mb-2 leading-tight">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color === "emerald" ? "text-emerald-400" : item.color === "amber" ? "text-amber-400" : "text-red-400"}`}>{item.score}</p>
                <p className="text-xs text-indigo-400 mt-1">de 5.0</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-indigo-400 mt-4">Exemplo de relatório gerado pela plataforma</p>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">O custo invisível da baixa maturidade em dados</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Enquanto sua empresa não estrutura sua estratégia de dados, os concorrentes avançam. Cada dia sem clareza é receita perdida.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: 'Decisões no "achismo"', text: "Sem dados confiáveis, líderes dependem da intuição. Estratégias desalinhadas e investimentos com baixo ROI são o resultado.", color: "red" },
              { icon: Users, title: "Silos de informação", text: "Cada área tem sua própria verdade. O tempo gasto reconciliando planilhas e relatórios conflitantes destrói a produtividade.", color: "orange" },
              { icon: Zap, title: "Projetos de IA que não saem do papel", text: "Sem fundação de dados sólida, iniciativas de Machine Learning e IA viram projetos-piloto eternos sem ROI real.", color: "amber" },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.color === "red" ? "bg-red-100" : item.color === "orange" ? "bg-orange-100" : "bg-amber-100"}`}>
                  <item.icon className={`w-6 h-6 ${item.color === "red" ? "text-red-600" : item.color === "orange" ? "text-orange-600" : "text-amber-600"}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Como funciona</h2>
            <p className="text-xl text-gray-500">Do diagnóstico ao plano de ação em 3 passos simples</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: Target, title: "Responda o diagnóstico", text: "42 perguntas estruturadas em 7 dimensões críticas. Leva menos de 10 minutos e não exige conhecimento técnico." },
              { step: "02", icon: BarChart3, title: "Receba seu score detalhado", text: "Score de 1 a 5 em cada dimensão, comparativo com o seu setor e identificação dos gaps mais críticos." },
              { step: "03", icon: Lightbulb, title: "Execute o roadmap", text: "Ações concretas priorizadas por impacto e esforço para evoluir sua maturidade de dados nos próximos 12 meses." },
            ].map((item, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 shadow-sm border border-indigo-100">
                <div className="text-6xl font-black text-indigo-100 absolute top-4 right-6">{item.step}</div>
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRAMEWORK */}
      <section id="framework" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">7 Dimensões de Maturidade Avaliadas</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Nossa metodologia é baseada nos frameworks DAMA-DMBOK, CMMI e TDWI — os padrões globais de referência para gestão de dados.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Estratégia & Governança", desc: "Visão, políticas e estrutura de dados", icon: Shield },
              { name: "Arquitetura & Engenharia", desc: "Infraestrutura, pipelines e plataformas", icon: Zap },
              { name: "Gestão de Dados", desc: "Catálogo, linhagem e ciclo de vida", icon: BookOpen },
              { name: "Qualidade de Dados", desc: "Confiabilidade, consistência e acurácia", icon: CheckCircle2 },
              { name: "Analytics & Valor", desc: "BI, relatórios e geração de insights", icon: BarChart3 },
              { name: "Cultura & Literacy", desc: "Letramento e adoção data-driven", icon: Users },
              { name: "IA & Advanced Analytics", desc: "ML, modelos preditivos e GenAI", icon: TrendingUp },
              { name: "Score Consolidado", desc: "Visão 360° da maturidade", icon: Award },
            ].map((item, i) => (
              <div key={i} className={`p-5 rounded-xl border-2 transition-all hover:-translate-y-1 ${i === 7 ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md"}`}>
                <item.icon className={`w-5 h-5 mb-3 ${i === 7 ? "text-indigo-200" : "text-indigo-600"}`} />
                <h3 className={`font-bold text-sm mb-1 ${i === 7 ? "text-white" : "text-gray-900"}`}>{item.name}</h3>
                <p className={`text-xs leading-relaxed ${i === 7 ? "text-indigo-200" : "text-gray-500"}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section id="roi" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Empresas data-driven superam os concorrentes</h2>
            <p className="text-xl text-gray-500">Os números são claros: investir em maturidade de dados gera retorno mensurável.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { value: "+23%", label: "Aquisição de Clientes", sub: "vs. empresas sem estratégia de dados" },
              { value: "+19%", label: "Lucratividade", sub: "em empresas com governança estruturada" },
              { value: "-30%", label: "Custos Operacionais", sub: "com automação e qualidade de dados" },
              { value: "5x", label: "Velocidade de Decisão", sub: "com dados confiáveis e acessíveis" },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="text-4xl font-black text-indigo-600 mb-2">{item.value}</div>
                <p className="font-bold text-gray-900 mb-1">{item.label}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">* Fonte: McKinsey Global Institute, Harvard Business Review & Gartner Research</p>
        </div>
      </section>

      {/* NÍVEIS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Em qual nível sua empresa está?</h2>
            <p className="text-xl text-gray-500">A escala de maturidade vai de 1 a 5. Onde você está hoje?</p>
          </div>
          <div className="space-y-3">
            {[
              { level: "1 — Inexistente", desc: "Dados tratados de forma ad hoc. Sem processos, sem governança, sem responsáveis definidos.", color: "bg-red-500", pct: "20%" },
              { level: "2 — Inicial", desc: "Iniciativas pontuais e isoladas. Alta dependência de pessoas-chave. Resultados inconsistentes.", color: "bg-orange-500", pct: "40%" },
              { level: "3 — Estruturado", desc: "Processos definidos e documentados. Governança básica. Ainda com limitações de escala.", color: "bg-amber-500", pct: "60%" },
              { level: "4 — Gerenciado", desc: "Práticas monitoradas e mensuradas. Governança clara. Capacidade de escalar com consistência.", color: "bg-blue-500", pct: "80%" },
              { level: "5 — Otimizado", desc: "Dados como ativo estratégico. Cultura data-driven consolidada. IA e automação integradas.", color: "bg-emerald-500", pct: "100%" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-44 flex-shrink-0">
                  <p className="font-bold text-sm text-gray-900">{item.level}</p>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full mb-2">
                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.pct }} />
                  </div>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">O que dizem os líderes que já usaram</h2>
            <p className="text-xl text-gray-500">Empresas que mapearam seus gaps e construíram um plano claro para evoluir</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "O diagnóstico revelou exatamente onde estávamos errando na governança de dados. Em 3 meses seguindo o roadmap, reduzimos retrabalho em 40%.",
                name: "Rodrigo Mendes",
                role: "Head de Dados",
                company: "Fintech São Paulo",
                plan: "Silver",
                initial: "R",
                color: "bg-indigo-600",
              },
              {
                quote: "Finalmente consegui apresentar para o board um plano estruturado de maturidade. O DataMaturity deu a linguagem e os números que eu precisava.",
                name: "Camila Torres",
                role: "CDO",
                company: "Varejista Nacional",
                plan: "Bronze",
                initial: "C",
                color: "bg-purple-600",
              },
              {
                quote: "A biblioteca de documentos sozinha já valeu o investimento. Economizamos semanas de trabalho usando os templates de governança prontos.",
                name: "Felipe Augusto",
                role: "Gerente de TI",
                company: "Indústria Manufatureira",
                plan: "Silver",
                initial: "F",
                color: "bg-emerald-600",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role} · {t.company}</p>
                  </div>
                  <span className="ml-auto text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">Plano {t.plan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 text-sm text-emerald-300 mb-8">
            <Clock className="w-3.5 h-3.5" />
            Diagnóstico completo em menos de 10 minutos
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Descubra agora onde sua empresa
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">está e onde deveria estar</span>
          </h2>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de líderes que já mapearam seus gaps e construíram um roadmap claro para a transformação em dados.
          </p>
          <Link
            href={isLoggedIn ? "/assessment" : "/signup"}
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5"
          >
            {isLoggedIn ? "Fazer Novo Diagnóstico" : "Começar Diagnóstico Gratuito"}
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-indigo-300 mt-4 text-sm">Sem cartão de crédito. Resultado instantâneo. Cancele quando quiser.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-400 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DM</span>
                </div>
                <span className="font-bold text-white text-lg">DataMaturity</span>
              </div>
              <p className="text-sm leading-relaxed">Transformando dados em vantagem competitiva para empresas brasileiras.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#como-funciona" className="hover:text-white transition">Como Funciona</a></li>
                <li><Link href="/planos" className="hover:text-white transition">Planos</Link></li>
                <li><a href="#framework" className="hover:text-white transition">Metodologia</a></li>
                <li><Link href="/biblioteca-publica" className="hover:text-white transition">Biblioteca</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Conta</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/login" className="hover:text-white transition">Entrar</Link></li>
                <li><Link href="/signup" className="hover:text-white transition">Criar Conta</Link></li>
                <li><Link href="/dashboard-demo" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacidade" className="hover:text-white transition">Privacidade</Link></li>
                <li><Link href="/termos" className="hover:text-white transition">Termos de Uso</Link></li>
                <li><Link href="/lgpd" className="hover:text-white transition">LGPD</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; 2026 DataMaturity. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <p className="text-gray-600">Baseado em DAMA-DMBOK · CMMI · TDWI</p>
              <a href="https://www.instagram.com/datamaturity/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-400 hover:text-pink-400 transition" aria-label="Instagram DataMaturity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span className="text-xs">@datamaturity</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
