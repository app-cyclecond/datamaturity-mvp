-- Tabela para armazenar sugestões dos usuários
-- Execute este script no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS user_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  categoria VARCHAR(100) DEFAULT 'geral',
  status VARCHAR(50) DEFAULT 'pendente', -- pendente, lido, implementado
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca por usuário
CREATE INDEX IF NOT EXISTS idx_user_suggestions_user_id ON user_suggestions(user_id);

-- Índice para busca por status
CREATE INDEX IF NOT EXISTS idx_user_suggestions_status ON user_suggestions(status);

-- RLS: usuários só podem ver e criar suas próprias sugestões
ALTER TABLE user_suggestions ENABLE ROW LEVEL SECURITY;

-- Política: usuário pode inserir suas próprias sugestões
CREATE POLICY "Users can insert own suggestions"
  ON user_suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: usuário pode ver suas próprias sugestões
CREATE POLICY "Users can view own suggestions"
  ON user_suggestions FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_suggestions_updated_at
  BEFORE UPDATE ON user_suggestions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentário
COMMENT ON TABLE user_suggestions IS 'Sugestões de melhoria enviadas pelos usuários via Central de Suporte';
