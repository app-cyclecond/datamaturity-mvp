import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade | DataMaturity",
  description: "Entenda como a DataMaturity coleta, usa e protege seus dados.",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </div>

        <div className="bg-white shadow-sm sm:rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-indigo-600 px-6 py-8 text-white text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-indigo-200" />
            <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
            <p className="text-indigo-100">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="px-6 py-8 sm:p-10">
            <div className="prose prose-indigo max-w-none text-slate-600 space-y-8">

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">1. Introdução</h2>
                <p>
                  A DataMaturity tem o compromisso de proteger a privacidade dos seus usuários. Esta Política de Privacidade explica como coletamos, utilizamos e protegemos as informações fornecidas ao acessar o site datamaturity.com.br e utilizar a plataforma de diagnóstico de maturidade de dados.
                </p>
                <p className="mt-4">
                  Ao criar uma conta ou utilizar qualquer funcionalidade da plataforma, o usuário concorda com as práticas descritas neste documento. Caso não concorde, recomendamos que não utilize os serviços.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">2. Dados Coletados</h2>
                <p>
                  A DataMaturity coleta apenas as informações necessárias para a prestação dos serviços. Os dados coletados incluem:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li><strong>Dados de cadastro:</strong> nome completo e endereço de e-mail, fornecidos voluntariamente no momento do registro.</li>
                  <li><strong>Dados do diagnóstico:</strong> respostas e informações sobre a empresa inseridas durante o preenchimento do assessment de maturidade de dados.</li>
                  <li><strong>Dados de acesso:</strong> informações técnicas coletadas automaticamente, como endereço IP, tipo de navegador e páginas visitadas, utilizadas exclusivamente para fins de segurança e melhoria da plataforma.</li>
                  <li><strong>Dados de pagamento:</strong> as transações financeiras são processadas diretamente pelo Stripe, certificado PCI-DSS Nível 1. A DataMaturity não armazena dados de cartão de crédito em seus servidores.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">3. Uso das Informações</h2>
                <p>
                  As informações coletadas são utilizadas exclusivamente para:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>Criar e gerenciar a conta do usuário na plataforma.</li>
                  <li>Gerar os relatórios de diagnóstico e roadmaps personalizados.</li>
                  <li>Processar pagamentos e enviar confirmações de transação.</li>
                  <li>Enviar comunicações administrativas, como confirmação de cadastro e redefinição de senha.</li>
                  <li>Melhorar continuamente a experiência e os recursos da plataforma.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">4. Compartilhamento de Dados</h2>
                <p>
                  A DataMaturity não vende, aluga nem comercializa dados pessoais ou respostas de diagnóstico para terceiros com fins de marketing.
                </p>
                <p className="mt-4">
                  Os dados podem ser compartilhados apenas com os provedores de serviço diretamente envolvidos na operação da plataforma: processamento de pagamentos (Stripe), envio de e-mails transacionais (Resend) e infraestrutura de hospedagem (Vercel e Supabase). Todos esses parceiros operam sob acordos de confidencialidade e seguem boas práticas de segurança da informação.
                </p>
                <p className="mt-4">
                  Em casos excepcionais, informações poderão ser divulgadas quando exigido por lei ou por ordem judicial.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">5. Segurança</h2>
                <p>
                  A DataMaturity adota medidas técnicas e organizacionais para proteger os dados dos usuários, incluindo criptografia em trânsito (HTTPS/TLS), criptografia em repouso no banco de dados e controle rigoroso de acesso aos sistemas internos. Senhas são armazenadas de forma criptografada e nunca em texto puro.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">6. Direitos do Usuário</h2>
                <p>
                  O usuário pode, a qualquer momento, solicitar o acesso, a correção ou a exclusão dos seus dados pessoais armazenados na plataforma. Para exercer esses direitos, basta entrar em contato pelos canais abaixo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">7. Contato</h2>
                <p>
                  Para dúvidas sobre esta Política de Privacidade ou para exercer seus direitos como titular de dados:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg mt-4 border border-slate-200">
                  <p className="font-medium text-slate-900">DataMaturity</p>
                  <p className="mt-1"><strong>E-mail:</strong> contato@datamaturity.com.br</p>
                  <p><strong>WhatsApp:</strong> (11) 91977-1377</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
