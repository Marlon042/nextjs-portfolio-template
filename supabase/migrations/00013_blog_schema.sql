-- ============================================
-- Blog CMS (Opción A + TipTap + es/en)
-- Ver docs/blog_plan.md §2 (ERD) y §2.2 (Slug Policy)
-- ============================================

-- 1. Categorías
create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]{2,60}$' and slug !~ '(^-|-$)'),
  name_es text not null,
  name_en text not null,
  display_order int not null default 0,
  created_at timestamptz default now()
);

-- 2. Autores (single-author pero extensible)
create table if not exists blog_authors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]{2,60}$' and slug !~ '(^-|-$)'),
  name text not null,
  avatar_url text,
  bio_es text,
  bio_en text,
  social_github text,
  social_linkedin text,
  social_twitter text,
  created_at timestamptz default now()
);

-- 3. Posts (core, 1 post = 1 slug compartido es/en — §2.2)
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]{3,80}$' and slug !~ '(^-|-$)' and slug !~ '--'),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  cover_url text,
  cover_alt text,
  category_id uuid references blog_categories(id) on delete set null,
  author_id uuid references blog_authors(id) on delete set null,
  tags text[] not null default '{}',
  display_order int not null default 0,
  is_featured boolean not null default false,
  views int not null default 0,
  reading_time int,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_blog_posts_status on blog_posts(status);
create index if not exists idx_blog_posts_slug on blog_posts(slug);
create index if not exists idx_blog_posts_category on blog_posts(category_id);
create index if not exists idx_blog_posts_author on blog_posts(author_id);
create index if not exists idx_blog_posts_published_at on blog_posts(published_at desc) where status = 'published';
create index if not exists idx_blog_posts_featured on blog_posts(is_featured) where status = 'published';
create index if not exists idx_blog_posts_tags on blog_posts using gin(tags);

-- 4. Traducciones es/en (patrón section_item_translations)
create table if not exists blog_post_translations (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references blog_posts(id) on delete cascade not null,
  language text not null check (language in ('es', 'en')),
  title text not null check (char_length(title) between 5 and 120),
  excerpt text not null check (char_length(excerpt) between 30 and 300),
  content_html text not null check (char_length(content_html) >= 50),
  content_json jsonb not null,
  meta_title text,
  meta_description text,
  unique(post_id, language)
);

create index if not exists idx_blog_translations_post_lang on blog_post_translations(post_id, language);

-- Trigger updated_at (solo blog_posts; translations son inmutables por edición completa)
create or replace function handle_blog_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_blog_posts_updated_at on blog_posts;
create trigger trg_blog_posts_updated_at before update on blog_posts
  for each row execute function handle_blog_updated_at();

-- ============================================
-- RLS (patrón 00005/00006: public read + admin write)
-- blog_posts: público solo ve published; admin (authenticated) ve todo
-- ============================================
alter table blog_categories enable row level security;
alter table blog_authors enable row level security;
alter table blog_posts enable row level security;
alter table blog_post_translations enable row level security;

-- blog_categories
create policy "bc_public_read" on blog_categories for select using (true);
create policy "bc_admin_insert" on blog_categories for insert with check (auth.role() = 'authenticated');
create policy "bc_admin_update" on blog_categories for update using (auth.role() = 'authenticated');
create policy "bc_admin_delete" on blog_categories for delete using (auth.role() = 'authenticated');

-- blog_authors
create policy "ba_public_read" on blog_authors for select using (true);
create policy "ba_admin_insert" on blog_authors for insert with check (auth.role() = 'authenticated');
create policy "ba_admin_update" on blog_authors for update using (auth.role() = 'authenticated');
create policy "ba_admin_delete" on blog_authors for delete using (auth.role() = 'authenticated');

-- blog_posts (lectura pública restringida a published)
create policy "bp_public_read" on blog_posts for select using (status = 'published' or auth.role() = 'authenticated');
create policy "bp_admin_insert" on blog_posts for insert with check (auth.role() = 'authenticated');
create policy "bp_admin_update" on blog_posts for update using (auth.role() = 'authenticated');
create policy "bp_admin_delete" on blog_posts for delete using (auth.role() = 'authenticated');

-- blog_post_translations (lectura pública; el join con blog_posts filtra published en queries)
create policy "bpt_public_read" on blog_post_translations for select using (true);
create policy "bpt_admin_insert" on blog_post_translations for insert with check (auth.role() = 'authenticated');
create policy "bpt_admin_update" on blog_post_translations for update using (auth.role() = 'authenticated');
create policy "bpt_admin_delete" on blog_post_translations for delete using (auth.role() = 'authenticated');

-- ============================================
-- Seeds
-- ============================================
insert into blog_categories (slug, name_es, name_en, display_order) values
  ('articulos', 'Artículos', 'Articles', 1),
  ('tutoriales', 'Tutoriales', 'Tutorials', 2),
  ('consejos', 'Consejos', 'Tips', 3)
on conflict (slug) do nothing;

insert into blog_authors (slug, name, bio_es, bio_en) values
  ('marlon-gutierrez', 'Marlon Gutiérrez V', 'Desarrollador Full-Stack en Costa Rica', 'Full-Stack Developer in Costa Rica')
on conflict (slug) do nothing;

-- Config blog (patrón site_config 00012)
insert into site_config (key, value) values ('blog_posts_per_page', '9') on conflict (key) do nothing;

-- ============================================
-- Realtime (requiere habilitar en Dashboard si falla en self-hosted;
-- ver CHANGELOG 2.0.1: Database → Publications → supabase_realtime)
-- ============================================
alter publication supabase_realtime add table blog_posts;
alter publication supabase_realtime add table blog_post_translations;
alter publication supabase_realtime add table blog_categories;
