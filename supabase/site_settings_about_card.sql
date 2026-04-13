-- One-time: add About card copy keys to an existing database (safe to re-run).
-- Run in Supabase → SQL Editor after the main schema.

insert into site_settings (key, value) values
  ('about_intro', 'Hello! My name is {name}, and I am passionate about creating impactful, innovative digital experiences that live on the internet.'),
  ('about_section_number', '01.'),
  ('about_section_title', 'About Me'),
  ('about_recent_work_label', 'Recent Work'),
  ('about_recent_work_project_ids', '[]')
on conflict (key) do nothing;
