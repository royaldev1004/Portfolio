-- ============================================================
-- Migration: hide/show project categories on frontend tabs
-- (Also included at end of project_categories_and_dynamic_constraints.sql)
-- ============================================================

alter table public.project_categories
  add column if not exists is_visible boolean not null default true;

update public.project_categories
set is_visible = true
where is_visible is null;

notify pgrst, 'reload schema';
