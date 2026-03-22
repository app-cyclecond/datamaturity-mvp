-- Enable UUID support (usually already enabled in Supabase)
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique not null,
  company text,
  role text,
  plan text not null default 'starter' check (plan in ('starter', 'pro', 'corporate')),
  created_at timestamptz not null default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'completed')),
  score_total numeric(5,2),
  score_d1 numeric(5,2),
  score_d2 numeric(5,2),
  score_d3 numeric(5,2),
  score_d4 numeric(5,2),
  score_d5 numeric(5,2),
  score_d6 numeric(5,2),
  level text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  question_id integer not null,
  value text not null,
  score numeric(5,2),
  created_at timestamptz not null default now(),
  unique (assessment_id, question_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null unique references public.assessments(id) on delete cascade,
  pdf_url text,
  sent_email boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_id text,
  plan text not null default 'starter' check (plan in ('starter', 'pro', 'corporate')),
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.assessments enable row level security;
alter table public.answers enable row level security;
alter table public.reports enable row level security;
alter table public.subscriptions enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Service role manages users"
  on public.users for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Users can manage own assessments"
  on public.assessments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage answers of own assessments"
  on public.answers for all
  using (
    exists (
      select 1 from public.assessments a
      where a.id = assessment_id and a.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.assessments a
      where a.id = assessment_id and a.user_id = auth.uid()
    )
  );

create policy "Users can view own reports"
  on public.reports for select
  using (
    exists (
      select 1 from public.assessments a
      where a.id = assessment_id and a.user_id = auth.uid()
    )
  );

create policy "Service role manages reports"
  on public.reports for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role manages subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
