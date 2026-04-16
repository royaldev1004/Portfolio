-- ============================================================
-- Migration: dynamic project categories
-- ============================================================

-- 1) Remove old fixed-category check constraint if it exists.
alter table public.projects
  drop constraint if exists projects_work_category_check;

-- 2) Create category table.
create table if not exists public.project_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- 3) RLS + policies.
alter table public.project_categories enable row level security;

drop policy if exists "public read project_categories" on public.project_categories;
create policy "public read project_categories"
  on public.project_categories for select using (true);

drop policy if exists "auth write project_categories" on public.project_categories;
create policy "auth write project_categories"
  on public.project_categories for all using (auth.role() = 'authenticated');

-- 4) Seed defaults (safe to re-run).
insert into public.project_categories (slug, label, sort_order) values
  ('low-code', 'Low-Code', 0),
  ('ai-voice-agent', 'AI Voice Agent', 1),
  ('automation', 'Automation', 2),
  ('ghl', 'GHL', 3)
on conflict (slug) do update
set label = excluded.label,
    sort_order = excluded.sort_order;

-- 5) Ensure existing project categories exist in category table.
insert into public.project_categories (slug, label, sort_order)
select distinct
  p.work_category as slug,
  initcap(replace(p.work_category, '-', ' ')) as label,
  100
from public.projects p
where p.work_category is not null
  and btrim(p.work_category) <> ''
on conflict (slug) do nothing;

-- 6) Refresh PostgREST schema cache.
notify pgrst, 'reload schema';
