# 📋 Guia de Migração Manual - DataMaturity MVP

## 🚀 Como Executar a Migração

### Passo 1: Acessar o SQL Editor do Supabase

1. Acesse: https://app.supabase.com/project/yprdapjbnwcqjyqvmufv/sql/new
2. Você será levado para o **SQL Editor** onde pode executar comandos SQL

### Passo 2: Executar os Comandos SQL

Copie e cole **cada bloco de SQL abaixo** no editor e clique em **"Run"** (ou pressione `Ctrl+Enter`).

---

## 📝 Comandos SQL para Executar

### Comando 1️⃣: Adicionar coluna `industry` à tabela `users`

```sql
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS industry TEXT DEFAULT 'Tech' 
CHECK (industry IN ('Tech', 'Financeiro', 'Retail', 'Saúde', 'Manufatura', 'Outro'));
```

**Resultado esperado:** `ALTER TABLE` ou aviso se a coluna já existe

---

### Comando 2️⃣: Remover constraint antigo de `plan`

```sql
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_plan_check;
```

**Resultado esperado:** `ALTER TABLE` ou aviso se o constraint não existe

---

### Comando 3️⃣: Adicionar novo constraint de `plan`

```sql
ALTER TABLE public.users 
ADD CONSTRAINT users_plan_check 
CHECK (plan IN ('bronze', 'silver', 'gold', 'starter'));
```

**Resultado esperado:** `ALTER TABLE`

---

### Comando 4️⃣: Criar tabela `content_library`

```sql
CREATE TABLE IF NOT EXISTS public.content_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  pillar TEXT NOT NULL CHECK (pillar IN ('técnico', 'regulatório', 'cultura')),
  content_url TEXT,
  required_plan TEXT NOT NULL CHECK (required_plan IN ('bronze', 'silver', 'gold')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Resultado esperado:** `CREATE TABLE` ou aviso se a tabela já existe

---

### Comando 5️⃣: Habilitar Row Level Security (RLS)

```sql
ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;
```

**Resultado esperado:** `ALTER TABLE`

---

### Comando 6️⃣: Criar Policy de Acesso

```sql
CREATE POLICY IF NOT EXISTS "Users can view content based on their plan"
  ON public.content_library FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND (
        u.plan = 'gold'
        OR (u.plan = 'silver' AND required_plan IN ('bronze', 'silver'))
        OR (u.plan = 'bronze' AND required_plan = 'bronze')
      )
    )
  );
```

**Resultado esperado:** `CREATE POLICY`

---

## ✅ Verificação da Migração

Após executar todos os comandos, execute **estes comandos de verificação** para confirmar que tudo funcionou:

### Verificar coluna `industry`

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'industry';
```

**Resultado esperado:** Uma linha mostrando a coluna `industry` com tipo `text` e default `'Tech'`

---

### Verificar tabela `content_library`

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'content_library' AND table_schema = 'public';
```

**Resultado esperado:** Uma linha com `content_library`

---

### Verificar policies de RLS

```sql
SELECT policyname, tablename, qual 
FROM pg_policies 
WHERE tablename = 'content_library';
```

**Resultado esperado:** Uma linha com a policy `"Users can view content based on their plan"`

---

### Verificar constraint de `plan`

```sql
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'users' AND constraint_name = 'users_plan_check';
```

**Resultado esperado:** Uma linha com `users_plan_check` e tipo `CHECK`

---

## 🆘 Solução de Problemas

### ❌ Erro: "column already exists"
**Solução:** Isso é normal! O comando usa `IF NOT EXISTS`, então se a coluna já existe, é ignorada.

### ❌ Erro: "constraint already exists"
**Solução:** O comando usa `IF NOT EXISTS` ou `DROP IF EXISTS`, então é seguro executar novamente.

### ❌ Erro: "permission denied"
**Solução:** Certifique-se de que está usando a conta correta no Supabase com permissões de administrador.

### ❌ Erro: "table does not exist"
**Solução:** Verifique se a tabela `users` existe. Se não, você precisa criar antes de adicionar colunas.

---

## 📊 Resumo da Migração

| Operação | Descrição | Status |
|----------|-----------|--------|
| Coluna `industry` | Adicionada à tabela `users` | ✅ |
| Constraint `plan` | Atualizado com novos valores | ✅ |
| Tabela `content_library` | Criada com RLS habilitado | ✅ |
| Policy de acesso | Criada para controlar acesso por plano | ✅ |

---

## 🎯 Próximos Passos

Após completar a migração:

1. ✅ Testar o login e verificar se o campo `industry` aparece nas Configurações
2. ✅ Verificar se a Biblioteca de Conteúdo está funcionando corretamente
3. ✅ Testar o benchmarking com diferentes indústrias
4. ✅ Validar as policies de RLS com diferentes planos (Bronze, Silver, Gold)

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique a aba **"Errors"** no SQL Editor para mensagens de erro detalhadas
2. Consulte a documentação do Supabase: https://supabase.com/docs
3. Verifique se todos os comandos foram executados na ordem correta

**Boa sorte! 🚀**
