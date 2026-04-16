-- ============================================================
-- Migration: Add challenge + solution fields to projects
-- Run in Supabase SQL Editor
-- ============================================================

alter table public.projects
  add column if not exists challenge text default '';

alter table public.projects
  add column if not exists solution text default '';

-- Refresh PostgREST schema cache so API sees new columns immediately.
notify pgrst, 'reload schema';
