-- ============================================
-- Migración inicial: Esquema del Admin Panel
-- ============================================

-- 1. PROYECTOS
create table projects (
  id uuid primary key default gen_random_uuid(),
  priority int not null default 0,
  title text not null,
  short_description text not null,
  cover_url text not null,
  live_preview_url text,
  github_link text,
  type text not null default 'Free 🔥',
  visitors text,
  earned text,
  github_stars text,
  ratings text,
  number_of_sales text,
  site_age text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. HABILIDADES
create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_id text not null,
  display_order int not null default 0
);

-- 3. SECCIONES DINÁMICAS (accordions/grids)
create table sections (
  id uuid primary key default gen_random_uuid(),
  identifier text unique not null,
  section_type text not null default 'accordion',
  display_order int not null default 0,
  is_active boolean default true
);

-- 4. ITEMS DE CADA SECCIÓN
create table section_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references sections(id) on delete cascade,
  icon_id text not null,
  display_order int not null default 0
);

-- 5. TRADUCCIONES MULTI-IDIOMA
create table translations (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  language text not null,
  value text not null,
  unique(key, language)
);

-- 6. TESTIMONIOS
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  feedback text not null,
  image_url text not null,
  stars int not null default 5,
  created_at timestamptz default now()
);

-- 7. REDES SOCIALES
create table social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  icon_id text not null,
  display_order int not null default 0
);

-- 8. FOOTER LINKS
create table footer_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  href text not null,
  display_order int not null default 0
);

-- 9. TEMAS DE COLOR
create table themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  colors jsonb not null,
  is_active boolean default true
);

-- 10. CONFIGURACIÓN GENERAL DEL SITIO
create table site_config (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null
);

-- 11. MENSAJES DE CONTACTO (futura migración desde Firebase)
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz default now()
);

-- ============================================
-- SEEDS: Datos iniciales
-- ============================================

-- Skills iniciales
insert into skills (name, icon_id, display_order) values
  ('JavaScript', 'javascript', 1),
  ('TypeScript', 'typescript', 2),
  ('React.js', 'react', 3),
  ('Next.js', 'nextjs', 4),
  ('Node.js', 'nodejs', 5),
  ('Flutter', 'flutter', 6),
  ('Firebase', 'firebase', 7);

-- Sección: Servicios
insert into sections (identifier, section_type, display_order, is_active) values
  ('services', 'accordion', 1, true);

insert into section_items (section_id, icon_id, display_order)
select id, 'javascript', 1 from sections where identifier = 'services'
union all
select id, 'react', 2 from sections where identifier = 'services'
union all
select id, 'nodejs', 3 from sections where identifier = 'services'
union all
select id, 'nextjs', 4 from sections where identifier = 'services'
union all
select id, 'typescript', 5 from sections where identifier = 'services'
union all
select id, 'tailwindcss', 6 from sections where identifier = 'services';

-- Sección: Soporte Técnico
insert into sections (identifier, section_type, display_order, is_active) values
  ('support', 'accordion', 2, true);

insert into section_items (section_id, icon_id, display_order)
select id, 'hardware-diagnostics', 1 from sections where identifier = 'support'
union all
select id, 'software-installation', 2 from sections where identifier = 'support'
union all
select id, 'system-optimization', 3 from sections where identifier = 'support'
union all
select id, 'malware-removal', 4 from sections where identifier = 'support'
union all
select id, 'data-backup', 5 from sections where identifier = 'support'
union all
select id, 'technical-support', 6 from sections where identifier = 'support';

-- Redes sociales
insert into social_links (platform, url, icon_id, display_order) values
  ('Github', 'https://github.com/Marlon042/', 'github', 1),
  ('LinkedIn', 'https://www.linkedin.com/in/marlon-gutierrez-v/', 'linkedin', 2),
  ('Codepen', '#', 'codepen', 3),
  ('X', '#', 'x', 4),
  ('Instagram', '#', 'instagram', 5),
  ('Facebook', '#', 'facebook', 6);

-- Footer links
insert into footer_links (title, href, display_order) values
  ('About', '#', 1),
  ('Projects', '#projects', 2),
  ('Testimonials', '#testimonials', 3),
  ('Services', '#services', 4),
  ('Contact', '#contact', 5);

-- Temas de color
insert into themes (name, colors) values
  ('Light', '["#fff", "#0d1a3b", "#dbe3f7", "#0d1a3b", "#5565e8"]'),
  ('Dark', '["#011627", "#607b96", "#0d1a3b", "#5565e8", "#18f2e5"]'),
  ('Aqua', '["#b2e4e8", "#004a55", "#00c1d4", "#004a55", "#ff6f61"]'),
  ('Retro', '["#fff3e0", "#6d4c41", "#ffcc80", "#5d4037", "#ffab40"]');

-- Site config
insert into site_config (key, value) values
  ('site_title', '"Marlon Gutiérrez V | Full-Stack Web Developer in Costa Rica"'),
  ('site_description', '"Skilled full-stack web developer in Costa Rica..."'),
  ('hero_greeting', '"Hi - I''m Marlon"'),
  ('hero_roles', '["FULLSTACK DEVELOPER", "ENGINEERING STUDENT", "SUPPORT TECHNICIAN"]'),
  ('hero_subtitle', '"Crafting innovative solutions to solve real-world problems"');

-- Traducciones iniciales (solo inglés como ejemplo, el resto se migran después)
insert into translations (key, language, value) values
  ('services.subtitle', 'en', 'I offer a wide range of services to ensure you have the best written code and stay ahead in the competition'),
  ('services.0.title', 'en', 'JavaScript Development'),
  ('services.0.desc', 'en', 'Creating dynamic and interactive web applications using JavaScript.'),
  ('services.1.title', 'en', 'React.js Development'),
  ('services.1.desc', 'en', 'Building modern and responsive user interfaces with React.js.'),
  ('services.2.title', 'en', 'Node.js Backend'),
  ('services.2.desc', 'en', 'Developing scalable server-side applications using Node.js.'),
  ('services.3.title', 'en', 'Next.js Development'),
  ('services.3.desc', 'en', 'Creating server-rendered React applications with Next.js.'),
  ('services.4.title', 'en', 'TypeScript Development'),
  ('services.4.desc', 'en', 'Ensuring robust and maintainable code with TypeScript.'),
  ('services.5.title', 'en', 'Tailwind CSS Styling'),
  ('services.5.desc', 'en', 'Designing beautiful and responsive interfaces with Tailwind CSS.'),
  ('support.subtitle', 'en', 'Click to expand/collapse the accordion content'),
  ('support.0.title', 'en', 'Hardware Diagnostics'),
  ('support.0.desc', 'en', 'Comprehensive hardware testing and diagnostics to identify issues.'),
  ('support.1.title', 'en', 'Software Installation'),
  ('support.1.desc', 'en', 'Professional software installation and configuration services.'),
  ('support.2.title', 'en', 'System Optimization'),
  ('support.2.desc', 'en', 'Optimize your computer performance for maximum efficiency.'),
  ('support.3.title', 'en', 'Malware Removal'),
  ('support.3.desc', 'en', 'Complete malware and virus detection and removal services.'),
  ('support.4.title', 'en', 'Data Backup'),
  ('support.4.desc', 'en', 'Secure data backup and recovery solutions for your files.'),
  ('support.5.title', 'en', 'Technical Support'),
  ('support.5.desc', 'en', 'Remote and on-site technical support for all your needs.');
