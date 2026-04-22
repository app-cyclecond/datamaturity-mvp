import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Serviço | DataMaturity",
  description: "Termos de serviço e condições de uso da plataforma DataMaturity.",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </div>

        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos de Serviço</h1>
            <p className="text-sm text-gray-500 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Aceitação dos Termos</h2>
                <p>
                  Ao acessar e usar a plataforma DataMaturity, você concorda em cumprir e ficar vinculado a estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Identificação da Empresa</h2>
                <p>
                  A plataforma DataMaturity é operada por:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Razão Social:</strong> VINICIUS FIORIN XAVIER DOS SANTOS CONSULTORIA EM TECNOLOGIA DA INFORMACAO LTDA</li>
                  <li><strong>CNPJ:</strong> 54.730.434/0001-92</li>
                  <li><strong>Endereço:</strong> Rua Francisco Marengo, 1210, Apt 31, Edif Lisboa, Tatuapé, São Paulo - SP, CEP: 03313-001</li>
                </ul>
                <p className="mt-2 text-sm italic text-gray-500">* O CNPJ foi deduzido a partir da data de abertura (16/04/2024) e do nome empresarial, devendo ser confirmado pelo usuário.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Descrição do Serviço</h2>
                <p>
                  A DataMaturity fornece uma plataforma de avaliação e diagnóstico de maturidade de dados para empresas, oferecendo relatórios, roadmaps personalizados e acesso a uma biblioteca de documentos estratégicos, dependendo do plano contratado (Starter, Bronze, Silver ou Gold).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Contas de Usuário</h2>
                <p>
                  Para acessar os recursos completos da plataforma, você deve criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorram sob sua conta. A DataMaturity reserva-se o direito de suspender ou encerrar contas que violem estes termos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Planos e Pagamentos</h2>
                <p>
                  Oferecemos planos gratuitos e pagos. Os pagamentos para os planos pagos (Bronze e Silver) são processados através do Stripe e concedem acesso pelo período de 12 meses. Os valores não são reembolsáveis, exceto conforme exigido por lei.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Propriedade Intelectual</h2>
                <p>
                  Todo o conteúdo, metodologias, frameworks, documentos da biblioteca e software presentes na plataforma DataMaturity são de propriedade exclusiva da VINICIUS FIORIN XAVIER DOS SANTOS CONSULTORIA EM TECNOLOGIA DA INFORMACAO LTDA. É estritamente proibida a reprodução, distribuição ou revenda não autorizada deste material.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Privacidade e Proteção de Dados</h2>
                <p>
                  O uso de seus dados pessoais e corporativos é regido por nossa Política de Privacidade, que está em conformidade com a Lei Geral de Proteção de Dados (LGPD). Os dados inseridos nos diagnósticos são mantidos em sigilo e utilizados apenas para gerar os resultados e roadmaps da sua própria empresa.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitação de Responsabilidade</h2>
                <p>
                  Os diagnósticos, roadmaps e documentos fornecidos pela DataMaturity têm caráter consultivo e estratégico. Não garantimos resultados financeiros ou operacionais específicos a partir da implementação das recomendações. A plataforma é fornecida "no estado em que se encontra".
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contato</h2>
                <p>
                  Para dúvidas sobre estes Termos de Serviço, entre em contato conosco:
                </p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>E-mail:</strong> contato@datamaturity.com.br</li>
                  <li><strong>WhatsApp:</strong> (11) 91977-1377</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
