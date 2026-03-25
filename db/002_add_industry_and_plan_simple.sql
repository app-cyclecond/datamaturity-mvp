-- Add industry column to users table
alter table public.users 
add column if not exists industry text default 'Tech' check (industry in ('Tech', 'Financeiro', 'Retail', 'Saúde', 'Manufatura', 'Outro'));

-- Update plan column to use new plan names (if constraint exists)
alter table public.users 
drop constraint if exists users_plan_check;

alter table public.users 
add constraint users_plan_check check (plan in ('bronze', 'silver', 'gold', 'starter'));

-- Create content_library table for managing content by plan
create table if not exists public.content_library (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  pillar text not null check (pillar in ('técnico', 'regulatório', 'cultura')),
  content_url text,
  required_plan text not null check (required_plan in ('bronze', 'silver', 'gold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on content_library
alter table public.content_library enable row level security;

-- Policy for viewing content based on plan
create policy if not exists "Users can view content based on their plan"
  on public.content_library for select
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
      and (
        u.plan = 'gold'
        or (u.plan = 'silver' and required_plan in ('bronze', 'silver'))
        or (u.plan = 'bronze' and required_plan = 'bronze')
      )
    )
  );
