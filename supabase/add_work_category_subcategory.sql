-- ============================================================
-- Migration: Add work_category (fixed enum) + subcategory to projects
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Add work_category column with a CHECK constraint for the 4 allowed values
alter table projects
  add column if not exists work_category text
    check (work_category in ('low-code', 'ai-voice-agent', 'automation', 'ghl'))
    default null;

-- 2. Add subcategory column (free text, optional)
alter table projects
  add column if not exists subcategory text default '';
