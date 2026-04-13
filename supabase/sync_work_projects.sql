-- Run in Supabase → SQL Editor (service role / postgres) to align `projects` with the portfolio work section:
-- company links + OG/marketing images used in the app.
-- WARNING: deletes all existing rows in `projects` then inserts the six employer cards.

alter table projects add column if not exists external_url text default '';
alter table projects add column if not exists project_tier text not null default 'noteworthy';
alter table projects add column if not exists tech_tags jsonb default '[]';

delete from projects;

insert into projects (title, category, role, description, image_url, external_url, project_tier, tech_tags, tall, sort_order) values
  ('Ambience Healthcare', 'Previous role', 'Engineering', 'AI-powered clinical documentation and workflow tools that help clinicians spend less time on the keyboard and more time with patients.', 'https://framerusercontent.com/images/l2jbzG0Wzk7GJYt31m2QzU82JzQ.png', 'https://www.ambiencehealthcare.com/', 'notable', '["Ambient AI","Clinical Documentation","EHR"]', false, 0),
  ('Commure',             'Previous role', 'Engineering', 'Healthcare operations and developer infrastructure — connecting systems so care teams can move faster with safer, more interoperable data.', 'https://cdn.prod.website-files.com/66b319e3933cb4cb9c43ebdc/66cb9c13447baaa8b66e7511_Commure%20-%20Open%20Graph%20Image.jpg', 'https://www.commure.com/', 'notable', '["RCM","Ambient AI","Healthcare Ops"]', true, 1),
  ('Incuto',              'Previous role', 'Engineering', 'Platform work for community-focused financial services — improving access to fair banking and lending through modern software.', 'https://static1.squarespace.com/static/5c8ad859e8ba4434f9bf43f6/t/5db2fabdca41e03baabf6c71/1572010686772/Incutopurple600.png?format=1500w', 'https://www.incuto.com/', 'notable', '["Fintech","Community Lending","Payments"]', true, 2),
  ('Unit21',              'Previous role', 'Engineering', 'Risk and fraud operations tooling — helping teams detect suspicious activity, investigate cases, and stay ahead of financial crime.', 'https://cdn.prod.website-files.com/61e589aa65b0300f0d3e0b70/69adef97057fd6b3d4515fb9_social-opengraph-general.png', 'https://www.unit21.ai/', 'noteworthy', '["Fraud","AML","Risk Infrastructure"]', false, 3),
  ('Babyscripts',         'Previous role', 'Engineering', 'Remote pregnancy care — connecting patients and providers with monitoring and education to improve maternal health outcomes.', 'https://babyscripts.com/hubfs/bloodpressure_heroimage.png', 'https://www.babyscripts.com/', 'noteworthy', '["Digital Health","Remote Monitoring","Maternal Care"]', true, 4),
  ('Panorama Education',  'Previous role', 'Engineering', 'K–12 analytics and surveys — giving schools actionable insight into student success, well-being, and engagement.', 'https://www.panoramaed.com/hubfs/panorama-education-district-view.png', 'https://www.panoramaed.com/', 'noteworthy', '["EdTech","MTSS","Student Analytics"]', false, 5);
