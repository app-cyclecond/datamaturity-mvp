-- Criar tabela de assinaturas
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan VARCHAR NOT NULL CHECK (plan IN ('starter', 'bronze', 'silver', 'gold')),
  status VARCHAR NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  stripe_subscription_id VARCHAR UNIQUE,
  stripe_customer_id VARCHAR,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Habilitar RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver suas próprias assinaturas
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Apenas sistema pode atualizar assinaturas
CREATE POLICY "Only service role can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (false) -- Desabilitar via RLS, permitir apenas via service role
  WITH CHECK (false);

-- Criar tabela de histórico de faturas
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  stripe_invoice_id VARCHAR UNIQUE,
  amount_paid INTEGER NOT NULL, -- em centavos
  currency VARCHAR DEFAULT 'BRL',
  status VARCHAR NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON public.invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON public.invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);

-- Habilitar RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver suas próprias faturas
CREATE POLICY "Users can view their own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

-- Atualizar tabela users para adicionar coluna de plano (se não existir)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS plan VARCHAR DEFAULT 'starter' CHECK (plan IN ('starter', 'bronze', 'silver', 'gold'));

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at_trigger
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_subscriptions_updated_at();

-- Criar trigger para atualizar updated_at em invoices
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invoices_updated_at_trigger
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION update_invoices_updated_at();
