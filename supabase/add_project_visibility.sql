-- ============================================================
-- Migration: Add hide/show support for projects
-- Run in Supabase SQL Editor
-- ============================================================

alter table public.projects
  add column if not exists is_visible boolean not null default true;

-- Ensure existing rows are visible by default.
update public.projects
set is_visible = true
where is_visible is null;

-- Refresh PostgREST schema cache so API sees new column immediately.
notify pgrst, 'reload schema';
