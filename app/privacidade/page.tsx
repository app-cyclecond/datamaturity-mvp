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
                  A DataMaturity ("nós", "nosso", "nossa") tem o compromisso de proteger a sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e salvaguardamos suas informações quando você visita nosso site datamaturity.com.br e utiliza nossa plataforma de diagnóstico de maturidade de dados.
                </p>
                <p className="mt-4">
                  Por favor, leia esta política de privacidade cuidadosamente. Se você não concorda com os termos desta política, por favor, não acesse o site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">2. Coleta de Informações</h2>
                <p>
                  Podemos coletar informações sobre você de várias maneiras. As informações que podemos coletar no Site incluem:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li><strong>Dados Pessoais:</strong> Informações de identificação pessoal, como seu nome, endereço de e-mail e número de telefone, que você nos fornece voluntariamente ao se registrar no Site.</li>
                  <li><strong>Dados Corporativos:</strong> Informações sobre sua empresa fornecidas durante o preenchimento do diagnóstico de maturidade de dados.</li>
                  <li><strong>Dados Derivados:</strong> Informações que nossos servidores coletam automaticamente quando você acessa o Site, como seu endereço IP, seu tipo de navegador, seu sistema operacional, seus tempos de acesso e as páginas que você visualizou diretamente antes e depois de acessar o Site.</li>
                  <li><strong>Dados Financeiros:</strong> Dados financeiros relacionados ao seu método de pagamento (como número de cartão de crédito) que são coletados e processados de forma segura diretamente pelo nosso provedor de pagamentos (Stripe). Nós não armazenamos dados de cartão de crédito em nossos servidores.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">3. Uso das Informações</h2>
                <p>
                  Ter informações precisas sobre você nos permite fornecer a você uma experiência suave, eficiente e personalizada. Especificamente, podemos usar as informações coletadas sobre você através do Site para:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>Criar e gerenciar sua conta.</li>
                  <li>Gerar os relatórios de diagnóstico e roadmaps personalizados.</li>
                  <li>Processar transações e enviar avisos relacionados às suas transações.</li>
                  <li>Enviar e-mails administrativos, como confirmação de conta, redefinição de senha ou atualizações de políticas.</li>
                  <li>Melhorar a eficiência e operação do Site.</li>
                  <li>Monitorar e analisar o uso e as tendências para melhorar a sua experiência.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">4. Compartilhamento de Informações</h2>
                <p>
                  Podemos compartilhar informações que coletamos sobre você em certas situações. Suas informações podem ser divulgadas da seguinte forma:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li><strong>Por Lei ou para Proteger Direitos:</strong> Se acreditarmos que a liberação de informações sobre você é necessária para responder a processos legais, para investigar ou remediar possíveis violações de nossas políticas, ou para proteger os direitos, a propriedade e a segurança de outros.</li>
                  <li><strong>Provedores de Serviços Terceirizados:</strong> Podemos compartilhar suas informações com terceiros que realizam serviços para nós ou em nosso nome, como processamento de pagamentos (Stripe), análise de dados, entrega de e-mail (Resend) e serviços de hospedagem (Vercel, Supabase).</li>
                </ul>
                <p className="mt-4 font-medium text-slate-900">
                  Importante: A DataMaturity NÃO vende, aluga ou comercializa seus dados pessoais ou as respostas do seu diagnóstico para terceiros para fins de marketing.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">5. Segurança dos Dados</h2>
                <p>
                  Usamos medidas de segurança administrativas, técnicas e físicas para ajudar a proteger suas informações pessoais e corporativas. Embora tenhamos tomado medidas razoáveis para proteger as informações pessoais que você nos fornece, esteja ciente de que, apesar de nossos esforços, nenhuma medida de segurança é perfeita ou impenetrável, e nenhum método de transmissão de dados pode ser garantido contra qualquer interceptação ou outro tipo de uso indevido.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">6. Seus Direitos</h2>
                <p>
                  Você tem o direito de solicitar o acesso, a correção ou a exclusão dos seus dados pessoais armazenados em nossa plataforma. Se você deseja encerrar sua conta e excluir seus dados, entre em contato conosco através dos canais listados abaixo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">7. Contato</h2>
                <p>
                  Se você tiver dúvidas ou comentários sobre esta Política de Privacidade, entre em contato conosco:
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
