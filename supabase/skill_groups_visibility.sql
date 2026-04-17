-- ============================================================
-- Migration: hide/show skill groups on the public Skills section
-- (Matches skill_groups.is_visible in supabase/schema.sql for new installs.)
-- ============================================================

alter table public.skill_groups
  add column if not exists is_visible boolean not null default true;

update public.skill_groups
set is_visible = coalesce(is_visible, true);

notify pgrst, 'reload schema';
