# 🔐 Guia de Configuração do Stripe

Este guia explica como configurar o Stripe para processar pagamentos no DataMaturity.

## 📋 Pré-requisitos

- Conta Stripe criada (https://stripe.com)
- Node.js e npm instalados
- Acesso ao painel do Stripe

## 🚀 Passo 1: Criar Produtos e Preços no Stripe

### 1.1 Acessar o Dashboard do Stripe

1. Vá para https://dashboard.stripe.com
2. Faça login com sua conta
3. Clique em "Products" no menu lateral

### 1.2 Criar Produtos

Crie 3 produtos (Bronze, Silver, Gold):

**Bronze:**
- Nome: "DataMaturity Bronze"
- Descrição: "Plano Bronze - 3 diagnósticos por mês"
- Tipo: Serviço

**Silver:**
- Nome: "DataMaturity Silver"
- Descrição: "Plano Silver - 10 diagnósticos por mês"
- Tipo: Serviço

**Gold:**
- Nome: "DataMaturity Gold"
- Descrição: "Plano Gold - Diagnósticos ilimitados"
- Tipo: Serviço

### 1.3 Criar Preços

Para cada produto, crie um preço recorrente mensal:

**Bronze:**
- Preço: R$ 99,00
- Moeda: BRL
- Recorrência: Mensal
- Copie o Price ID (ex: `price_xxx`)

**Silver:**
- Preço: R$ 199,00
- Moeda: BRL
- Recorrência: Mensal
- Copie o Price ID

**Gold:**
- Preço: R$ 499,00
- Moeda: BRL
- Recorrência: Mensal
- Copie o Price ID

## 🔑 Passo 2: Obter Chaves de API

1. Vá para "Developers" → "API Keys" no Stripe
2. Copie:
   - **Publishable key** (começa com `pk_`)
   - **Secret key** (começa com `sk_`)

⚠️ **IMPORTANTE:** Nunca compartilhe a Secret key!

## 📝 Passo 3: Configurar Variáveis de Ambiente

Adicione ao arquivo `.env.local`:

```bash
# Stripe
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_BRONZE=price_xxx
STRIPE_PRICE_SILVER=price_xxx
STRIPE_PRICE_GOLD=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔗 Passo 4: Configurar Webhook

### 4.1 Criar Webhook no Stripe

1. Vá para "Developers" → "Webhooks"
2. Clique em "Add endpoint"
3. URL do endpoint: `https://seu-app.com/api/stripe/webhook`
4. Selecione os eventos:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`

### 4.2 Copiar Webhook Secret

Após criar o webhook, copie o "Signing secret" e adicione ao `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## 🧪 Passo 5: Testar Localmente

### 5.1 Instalar Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl https://files.stripe.com/stripe-cli/install.sh -O
bash install.sh

# Windows
choco install stripe
```

### 5.2 Fazer Login

```bash
stripe login
```

### 5.3 Iniciar Webhook Local

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o "Webhook signing secret" e adicione ao `.env.local`.

### 5.4 Testar Checkout

1. Inicie o app: `npm run dev`
2. Vá para `/planos`
3. Clique em "Selecionar" para um plano pago
4. Use cartão de teste: `4242 4242 4242 4242`
5. Data futura, qualquer CVC

## 📊 Passo 6: Verificar Integração

### 6.1 Verificar Banco de Dados

Após um checkout bem-sucedido, verifique:

```sql
-- Verificar assinatura criada
SELECT * FROM subscriptions WHERE user_id = 'seu-user-id';

-- Verificar invoice criada
SELECT * FROM invoices WHERE user_id = 'seu-user-id';
```

### 6.2 Verificar Logs

No Stripe Dashboard:
- Vá para "Developers" → "Logs"
- Procure por eventos de webhook

## 🚀 Deploy em Produção

### 6.1 Configurar Variáveis em Produção

1. Vá para seu projeto no Vercel
2. Settings → Environment Variables
3. Adicione as variáveis do Stripe (use chaves de produção)

### 6.2 Atualizar Webhook URL

1. No Stripe, atualize o webhook para: `https://seu-app-producao.com/api/stripe/webhook`
2. Use as chaves de produção (começam com `pk_live_` e `sk_live_`)

### 6.3 Testar em Produção

1. Use cartões de teste do Stripe
2. Verifique se os webhooks estão sendo recebidos
3. Confirme que as assinaturas estão sendo criadas

## 🐛 Troubleshooting

### Webhook não está sendo recebido

- Verifique se a URL do webhook está correta
- Verifique se o `STRIPE_WEBHOOK_SECRET` está correto
- Verifique os logs no Stripe Dashboard

### Checkout não funciona

- Verifique se os Price IDs estão corretos
- Verifique se as chaves de API estão corretas
- Verifique os logs do navegador (F12)

### Assinatura não está sendo criada

- Verifique se o webhook foi recebido
- Verifique os logs do Supabase
- Verifique se o usuário tem `user_id` no metadata do customer

## 📚 Recursos Adicionais

- [Documentação Stripe](https://stripe.com/docs)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Events](https://stripe.com/docs/api/events)
- [Subscriptions](https://stripe.com/docs/billing/subscriptions)

## ✅ Checklist de Configuração

- [ ] Conta Stripe criada
- [ ] Produtos criados (Bronze, Silver, Gold)
- [ ] Preços criados
- [ ] Chaves de API obtidas
- [ ] Variáveis de ambiente configuradas
- [ ] Webhook criado
- [ ] Stripe CLI instalado
- [ ] Webhook testado localmente
- [ ] Checkout testado
- [ ] Banco de dados verificado
- [ ] Deploy em produção
- [ ] Webhook em produção testado
