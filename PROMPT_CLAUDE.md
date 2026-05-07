# Contexto do Projeto: DataMaturity

Você está assumindo o projeto DataMaturity, uma plataforma B2B de diagnóstico de maturidade em dados e IA. Preciso da sua ajuda para estruturar o modelo de negócios e as próximas funcionalidades.

## O que já construímos até agora

A DataMaturity é um SaaS B2B construído com Next.js 14, Tailwind CSS, Supabase (Auth + PostgreSQL) e Stripe. A plataforma resolve o problema de empresas que não sabem por onde começar sua jornada de dados.

### Funcionalidades Atuais:
1. **Landing Page:** Focada em conversão, com escala de maturidade (1 a 5), benefícios, depoimentos e FAQ.
2. **Assessment (Diagnóstico):** Um questionário de 35 perguntas cobrindo 7 dimensões (Estratégia & Governança, Arquitetura & Engenharia, Gestão de Dados, Qualidade de Dados, Analytics & Valor, Cultura & Literacy, IA & Advanced Analytics).
3. **Página de Resultado:** Mostra o score geral, o nível de maturidade e um gráfico de radar das dimensões. Pode ser exportado para PDF.
4. **Roadmap:** Um plano de ação gerado dinamicamente com base no nível atual da empresa em cada dimensão.
5. **Biblioteca:** Repositório de PDFs, templates e guias práticos (ex: Política de IA, Template de Governança), com acesso restrito por plano.
6. **Planos (Stripe):**
   - **Starter (Gratuito):** Faz o diagnóstico e vê o resultado básico.
   - **Bronze (R$ 4.900/ano):** Roadmap detalhado + materiais essenciais da biblioteca.
   - **Silver (R$ 9.900/ano):** Tudo do Bronze + materiais avançados da biblioteca.
7. **Área de Assinatura:** O usuário pode ver seu plano atual, fazer upgrade, ou cancelar a assinatura (com pesquisa de churn integrada).
8. **SEO e Analytics:** Open Graph, sitemap, robots.txt e GA4 configurados.

## O Novo Desafio: Modelo de Parceiros (B2B2C)

Além da venda direta para empresas, identifiquei uma grande oportunidade: consultorias de dados (como a do Ivan) querem usar a DataMaturity como ferramenta complementar aos serviços deles.

O problema é que o modelo de assinatura anual com preço exposto não funciona para eles. Se o cliente do Ivan acessar a página de planos e ver que custa R$ 4.900, ele pode contornar o Ivan e comprar direto, quebrando a venda do parceiro.

### A Solução Proposta (White Label / Experiência Isolada)
Discutimos criar uma experiência isolada para parceiros. O Ivan teria um link exclusivo (ex: `datamaturity.com.br/p/ivan-consultoria`). O cliente que acessa esse link:
- Não vê o menu de navegação normal
- Não vê a página de preços
- Responde ao assessment
- Recebe o resultado com um CTA do tipo "Fale com Ivan Consultoria para o roadmap completo"
- Os dados do assessment ficam vinculados ao Ivan no nosso banco de dados.

## O que preciso de você (Claude)

Com base em todo esse contexto técnico e de negócios, preciso que você me ajude a:

1. **Modelagem Comercial do Parceiro:** Como devo cobrar o Ivan? (Por pacote de créditos de assessment? Revenue share? Assinatura flat mensal para a consultoria dele?)
2. **Arquitetura de Dados:** Como estruturar isso no banco de dados atual (Supabase)? Precisamos de uma tabela `partners` e uma coluna `partner_id` nas respostas?
3. **Estratégia de Go-to-Market:** Como recrutar mais consultorias como a do Ivan para escalar esse modelo de canais?
4. **Riscos:** Quais os maiores riscos desse modelo de parceria (conflito de canal, suporte, etc) e como mitigá-los?

Por favor, analise a situação e me dê um plano de ação estratégico para implementar esse modelo B2B2C sem quebrar o B2B direto que já existe.
