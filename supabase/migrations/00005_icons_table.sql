-- Tabla de íconos: soporta íconos bundlados (desde código) y personalizados (SVG inline)
create table if not exists icons (
  id text primary key,
  label text not null,
  category text not null default 'custom',
  svg_content text,
  is_bundled boolean default false,
  created_at timestamptz default now()
);

-- RLS: público puede leer, solo admin autenticado puede escribir
alter table icons enable row level security;

create policy "icons_public_read" on icons for select using (true);
create policy "icons_admin_insert" on icons for insert with check (auth.role() = 'authenticated');
create policy "icons_admin_update" on icons for update using (auth.role() = 'authenticated');
create policy "icons_admin_delete" on icons for delete using (auth.role() = 'authenticated');

-- Insertar íconos existentes del código (bundlados) con sus categorías
insert into icons (id, label, category, svg_content, is_bundled) values
  -- Tecnologías
  ('javascript', 'JavaScript', 'tech', null, true),
  ('typescript', 'TypeScript', 'tech', null, true),
  ('react', 'React', 'tech', null, true),
  ('nextjs', 'Next.js', 'tech', null, true),
  ('nodejs', 'Node.js', 'tech', null, true),
  ('tailwindcss', 'Tailwind CSS', 'tech', null, true),
  ('flutter', 'Flutter', 'tech', null, true),
  ('firebase', 'Firebase', 'tech', null, true),
  -- Redes sociales
  ('github', 'GitHub', 'social', null, true),
  ('linkedin', 'LinkedIn', 'social', null, true),
  ('codepen', 'CodePen', 'social', null, true),
  ('x', 'X (Twitter)', 'social', null, true),
  ('instagram', 'Instagram', 'social', null, true),
  ('facebook', 'Facebook', 'social', null, true),
  -- Soporte técnico
  ('hardware-diagnostics', 'Hardware Diagnostics', 'support', null, true),
  ('software-installation', 'Software Installation', 'support', null, true),
  ('system-optimization', 'System Optimization', 'support', null, true),
  ('malware-removal', 'Malware Removal', 'support', null, true),
  ('data-backup', 'Data Backup', 'support', null, true),
  ('technical-support', 'Technical Support', 'support', null, true),
  -- UI / Navegación
  ('preview', 'Preview', 'ui', null, true),
  ('arrow-left', 'Arrow Left', 'ui', null, true),
  ('arrow-right', 'Arrow Right', 'ui', null, true),
  ('chevron-right', 'Chevron Right', 'ui', null, true),
  ('check', 'Check', 'ui', null, true),
  ('burger', 'Menu', 'ui', null, true),
  ('close', 'Close', 'ui', null, true),
  ('star', 'Star', 'ui', null, true),
  ('email', 'Email', 'ui', null, true),
  ('phone', 'Phone', 'ui', null, true),
  ('home', 'Home', 'ui', null, true),
  ('projects', 'Projects', 'ui', null, true),
  ('services', 'Services', 'ui', null, true),
  ('blog', 'Blog', 'ui', null, true),
  ('contact', 'Contact', 'ui', null, true),
  ('globe', 'Globe', 'ui', null, true),
  -- Estadísticas
  ('earning', 'Earning', 'stats', null, true),
  ('likes', 'Likes', 'stats', null, true),
  ('star-filled', 'Star Filled', 'stats', null, true),
  ('timer', 'Timer', 'stats', null, true)
on conflict (id) do nothing;
