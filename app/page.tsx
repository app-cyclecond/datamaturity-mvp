'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, CheckCircle2, TrendingUp, BarChart3, Lock, Users, Zap, LogOut, User } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    
    const checkAuth = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setIsLoggedIn(true)
        setUserEmail(data.user.email || '')
      }
      setIsLoading(false)
    }
    checkAuth()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DM</span>
              </div>
              <span className="font-display font-bold text-xl text-neutral-900">DataMaturity</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#framework" className="text-neutral-600 hover:text-primary-600 transition">
                Metodologia
              </a>
              <a href="#roi" className="text-neutral-600 hover:text-primary-600 transition">
                ROI
              </a>
              <Link href="/planos" className="text-neutral-600 hover:text-primary-600 transition">
                Planos
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {!isLoading && isLoggedIn ? (
                <>
                  <Link href="/dashboard/home" className="text-neutral-600 hover:text-primary-600 transition text-sm font-medium">
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100">
                    <User className="h-4 w-4 text-neutral-600" />
                    <span className="text-sm text-neutral-700">{userEmail.split('@')[0]}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-neutral-600 hover:text-primary-600 transition font-medium"
                  >
                    Entrar
                  </Link>
                  <Link 
                    href="/assessment"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition transform hover:scale-105"
                  >
                    Começar Grátis
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6 border border-primary-200">
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Baseado em frameworks globais (Gartner, DAMA)</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-display font-bold text-neutral-900 mb-6 leading-tight">
            Descubra por que seus <span className="text-amber-500 font-black uppercase tracking-wide">DADOS</span> não geram <span className="text-primary-600">valor</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Diagnóstico baseado em frameworks globais que identifica os gaps na sua estratégia de dados em apenas 10 minutos. Receba um roadmap prático e compare-se com o mercado.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href={isLoggedIn ? "/assessment" : "/signup"}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isLoggedIn ? "Fazer Novo Diagnóstico" : "Descobrir Seu Score"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold transition">
              Entender a Metodologia
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary-600" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary-600" />
              <span>Resultado em 10 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary-600" />
              <span>Relatório detalhado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              O Custo da Baixa Maturidade em Dados
            </h2>
            <p className="text-xl text-neutral-600">
              Empresas que não estruturam sua governança e arquitetura de dados perdem dinheiro, tempo e oportunidades todos os dias.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Problem 1 */}
            <div className="p-8 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-card transition">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Decisões no "Achismo"</h3>
              <p className="text-neutral-600">
                Sem dados confiáveis, líderes dependem da intuição. Isso gera estratégias desalinhadas e investimentos com baixo ROI.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="p-8 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-card transition">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Silos de Informação</h3>
              <p className="text-neutral-600">
                Cada departamento tem "sua própria verdade". O tempo gasto reconciliando planilhas destrói a produtividade.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="p-8 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-card transition">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Frustração com IA</h3>
              <p className="text-neutral-600">
                Projetos de IA falham porque a base de dados é ruim. "Garbage in, garbage out" nunca foi tão real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Section */}
      <section id="framework" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              Framework Completo de Avaliação
            </h2>
            <p className="text-xl text-neutral-600">
              Nossa metodologia avalia sua empresa em 7 dimensões críticas, baseadas nas melhores práticas globais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Dimensions List */}
            <div className="space-y-4">
              {[
                { icon: Lock, title: 'Estratégia & Governança', desc: 'Alinhamento com o negócio' },
                { icon: BarChart3, title: 'Arquitetura & Engenharia', desc: 'Infraestrutura e escalabilidade' },
                { icon: CheckCircle2, title: 'Gestão & Qualidade', desc: 'Catálogo e confiabilidade' },
                { icon: TrendingUp, title: 'Analytics & IA', desc: 'Geração de valor' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 transition">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900">{item.title}</h4>
                    <p className="text-sm text-neutral-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Score Card */}
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-lg">
              <div className="text-center mb-8">
                <p className="text-neutral-600 mb-2">Score Geral</p>
                <div className="text-6xl font-bold text-primary-600 mb-2">3.7</div>
                <p className="text-lg font-semibold text-secondary-600">Nível Avançado</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Estratégia & Governança', score: 4.2 },
                  { label: 'Arquitetura & Engenharia', score: 3.8 },
                  { label: 'Gestão de Dados', score: 3.1 },
                  { label: 'Analytics & Valor', score: 4.5 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">{item.label}</span>
                      <span className="text-sm font-bold text-primary-600">{item.score}</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${(item.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section id="roi" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              O Retorno sobre o Investimento em Dados
            </h2>
            <p className="text-xl text-neutral-600">
              Empresas orientadas a dados superam seus concorrentes em todas as métricas financeiras.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '+23%', label: 'Aquisição de Clientes' },
              { value: '+19%', label: 'Lucratividade' },
              { value: '-30%', label: 'Custos Operacionais' },
              { value: '15x', label: 'Retenção de Clientes' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
                <div className="text-4xl font-bold text-primary-600 mb-2">{item.value}</div>
                <p className="text-neutral-600 font-medium">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-neutral-500 mt-8">
            * Fonte: McKinsey Global Institute & Harvard Business Review
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-6">
            Pronto para descobrir seu nível de maturidade?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Junte-se a centenas de empresas que já mapearam seus gaps e construíram um roadmap claro para o sucesso.
          </p>
          <Link 
            href={isLoggedIn ? "/assessment" : "/signup"}
            className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105"
          >
            {isLoggedIn ? "Fazer Novo Diagnóstico" : "Começar Diagnóstico Agora"}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-primary-100 mt-4 text-sm">Leva apenas 10 minutos. O relatório detalhado é gerado instantaneamente.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">DM</span>
                </div>
                <span className="font-bold text-white">DataMaturity</span>
              </div>
              <p className="text-sm">Transformando dados em vantagem competitiva.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Diagnóstico</a></li>
                <li><a href="/planos" className="hover:text-white transition">Planos</a></li>
                <li><a href="#" className="hover:text-white transition">Metodologia</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
                <li><a href="#" className="hover:text-white transition">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>&copy; 2026 DataMaturity. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
