-- ============================================================
-- Migration: add screenshot_urls to projects
-- Run once in Supabase SQL Editor
-- ============================================================
alter table projects add column if not exists screenshot_urls jsonb default '[]';
