"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import AuthenticatedLayout from "@/components/auth/AuthenticatedLayout";
import {
  ChevronDown, ChevronUp, MessageCircle, Mail,
  Send, CheckCircle2, Lightbulb, HelpCircle, AlertCircle,
} from "lucide-react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  plan: string;
};

const FAQ_ITEMS = [
  {
    id: 1,
    categoria: "Diagnóstico",
    pergunta: "Como funciona o diagnóstico de maturidade de dados?",
    resposta:
      "O diagnóstico avalia sua organização em 7 dimensões: Estratégia & Governança, Arquitetura & Engenharia, Gestão de Dados, Qualidade de Dados, Analytics & Valor, Cultura & Literacy e IA & Advanced Analytics. Você responde um questionário estruturado e recebe um score de 1 a 5 em cada dimensão, além de um score geral e um nível de maturidade (Inicial, Reativo, Proativo, Gerenciado ou Otimizado).",
  },
  {
    id: 2,
    categoria: "Diagnóstico",
    pergunta: "Posso refazer o diagnóstico depois de implementar melhorias?",
    resposta:
      "Sim. Você pode realizar novos diagnósticos a qualquer momento. O histórico completo fica salvo na plataforma, permitindo que você acompanhe a evolução da maturidade ao longo do tempo. Recomendamos refazer o diagnóstico a cada 6 meses para medir o progresso das iniciativas.",
  },
  {
    id: 3,
    categoria: "Planos e Acesso",
    pergunta: "Qual a diferença entre os planos Bronze, Silver e Gold?",
    resposta:
      "O plano Bronze (R$ 4.900/ano) dá acesso ao diagnóstico completo, roadmap personalizado e documentos da categoria Bronze na Biblioteca. O plano Silver (R$ 9.900/ano) inclui tudo do Bronze mais os documentos Silver — materiais mais aprofundados sobre governança, cultura data-driven e democratização de dados. O plano Gold é customizado para equipes e inclui acesso total à Biblioteca, suporte dedicado e sessões de consultoria — entre em contato via WhatsApp para uma proposta.",
  },
  {
    id: 4,
    categoria: "Planos e Acesso",
    pergunta: "O pagamento é mensal ou anual?",
    resposta:
      "Os planos Bronze e Silver são cobrados anualmente. Essa estrutura permite que você implemente as iniciativas do roadmap com continuidade, acompanhando a evolução da maturidade ao longo de 12 meses. Não há cobrança mensal recorrente — você paga uma vez e tem acesso por 12 meses completos.",
  },
  {
    id: 5,
    categoria: "Planos e Acesso",
    pergunta: "Posso fazer upgrade do meu plano depois?",
    resposta:
      "Sim. Você pode fazer upgrade do Bronze para o Silver a qualquer momento. O valor proporcional ao período restante é considerado no cálculo. Entre em contato pelo WhatsApp (11) 91977-1377 para solicitar o upgrade e receber as instruções de pagamento.",
  },
  {
    id: 6,
    categoria: "Biblioteca",
    pergunta: "Como funciona a Biblioteca de Documentos?",
    resposta:
      "A Biblioteca reúne documentos executivos no padrão McKinsey sobre temas estratégicos de dados e IA. Cada documento é categorizado por plano de acesso (Bronze, Silver ou Gold). Usuários Bronze acessam os documentos Bronze; Silver acessam Bronze + Silver; Gold acessa todos. Os documentos são PDFs de alta qualidade, com dados de mercado, frameworks e recomendações práticas.",
  },
  {
    id: 7,
    categoria: "Roadmap",
    pergunta: "O roadmap é genérico ou personalizado para minha empresa?",
    resposta:
      "O roadmap é gerado automaticamente com base nos resultados do seu diagnóstico. Ele prioriza as dimensões com maior gap em relação ao benchmark do seu setor e sugere iniciativas concretas, ordenadas por impacto e esforço. Cada vez que você realiza um novo diagnóstico, o roadmap é atualizado para refletir o estado atual da organização.",
  },
  {
    id: 8,
    categoria: "Técnico",
    pergunta: "Meus dados estão seguros na plataforma?",
    resposta:
      "Sim. A plataforma utiliza Supabase (PostgreSQL) com autenticação segura, criptografia em trânsito (HTTPS/TLS) e em repouso. Os dados de diagnóstico são vinculados exclusivamente à sua conta e não são compartilhados com terceiros. Seguimos as diretrizes da LGPD para tratamento de dados pessoais e corporativos.",
  },
  {
    id: 9,
    categoria: "Técnico",
    pergunta: "A plataforma funciona em dispositivos móveis?",
    resposta:
      "A plataforma é otimizada para uso em desktop e notebooks, que é o ambiente típico de trabalho de executivos e líderes de dados. Em tablets e smartphones, a interface é funcional mas pode ter limitações visuais em algumas telas mais complexas, como o roadmap e os dashboards de benchmarking.",
  },
  {
    id: 10,
    categoria: "Suporte",
    pergunta: "Como posso entrar em contato para dúvidas ou suporte?",
    resposta:
      "Para suporte rápido, use o WhatsApp (11) 91977-1377 — respondemos em até 4 horas em dias úteis. Para questões mais detalhadas ou solicitações de proposta Gold, envie um email para contato@datamaturity.com.br. Se tiver uma sugestão de melhoria ou sentiu falta de algum recurso, use o campo abaixo — sua contribuição é muito valiosa para evoluirmos a plataforma.",
  },
];

const CATEGORIAS = ["Todos", "Diagnóstico", "Planos e Acesso", "Biblioteca", "Roadmap", "Técnico", "Suporte"];

export default function SuportePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [sugestao, setSugestao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/auth/login"); return; }
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id, name, email, plan")
        .eq("id", authUser.id)
        .single();
      setUser(profile || { id: authUser.id, name: authUser.email || "Usuário", email: authUser.email || "", plan: "free" });
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleEnviarSugestao = async () => {
    if (!sugestao.trim() || sugestao.trim().length < 5) {
      setErroEnvio("Por favor, escreva pelo menos 5 caracteres.");
      return;
    }
    setEnviando(true);
    setErroEnvio("");
    try {
      const response = await fetch("/api/sugestoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: sugestao, categoria: "sugestao_usuario" }),
      });
      if (response.ok) {
        setEnviado(true);
        setSugestao("");
      } else {
        const data = await response.json();
        setErroEnvio(data.error || "Erro ao enviar. Tente novamente.");
      }
    } catch {
      setErroEnvio("Erro de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  const faqFiltrado = categoriaAtiva === "Todos"
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.categoria === categoriaAtiva);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          <p className="mt-3 text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user || undefined} activePage="suporte" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Central de Suporte</h1>
            <p className="text-sm text-gray-500 mt-1">
              Encontre respostas para as dúvidas mais comuns ou entre em contato diretamente.
            </p>
          </div>

          {/* CANAIS DE CONTATO */}
          <div className="grid grid-cols-2 gap-4">
            <a
              href="https://wa.me/5511919771377"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-300 hover:bg-green-50 transition-all group"
            >
              <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">WhatsApp</div>
                <div className="text-xs text-gray-500 mt-0.5">(11) 91977-1377</div>
              </div>
            </a>
            <a
              href="mailto:contato@datamaturity.com.br"
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="h-11 w-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">Email</div>
                <div className="text-xs text-gray-500 mt-0.5">contato@datamaturity.com.br</div>
              </div>
            </a>
          </div>

          {/* FAQ */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Perguntas Frequentes</h2>
            </div>

            {/* Filtros de categoria */}
            <div className="flex flex-wrap gap-2 mb-5">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaAtiva(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    categoriaAtiva === cat
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Lista de FAQ */}
            <div className="space-y-2">
              {faqFiltrado.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 flex-shrink-0 mt-0.5">
                        {item.categoria}
                      </span>
                      <span className="font-medium text-gray-900 text-sm">{item.pergunta}</span>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {openFaq === item.id ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                  {openFaq === item.id && (
                    <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                      <p className="text-sm text-gray-600 leading-relaxed">{item.resposta}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CAMPO DE SUGESTÃO */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-gray-900">Sentiu falta de algo? Nos diga aqui.</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Sua opinião molda o produto. Sugestões de novas funcionalidades, documentos, métricas ou qualquer melhoria são muito bem-vindas.
            </p>

            {enviado ? (
              <div className="flex items-center gap-3 bg-white border border-green-200 rounded-xl p-4">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Sugestão enviada com sucesso!</div>
                  <div className="text-xs text-gray-500 mt-0.5">Obrigado pela contribuição. Analisamos todas as sugestões.</div>
                </div>
                <button
                  onClick={() => setEnviado(false)}
                  className="ml-auto text-xs text-indigo-600 hover:underline font-medium"
                >
                  Enviar outra
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={sugestao}
                  onChange={(e) => { setSugestao(e.target.value); setErroEnvio(""); }}
                  placeholder="Ex: Gostaria de ver um benchmark por porte de empresa, ou um documento sobre Data Mesh..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                {erroEnvio && (
                  <div className="flex items-center gap-2 text-red-600 text-xs">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {erroEnvio}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{sugestao.length} caracteres</span>
                  <button
                    onClick={handleEnviarSugestao}
                    disabled={enviando || sugestao.trim().length < 5}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {enviando ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar sugestão
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
    </AuthenticatedLayout>
  );
}
