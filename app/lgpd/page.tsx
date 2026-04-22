import Link from "next/link";
import { ArrowLeft, FileCheck, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Conformidade com a LGPD | DataMaturity",
  description: "Declaração de conformidade da DataMaturity com a Lei Geral de Proteção de Dados (LGPD).",
};

export default function LgpdPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500 transition"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </div>

        <div className="bg-white shadow-sm sm:rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-emerald-600 px-6 py-8 text-white text-center">
            <FileCheck className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
            <h1 className="text-3xl font-bold mb-2">Conformidade com a LGPD</h1>
            <p className="text-emerald-100">Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)</p>
          </div>
          
          <div className="px-6 py-8 sm:p-10">
            <div className="prose prose-emerald max-w-none text-slate-600 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Nosso Compromisso
                </h2>
                <p>
                  A DataMaturity reconhece a importância da privacidade e da proteção de dados pessoais. Nosso compromisso é garantir a transparência, a segurança e o respeito aos direitos dos titulares de dados, em total conformidade com a Lei Geral de Proteção de Dados (LGPD).
                </p>
                <p className="mt-4">
                  Como uma plataforma cujo negócio central é ajudar outras empresas a amadurecerem em suas práticas de dados (incluindo governança e segurança), aplicamos internamente os mais altos padrões de proteção de dados que recomendamos aos nossos clientes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Bases Legais para o Tratamento
                </h2>
                <p>
                  Realizamos o tratamento de dados pessoais apenas quando temos uma base legal válida, que inclui:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li><strong>Consentimento:</strong> Quando você concorda explicitamente em nos fornecer seus dados para criar uma conta.</li>
                  <li><strong>Execução de Contrato:</strong> Para fornecer os serviços de diagnóstico, gerar relatórios e processar pagamentos dos planos contratados.</li>
                  <li><strong>Legítimo Interesse:</strong> Para melhorar nossos serviços, garantir a segurança da plataforma e prevenir fraudes.</li>
                  <li><strong>Obrigação Legal:</strong> Para cumprimento de obrigações fiscais e regulatórias (ex: emissão de notas fiscais).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Direitos dos Titulares (Art. 18 da LGPD)
                </h2>
                <p>
                  Garantimos a você, titular dos dados, o exercício pleno dos seus direitos previstos na lei:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Acesso e Confirmação</h4>
                    <p className="text-sm">Saber se tratamos seus dados e ter acesso a eles.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Correção</h4>
                    <p className="text-sm">Corrigir dados incompletos, inexatos ou desatualizados diretamente no seu perfil.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Anonimização ou Exclusão</h4>
                    <p className="text-sm">Solicitar a exclusão dos dados tratados com seu consentimento.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Portabilidade</h4>
                    <p className="text-sm">Receber seus dados em formato estruturado para transferência a outro fornecedor.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Revogação</h4>
                    <p className="text-sm">Revogar o consentimento a qualquer momento.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Informação sobre Compartilhamento</h4>
                    <p className="text-sm">Saber com quais entidades públicas ou privadas compartilhamos dados.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Segurança da Informação
                </h2>
                <p>
                  A DataMaturity utiliza as melhores práticas de mercado para proteger seus dados, incluindo:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>Criptografia em trânsito (HTTPS/TLS) e em repouso nos bancos de dados (Supabase/PostgreSQL).</li>
                  <li>Controle rigoroso de acesso lógico aos servidores e painéis administrativos.</li>
                  <li>Senhas hasheadas e autenticação segura baseada em tokens (JWT).</li>
                  <li>Não armazenamos dados sensíveis de pagamento; toda transação financeira ocorre no ambiente seguro do Stripe (PCI-DSS Nível 1).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Encarregado pelo Tratamento de Dados (DPO)
                </h2>
                <p>
                  Para exercer seus direitos como titular de dados, ou para esclarecer qualquer dúvida sobre como tratamos suas informações pessoais, entre em contato com nosso Encarregado de Dados (DPO):
                </p>
                <div className="bg-emerald-50 p-5 rounded-xl mt-4 border border-emerald-100">
                  <p className="font-bold text-emerald-900 mb-1">DPO DataMaturity</p>
                  <p className="text-emerald-800"><strong>E-mail exclusivo para LGPD:</strong> privacidade@datamaturity.com.br</p>
                  <p className="text-emerald-800 mt-2 text-sm">
                    Responderemos a todas as solicitações de exercício de direitos dos titulares dentro do prazo legal de 15 dias.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
