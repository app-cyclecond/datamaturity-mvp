import Link from "next/link";
import { BookOpen, FileText, Download, CheckCircle, ArrowRight, ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Biblioteca de Recursos | DataMaturity",
  description: "Acesse nossa biblioteca exclusiva de templates, frameworks e guias práticos para acelerar a maturidade de dados da sua empresa.",
};

export default function BibliotecaPublicaPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DM</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">DataMaturity</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
              Entrar
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-6 border border-indigo-500/30">
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca Exclusiva</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Acelere sua jornada de dados com <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">materiais práticos</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Esqueça a teoria vazia. Nossa biblioteca oferece templates prontos para uso, frameworks validados pelo mercado e guias passo a passo para transformar a cultura de dados da sua empresa hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/planos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/25"
            >
              Ver Planos de Acesso
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#preview"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition backdrop-blur-sm border border-white/10"
            >
              Explorar o Acervo
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">O que você vai encontrar?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Desenvolvemos materiais focados em execução, organizados por nível de maturidade e necessidade estratégica.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Templates Prontos</h3>
              <p className="text-slate-600 leading-relaxed">
                Planilhas, documentos Word e apresentações pré-formatadas para Políticas de Governança, Dicionários de Dados e Catálogos.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Frameworks de Ação</h3>
              <p className="text-slate-600 leading-relaxed">
                Modelos visuais e checklists para implementação de LGPD, estruturação de times de dados e arquitetura tecnológica.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Guias Estratégicos</h3>
              <p className="text-slate-600 leading-relaxed">
                Manuais detalhados sobre como engajar stakeholders, medir ROI de projetos de dados e criar uma cultura Data-Driven.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PREVIEW DO ACERVO */}
      <section id="preview" className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Espiadinha no Acervo</h2>
            <p className="text-slate-600">Alguns dos documentos mais baixados pelos nossos clientes Premium.</p>
          </div>

          <div className="space-y-4">
            {[
              { title: "Template de Política de Governança de Dados", desc: "Documento base em DOCX com todas as cláusulas necessárias para iniciar a governança.", tag: "Governança" },
              { title: "Checklist de Conformidade LGPD", desc: "Planilha XLSX com mais de 50 pontos de verificação para auditoria interna de dados.", tag: "Segurança" },
              { title: "Framework de ROI para Projetos de IA", desc: "Guia executivo em PDF para justificar investimentos em dados para a diretoria.", tag: "Estratégia" },
              { title: "Modelo de Arquitetura Modern Data Stack", desc: "Diagramas editáveis das melhores práticas de arquitetura em nuvem.", tag: "Tecnologia" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white rounded-xl border border-slate-200 shadow-sm gap-4 group hover:border-indigo-200 transition">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{item.tag}</span>
                    </div>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link href="/planos" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <Lock className="w-4 h-4" />
                    Desbloquear
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-500 mb-6">E mais de 20 outros materiais exclusivos disponíveis nos planos Bronze e Silver.</p>
            <Link
              href="/planos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition"
            >
              Ver Planos para Acessar Tudo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLIFICADO */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p>© {new Date().getFullYear()} DataMaturity. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
