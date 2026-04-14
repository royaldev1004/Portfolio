-- Optional client feedback on project detail page (detail gallery column)
alter table projects add column if not exists feedback_text text default '';
alter table projects add column if not exists feedback_author text default '';

-- Seed/update per-project feedback (safe to run multiple times)
update projects set
  feedback_author = 'Maya Thornton, Product Lead',
  feedback_text = 'Their delivery quality was exceptional. They translated complex clinical workflows into an intuitive experience and consistently hit our milestones.'
where title = 'Ambience Healthcare';

update projects set
  feedback_author = 'Ethan Brooks, Engineering Manager',
  feedback_text = 'A strong technical partner from day one. They improved our platform performance and made cross-team integration noticeably smoother.'
where title = 'Commure';

update projects set
  feedback_author = 'Sofia Bennett, Head of Product',
  feedback_text = 'They understood both user needs and regulatory constraints. The final solution was reliable, scalable, and genuinely impactful for our members.'
where title = 'Incuto';

update projects set
  feedback_author = 'Noah Patel, Risk Ops Director',
  feedback_text = 'Fast iteration, thoughtful architecture, and excellent communication. The tools they built quickly became core to our daily operations.'
where title = 'Unit21';

update projects set
  feedback_author = 'Olivia Hayes, Clinical Program Owner',
  feedback_text = 'They delivered with empathy and precision. We saw immediate gains in usability and provider confidence after launch.'
where title = 'Babyscripts';

update projects set
  feedback_author = 'Liam Carter, VP of Data Strategy',
  feedback_text = 'A dependable collaborator who turned complex requirements into clean, practical product outcomes. Schools loved the clarity of the final workflows.'
where title = 'Panorama Education';
