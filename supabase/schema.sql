-- ============================================================
-- Portfolio — Full Schema + Seed Data
-- Run this ONCE in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. TABLE CREATION ────────────────────────────────────────

create table if not exists work_experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  period text not null,
  employment_type text default 'Full-time',
  description text default '',
  highlights jsonb default '[]',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  period text not null,
  description text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  role text not null default '',
  description text default '',
  image_url text default '',
  external_url text default '',
  project_tier text not null default 'noteworthy',
  tech_tags jsonb default '[]',
  tall boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table projects add column if not exists external_url text default '';
alter table projects add column if not exists project_tier text not null default 'noteworthy';
alter table projects add column if not exists tech_tags jsonb default '[]';

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  avatar text default '',
  rating int default 5,
  text text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  year text default '',
  cert_id text default '',
  category text default '',
  color_key text default 'blue',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists skill_groups (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  caption text default '',
  icon_name text default 'Globe',
  color_key text default 'blue',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references skill_groups(id) on delete cascade,
  skill_name text not null,
  sort_order int default 0
);

create table if not exists process_steps (
  id uuid primary key default gen_random_uuid(),
  number_label text not null default '01',
  title text not null,
  subtitle text default '',
  description text default '',
  details jsonb default '[]',
  icon_name text default 'Compass',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists about_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  sort_order int default 0
);

create table if not exists site_settings (
  key text primary key,
  value text
);

-- ── 2. ROW LEVEL SECURITY ─────────────────────────────────────

alter table work_experience  enable row level security;
alter table education        enable row level security;
alter table projects         enable row level security;
alter table testimonials     enable row level security;
alter table certifications   enable row level security;
alter table skill_groups     enable row level security;
alter table skills           enable row level security;
alter table process_steps    enable row level security;
alter table about_stats      enable row level security;
alter table site_settings    enable row level security;

-- Public SELECT (portfolio visitors can read everything)
create policy "public read work_experience"  on work_experience  for select using (true);
create policy "public read education"        on education        for select using (true);
create policy "public read projects"         on projects         for select using (true);
create policy "public read testimonials"     on testimonials     for select using (true);
create policy "public read certifications"   on certifications   for select using (true);
create policy "public read skill_groups"     on skill_groups     for select using (true);
create policy "public read skills"           on skills           for select using (true);
create policy "public read process_steps"    on process_steps    for select using (true);
create policy "public read about_stats"      on about_stats      for select using (true);
create policy "public read site_settings"    on site_settings    for select using (true);

-- Authenticated full access (admin panel)
create policy "auth write work_experience"  on work_experience  for all using (auth.role() = 'authenticated');
create policy "auth write education"        on education        for all using (auth.role() = 'authenticated');
create policy "auth write projects"         on projects         for all using (auth.role() = 'authenticated');
create policy "auth write testimonials"     on testimonials     for all using (auth.role() = 'authenticated');
create policy "auth write certifications"   on certifications   for all using (auth.role() = 'authenticated');
create policy "auth write skill_groups"     on skill_groups     for all using (auth.role() = 'authenticated');
create policy "auth write skills"           on skills           for all using (auth.role() = 'authenticated');
create policy "auth write process_steps"    on process_steps    for all using (auth.role() = 'authenticated');
create policy "auth write about_stats"      on about_stats      for all using (auth.role() = 'authenticated');
create policy "auth write site_settings"    on site_settings    for all using (auth.role() = 'authenticated');

-- ── 3. SEED DATA ──────────────────────────────────────────────
-- (Safe to run once — will not duplicate if run again because
--  site_settings uses ON CONFLICT, and the others use plain INSERT
--  so only run the seed section once.)

-- ── Profile & Site Settings ───────────────────────────────────
-- Profile/hero defaults: keep aligned with src/lib/site-settings-defaults.js (PROFILE_SITE_SETTINGS_DEFAULTS).
-- About card defaults: keep aligned with src/data/about-site-settings-fallback.js (ABOUT_SITE_SETTINGS_FALLBACK).
insert into site_settings (key, value) values
  ('profile_name',           'Nguyen Hiep'),
  ('profile_location',       'Vietnam'),
  ('profile_email',          'fullmaster240@gmail.com'),
  ('profile_role_title',     'Senior AI & Automation Engineer'),
  ('hero_role_titles',       'Senior AI & Automation Engineer
No-Code/Low-Code & CMS Developer
AI Voice Agent Developer
Full Stack Developer'),
  ('profile_avatar_url',     '/nguyen-hiep.png'),
  ('profile_work_image_url', '/Work.png'),
  ('hero_tagline_pre',       'I build'),
  ('hero_tagline_highlight', 'AI & automation'),
  ('hero_tagline_post',      'that ships'),
  ('about_bio_1', 'I''m a Senior Software Engineer with 8+ years of experience in AI development, intelligent automation, and No-Code/Low-Code platforms. I bridge the gap between complex technical systems and rapid, practical delivery.'),
  ('about_bio_2', 'My core focus is building AI-powered solutions — from voice agents and CRM automations to full-stack web and mobile applications. I work with platforms like Lovable, Webflow, Base44, and Famous.ai to ship production-ready products at speed, without sacrificing quality.'),
  ('about_bio_3', 'On the automation side, I architect end-to-end workflows using n8n and Make.com, integrate CRM ecosystems with GoHighLevel (GHL), and build intelligent AI Voice Agents with Retell, Vapi, and ElevenLabs. Every system I build is designed to operate autonomously, scale effortlessly, and deliver measurable impact.'),
  ('about_available',        'true'),
  ('about_available_text',   'I''m taking new work'),
  ('about_available_sub',    'Freelance & consulting'),
  ('about_intro', 'Hello! My name is {name}, and I am passionate about creating impactful, innovative digital experiences that live on the internet.'),
  ('about_section_number',   '01.'),
  ('about_section_title',    'About Me'),
  ('about_recent_work_label', 'Recent Work'),
  ('about_recent_work_project_ids', '[]')
on conflict (key) do nothing;

-- ── About Stats ────────────────────────────────────────────────
insert into about_stats (value, label, sort_order) values
  ('8+',  'Years Experience',      0),
  ('50+', 'Projects Delivered',    1),
  ('30+', 'Clients Worldwide',     2),
  ('4',   'Core Specializations',  3);

-- ── Projects (images: each employer’s OG / marketing asset; external_url = company site) ──
-- Dev fallback: src/data/portfolio-projects-fallback.js (FALLBACK_PROJECTS) mirrors this seed.
insert into projects (title, category, role, description, image_url, external_url, project_tier, tech_tags, tall, sort_order) values
  ('Ambience Healthcare', 'Previous role', 'Engineering', 'AI-powered clinical documentation and workflow tools that help clinicians spend less time on the keyboard and more time with patients.', 'https://framerusercontent.com/images/l2jbzG0Wzk7GJYt31m2QzU82JzQ.png', 'https://www.ambiencehealthcare.com/', 'notable', '["Ambient AI","Clinical Documentation","EHR"]', false, 0),
  ('Commure',             'Previous role', 'Engineering', 'Healthcare operations and developer infrastructure — connecting systems so care teams can move faster with safer, more interoperable data.', 'https://cdn.prod.website-files.com/66b319e3933cb4cb9c43ebdc/66cb9c13447baaa8b66e7511_Commure%20-%20Open%20Graph%20Image.jpg', 'https://www.commure.com/', 'notable', '["RCM","Ambient AI","Healthcare Ops"]', true, 1),
  ('Incuto',              'Previous role', 'Engineering', 'Platform work for community-focused financial services — improving access to fair banking and lending through modern software.', 'https://static1.squarespace.com/static/5c8ad859e8ba4434f9bf43f6/t/5db2fabdca41e03baabf6c71/1572010686772/Incutopurple600.png?format=1500w', 'https://www.incuto.com/', 'notable', '["Fintech","Community Lending","Payments"]', true, 2),
  ('Unit21',              'Previous role', 'Engineering', 'Risk and fraud operations tooling — helping teams detect suspicious activity, investigate cases, and stay ahead of financial crime.', 'https://cdn.prod.website-files.com/61e589aa65b0300f0d3e0b70/69adef97057fd6b3d4515fb9_social-opengraph-general.png', 'https://www.unit21.ai/', 'noteworthy', '["Fraud","AML","Risk Infrastructure"]', false, 3),
  ('Babyscripts',         'Previous role', 'Engineering', 'Remote pregnancy care — connecting patients and providers with monitoring and education to improve maternal health outcomes.', 'https://babyscripts.com/hubfs/bloodpressure_heroimage.png', 'https://www.babyscripts.com/', 'noteworthy', '["Digital Health","Remote Monitoring","Maternal Care"]', true, 4),
  ('Panorama Education',  'Previous role', 'Engineering', 'K–12 analytics and surveys — giving schools actionable insight into student success, well-being, and engagement.', 'https://www.panoramaed.com/hubfs/panorama-education-district-view.png', 'https://www.panoramaed.com/', 'noteworthy', '["EdTech","MTSS","Student Analytics"]', false, 5);

-- ── Testimonials ───────────────────────────────────────────────
insert into testimonials (name, role, avatar, rating, text, sort_order) values
  ('Sarah Mitchell',  'CEO, NovaTech Solutions',        'SM', 5, 'Working together was a game-changer for our business. They built a fully automated AI voice agent that handles 80% of our inbound calls with no human intervention. Technical depth and speed were both outstanding.', 0),
  ('James Okonkwo',   'Founder, ScaleFlow Agency',      'JO', 5, 'They set up our entire GoHighLevel CRM with n8n automation in under two weeks. What used to take our team hours now runs on autopilot. One of the best engineers I''ve worked with.',                                  1),
  ('Priya Sharma',    'Product Lead, Elevate AI',        'PS', 5, 'We needed a complex RAG-based AI assistant in our SaaS product. They delivered a clean, scalable LangChain + vector DB solution — on time and beyond spec. I''d recommend them for any AI build.',                   2),
  ('Lucas Fernandez', 'Director, Meridian Digital',      'LF', 5, 'Their No-Code work with Webflow and Base44 saved us months. They built our marketing site and client portal fast, with automation flows that just work.',                                                              3),
  ('Emily Chen',      'CTO, VoiceFirst Labs',            'EC', 5, 'We hired them to build a Vapi + ElevenLabs voice pipeline. The result is a human-like, low-latency agent our users love. Rare depth across the full AI stack.',                                                       4),
  ('Daniel Osei',     'Operations Manager, FlowBridge', 'DO', 5, 'The Make.com workflows they architected cut our e-commerce ops overhead by 60%. They think in systems and deliver with precision — we''ll work together again.',                                                       5);

-- ── Certifications ─────────────────────────────────────────────
insert into certifications (title, issuer, year, cert_id, category, color_key, sort_order) values
  ('AWS Certified Developer – Associate',    'Amazon Web Services', '2023', 'AWS-DEV-2023', 'Cloud',              'amber',   0),
  ('Professional Machine Learning Engineer', 'Google Cloud',        '2022', 'GCP-MLE-2022', 'AI / ML',            'blue',    1),
  ('OpenAI API & Prompt Engineering',        'DeepLearning.AI',     '2023', 'DL-OAI-2023',  'AI Development',     'violet',  2),
  ('n8n Certified Automation Expert',        'n8n GmbH',            '2022', 'N8N-AUT-2022', 'Automation',         'emerald', 3),
  ('GoHighLevel Certified Partner',          'HighLevel Inc.',      '2022', 'GHL-CERT-2022','CRM',                'sky',     4),
  ('React & React Native – Advanced',        'Meta (via Coursera)', '2021', 'META-RN-2021', 'Frontend / Mobile',  'cyan',    5),
  ('LangChain & Vector Databases',           'DeepLearning.AI',     '2023', 'DL-LC-2023',   'AI Development',     'violet',  6),
  ('Make.com (Integromat) Expert',           'Make Academy',        '2021', 'MAKE-EXP-2021','Automation',         'emerald', 7);

-- ── Process Steps ──────────────────────────────────────────────
insert into process_steps (number_label, title, subtitle, description, details, icon_name, sort_order) values
  ('01', 'Understand', 'How I start',       'I start by clarifying the problem, constraints, and who it''s for. I ask questions, map your stack, and agree on what "done" looks like before I build anything.', '["Discovery & scope","Stack & integrations","Success criteria"]',  'Compass',    0),
  ('02', 'Build',      'How I ship',        'I implement in tight loops: working software first, then polish. Whether it''s AI, automation, or a UI, I keep you in the loop so we''re never guessing.',         '["Iterative delivery","No-Code / code where it fits","Handoff you can own"]', 'Layers', 1),
  ('03', 'Improve',    'How I stick around','I care about what happens after launch. I monitor flows, fix edge cases, and tune automations so the system keeps delivering value — not just on day one.',          '["Monitoring & fixes","Metrics that matter","Ongoing optimization"]', 'TrendingUp', 2);

-- ── Work Experience ────────────────────────────────────────────
insert into work_experience (role, company, period, employment_type, description, highlights, sort_order) values
  ('Senior AI & Automation Engineer', 'Freelance / Independent Consultant', '2021 — Present', 'Full-time',
   'Designing and deploying end-to-end AI automation systems, voice agents, and No-Code/Low-Code applications for clients across North America, Europe, and Asia.',
   '["AI Voice Agent pipelines for 10+ clients","CRM automation reducing ops costs by 40–60%","50+ No-Code products shipped on time"]', 0),
  ('No-Code / Low-Code Engineer', 'Digital Agency (Remote)', '2019 — 2021', 'Full-time',
   'Led the No-Code development arm of a digital agency, building client-facing applications using Webflow, Bubble, and early AI integration tools.',
   '["Delivered 20+ Webflow & Bubble apps","Introduced AI chatbot features to client portals","Reduced average project delivery time by 35%"]', 1),
  ('Full-Stack Software Engineer', 'SaaS Startup', '2017 — 2019', 'Full-time',
   'Worked as a full-stack engineer building React-based frontends and Node.js/Python backends. Responsible for API architecture, database design, and mobile apps.',
   '["Built and maintained 3 production SaaS products","React Native app with 10K+ downloads","REST API architecture with 99.9% uptime"]', 2),
  ('Junior Software Developer', 'Tech Consultancy', '2015 — 2017', 'Full-time',
   'Started career building web applications and internal tools. Gained hands-on experience with JavaScript, Python, and database systems while contributing to client delivery projects.',
   '["Learned modern JS frameworks and Python backend","Contributed to 8 client projects","Promoted to mid-level in 14 months"]', 3);

-- ── Education ──────────────────────────────────────────────────
insert into education (degree, institution, period, description, sort_order) values
  ('Bachelor of Science — Computer Science', 'University of Technology',  '2011 — 2015', 'Focused on algorithms, software engineering principles, and distributed systems. Graduated with Honours.', 0),
  ('Advanced Diploma — Artificial Intelligence', 'Online Graduate Program', '2019 — 2020', 'Intensive study of machine learning, neural networks, NLP, and practical AI application development.',   1);

-- ── Skill Groups + Skills ──────────────────────────────────────
do $$
declare
  g_nocode     uuid;
  g_ai         uuid;
  g_voice      uuid;
  g_automation uuid;
  g_frontend   uuid;
  g_backend    uuid;
  g_mobile     uuid;
  g_devops     uuid;
begin
  insert into skill_groups (label, caption, icon_name, color_key, sort_order) values ('No-Code / Low-Code', 'Visual Dev Platforms',  'Globe',      'sky',     0) returning id into g_nocode;
  insert into skill_groups (label, caption, icon_name, color_key, sort_order) values ('AI Development',     'Models & Deployment',   'Bot',        'violet',  1) returning id into g_ai;
  insert into skill_groups (label, caption, icon_name, color_key, sort_order) values ('AI Voice Agents',    'Conversational AI',     'Cpu',        'emerald', 2) returning id into g_voice;
  insert into skill_groups (label, caption, icon_name, color_key, sort_order) values ('AI Automation',      'Workflow Engineering',  'Zap',        'amber',   3) returning id into g_automation;
  insert into skill_groups (label, caption, icon_name, color_key, sort_order) values ('Frontend',           'Web Interfaces',        'Code2',      'blue',    4) returning id into g_frontend;
  insert into skill_groups (label, caption, icon_name, color_key, sort_order) values ('Backend',            'Server & APIs',         'Database',   'rose',    5) returning id into g_backend;
  insert into skill_groups (label, caption, icon_name, color_key, sort_order) values ('Mobile',             'Cross-Platform Apps',   'Smartphone', 'teal',    6) returning id into g_mobile;
  insert into skill_groups (label, caption, icon_name, color_key, sort_order) values ('DevOps & Tools',     'Infrastructure',        'Settings',   'orange',  7) returning id into g_devops;

  insert into skills (group_id, skill_name, sort_order) values
    (g_nocode, 'Base44', 0),(g_nocode, 'Lovable', 1),(g_nocode, 'Webflow', 2),(g_nocode, 'Famous.ai', 3),(g_nocode, 'Bubble', 4),(g_nocode, 'Framer', 5),(g_nocode, 'Softr', 6);
  insert into skills (group_id, skill_name, sort_order) values
    (g_ai, 'OpenAI API', 0),(g_ai, 'LangChain', 1),(g_ai, 'RAG Systems', 2),(g_ai, 'Vector DBs', 3),(g_ai, 'Prompt Engineering', 4),(g_ai, 'Fine-Tuning', 5),(g_ai, 'Claude API', 6);
  insert into skills (group_id, skill_name, sort_order) values
    (g_voice, 'Retell AI', 0),(g_voice, 'Vapi', 1),(g_voice, 'ElevenLabs', 2),(g_voice, 'Deepgram', 3),(g_voice, 'Twilio', 4),(g_voice, 'Whisper', 5);
  insert into skills (group_id, skill_name, sort_order) values
    (g_automation, 'n8n', 0),(g_automation, 'Make.com', 1),(g_automation, 'Zapier', 2),(g_automation, 'GoHighLevel (GHL)', 3),(g_automation, 'CRM Integrations', 4),(g_automation, 'Webhook Architecture', 5),(g_automation, 'API Orchestration', 6);
  insert into skills (group_id, skill_name, sort_order) values
    (g_frontend, 'React', 0),(g_frontend, 'Next.js', 1),(g_frontend, 'TypeScript', 2),(g_frontend, 'Tailwind CSS', 3),(g_frontend, 'Framer Motion', 4),(g_frontend, 'Vite', 5),(g_frontend, 'HTML / CSS', 6);
  insert into skills (group_id, skill_name, sort_order) values
    (g_backend, 'Node.js', 0),(g_backend, 'Python', 1),(g_backend, 'REST APIs', 2),(g_backend, 'GraphQL', 3),(g_backend, 'Supabase', 4),(g_backend, 'Firebase', 5),(g_backend, 'PostgreSQL', 6);
  insert into skills (group_id, skill_name, sort_order) values
    (g_mobile, 'React Native', 0),(g_mobile, 'Expo', 1),(g_mobile, 'iOS & Android', 2),(g_mobile, 'Push Notifications', 3),(g_mobile, 'App Store Deployment', 4);
  insert into skills (group_id, skill_name, sort_order) values
    (g_devops, 'Vercel', 0),(g_devops, 'Railway', 1),(g_devops, 'Docker', 2),(g_devops, 'GitHub Actions', 3),(g_devops, 'CI/CD', 4),(g_devops, 'Cloudflare', 5),(g_devops, 'AWS (S3, Lambda)', 6);
end $$;

-- ── 4. STORAGE — Profile image uploads (run once in SQL Editor) ─
-- Dashboard alternative: Storage → New bucket → name "portfolio-media" → Public bucket

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set public = excluded.public;

drop policy if exists "portfolio_media_public_read" on storage.objects;
create policy "portfolio_media_public_read"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

drop policy if exists "portfolio_media_auth_insert" on storage.objects;
create policy "portfolio_media_auth_insert"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

drop policy if exists "portfolio_media_auth_update" on storage.objects;
create policy "portfolio_media_auth_update"
  on storage.objects for update
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

drop policy if exists "portfolio_media_auth_delete" on storage.objects;
create policy "portfolio_media_auth_delete"
  on storage.objects for delete
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');
