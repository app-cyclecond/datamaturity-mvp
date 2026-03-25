"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Database,
  LineChart,
  Lock,
  Network,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Zap,
  LogOut,
  User,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push("/");
  };
  return (
    <main className="min-h-screen bg-white">
      {/* HEADER / NAV */}
      <header className="fixed top-0 w-full border-b bg-white/80 backdrop-blur-md z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white font-bold">
              DM
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              DataMaturity
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {!isLoading && isLoggedIn ? (
              <>
                <Link href="/dashboard/home" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{userEmail.split("@")[0]}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Entrar
                </Link>
                <Button asChild className="bg-brand-primary text-white hover:bg-brand-primary/90">
                  <Link href="/demo">Começar Grátis</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-primary/20 via-white to-white"></div>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-4 py-1.5 text-sm font-medium text-brand-primary mb-8">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary"></span>
            Diagnóstico baseado em frameworks globais (Gartner, DAMA)
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl mb-8">
            Transforme dados em <span className="text-brand-primary">vantagem competitiva</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 mb-10">
            Descubra o nível de maturidade analítica da sua empresa em 10 minutos. 
            Identifique gargalos, compare-se com o mercado e receba um roadmap 
            prático para escalar suas iniciativas de IA e Dados.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg bg-brand-primary text-white hover:bg-brand-primary/90 w-full sm:w-auto">
              <Link href={isLoggedIn ? "/assessment" : "/signup"}>
                {isLoggedIn ? "Fazer Novo Diagnóstico" : "Fazer Diagnóstico Gratuito"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto">
              <Link href="#como-funciona">Entender a Metodologia</Link>
            </Button>
          </div>
          <div className="mt-10 text-sm text-gray-500">
            Sem necessidade de cartão de crédito • Relatório imediato
          </div>
        </div>
      </section>

      {/* O PROBLEMA (Por que importa?) */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              O Custo da Baixa Maturidade em Dados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Empresas que não estruturam sua governança e arquitetura de dados perdem dinheiro, tempo e oportunidades todos os dias.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Decisões no "Achismo"</h3>
              <p className="text-gray-600">
                Sem dados confiáveis, líderes dependem da intuição. Isso gera estratégias desalinhadas e investimentos com baixo ROI.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Network className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Silos de Informação</h3>
              <p className="text-gray-600">
                Cada departamento tem "sua própria verdade". O tempo gasto reconciliando planilhas destrói a produtividade das equipes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Frustração com IA</h3>
              <p className="text-gray-600">
                Projetos de IA e Machine Learning falham porque a base de dados é ruim. "Garbage in, garbage out" nunca foi tão real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A SOLUÇÃO (As 7 Dimensões) */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                Framework Completo de Avaliação
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Nossa metodologia avalia sua empresa em 7 dimensões críticas, baseadas nas melhores práticas globais (DAMA-DMBOK, Gartner, McKinsey).
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Target, title: "Estratégia & Governança", desc: "Alinhamento com o negócio e responsabilidades" },
                  { icon: Database, title: "Arquitetura & Engenharia", desc: "Infraestrutura, pipelines e escalabilidade" },
                  { icon: ShieldCheck, title: "Gestão & Qualidade", desc: "Catálogo, segurança e confiabilidade dos dados" },
                  { icon: LineChart, title: "Analytics & IA", desc: "Geração de valor, BI e modelos preditivos" },
                  { icon: Users, title: "Cultura & Alfabetização", desc: "Adoção pelos usuários e data literacy" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-10 w-10 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
                        <item.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-purple-500/20 rounded-3xl blur-3xl -z-10"></div>
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Score Geral</div>
                    <div className="text-4xl font-bold text-brand-primary">3.7</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500 mb-1">Nível de Maturidade</div>
                    <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                      Avançado
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: "Estratégia & Governança", score: 4.2, width: "84%" },
                    { name: "Arquitetura & Engenharia", score: 3.8, width: "76%" },
                    { name: "Gestão de Dados", score: 3.1, width: "62%" },
                    { name: "Qualidade de Dados", score: 2.9, width: "58%" },
                    { name: "Analytics & Valor", score: 4.5, width: "90%" },
                  ].map((dim, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{dim.name}</span>
                        <span className="font-bold text-gray-900">{dim.score}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-primary rounded-full" 
                          style={{ width: dim.width }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS (ROI) */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">
              O Retorno sobre o Investimento em Dados
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Empresas orientadas a dados (Data-Driven) superam seus concorrentes em todas as métricas financeiras.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-extrabold text-brand-primary mb-2">+23%</div>
              <div className="text-slate-300">Aquisição de Clientes</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-brand-primary mb-2">+19%</div>
              <div className="text-slate-300">Lucratividade</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-brand-primary mb-2">-30%</div>
              <div className="text-slate-300">Custos Operacionais</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-brand-primary mb-2">15x</div>
              <div className="text-slate-300">Mais chances de reter clientes</div>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-slate-500">
            * Fonte: McKinsey Global Institute & Harvard Business Review
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Pronto para descobrir seu nível de maturidade?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Junte-se a centenas de empresas que já mapearam seus gaps e construíram um roadmap claro para o sucesso com dados e IA.
          </p>
          <Button asChild size="lg" className="h-14 px-10 text-lg bg-brand-primary text-white hover:bg-brand-primary/90">
            <Link href="/signup">
              Começar Diagnóstico Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-6 text-sm text-gray-500">
            Leva apenas 10 minutos. O relatório detalhado é gerado instantaneamente.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-primary text-white font-bold text-xs">
              DM
            </div>
            <span className="font-bold text-gray-900">DataMaturity</span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} DataMaturity. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
