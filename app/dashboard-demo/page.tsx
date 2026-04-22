import Link from "next/link";
import { BarChart3, PieChart, TrendingUp, Download, ArrowRight, Activity, Users, Shield, Database, Lock } from "lucide-react";

export const metadata = {
  title: "Demo do Dashboard | DataMaturity",
  description: "Veja como é o dashboard interativo da DataMaturity com relatórios detalhados, benchmarking e roadmaps personalizados.",
};

export default function DashboardDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* HEADER SIMPLIFICADO */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DM</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">DataMaturity</span>
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-md">DEMO</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signup"
              className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
            >
              Criar Conta Real
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR MOCK */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 border-r border-slate-800">
          <div className="mb-8 mt-4 px-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menu Principal</p>
            <nav className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg cursor-not-allowed">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Visão Geral</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg cursor-not-allowed opacity-50">
                <PieChart className="w-5 h-5" />
                <span>Resultados Detalhados</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg cursor-not-allowed opacity-50">
                <TrendingUp className="w-5 h-5" />
                <span>Roadmap de Ação</span>
              </div>
            </nav>
          </div>
          <div className="mt-auto mb-4 px-4 py-3 bg-slate-800 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Modo Demo</p>
                <p className="text-xs text-slate-400">Apenas visualização</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT MOCK */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {/* ALERT */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-8 flex items-start gap-3">
              <Activity className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-indigo-900">Bem-vindo à demonstração do Dashboard!</h3>
                <p className="text-sm text-indigo-700 mt-1">
                  Esta é uma visão simulada de como os resultados do seu diagnóstico aparecerão após você concluir o assessment e escolher um plano. Os dados abaixo são fictícios.
                </p>
              </div>
              <Link href="/planos" className="ml-auto flex-shrink-0 text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Ver Planos
              </Link>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-6">Visão Geral da Maturidade</h1>

            {/* SCORE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Score Geral</h3>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-slate-900">42</span>
                  <span className="text-lg font-medium text-slate-500 mb-1">/ 100</span>
                </div>
                <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <p className="text-sm font-medium text-amber-600 mt-2">Nível: Reativo (Nível 2)</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Benchmarking do Setor</h3>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-slate-900">58</span>
                  <span className="text-lg font-medium text-slate-500 mb-1">/ 100</span>
                </div>
                <p className="text-sm text-slate-600 mt-4">Sua empresa está <span className="font-bold text-red-500">16 pontos abaixo</span> da média do setor Financeiro.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 shadow-md text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium text-indigo-200 mb-2">Ação Recomendada</h3>
                  <p className="font-medium text-lg leading-tight">Focar na dimensão de Governança de Dados nos próximos 90 dias.</p>
                </div>
                <button className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition backdrop-blur-sm border border-white/10 flex items-center justify-center gap-2">
                  Ver Roadmap Completo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* DIMENSIONS BREAKDOWN */}
            <h2 className="text-xl font-bold text-slate-900 mb-4">Desempenho por Dimensão</h2>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
              <div className="p-6">
                <div className="space-y-6">
                  {[
                    { name: "Cultura e Pessoas", score: 65, color: "bg-emerald-500", icon: Users },
                    { name: "Tecnologia e Arquitetura", score: 50, color: "bg-amber-500", icon: Database },
                    { name: "Governança e Segurança", score: 25, color: "bg-red-500", icon: Shield },
                    { name: "Analytics e BI", score: 45, color: "bg-amber-500", icon: BarChart3 },
                  ].map((dim, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <dim.icon className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-700">{dim.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">{dim.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className={`${dim.color} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${dim.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-center">
                <button className="text-indigo-600 font-medium text-sm flex items-center gap-2 hover:text-indigo-700 transition">
                  <Download className="w-4 h-4" />
                  Exportar Relatório Executivo em PDF
                </button>
              </div>
            </div>

            {/* CALL TO ACTION */}
            <div className="text-center py-12 px-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Pronto para ver os dados da sua empresa?</h2>
              <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                Faça o diagnóstico gratuito agora mesmo e descubra o nível de maturidade em dados da sua organização em menos de 10 minutos.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
              >
                Iniciar Diagnóstico Gratuito
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
