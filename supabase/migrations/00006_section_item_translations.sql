-- Almacenar títulos y descripciones de items por idioma (reemplaza services.N.title, support.N.desc, etc.)
create table if not exists section_item_translations (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references section_items(id) on delete cascade,
  language text not null,
  title text not null,
  description text not null default '',
  unique(item_id, language)
);

alter table section_item_translations enable row level security;

create policy "sit_public_read" on section_item_translations for select using (true);
create policy "sit_admin_insert" on section_item_translations for insert with check (auth.role() = 'authenticated');
create policy "sit_admin_update" on section_item_translations for update using (auth.role() = 'authenticated');
create policy "sit_admin_delete" on section_item_translations for delete using (auth.role() = 'authenticated');

-- Migrar datos existentes desde la tabla translations (services.N.title, services.N.desc, etc.)
-- Mapea display_order → índice 0-based (display_order - 1)
insert into section_item_translations (item_id, language, title, description)
select
  si.id,
  langs.language,
  t_title.value as title,
  t_desc.value as description
from sections s
join section_items si on si.section_id = s.id
cross join (values ('en'), ('es'), ('fr'), ('de'), ('ru')) as langs(language)
join translations t_title on t_title.key = s.identifier || '.' || (si.display_order - 1) || '.title' and t_title.language = langs.language
join translations t_desc on t_desc.key = s.identifier || '.' || (si.display_order - 1) || '.desc' and t_desc.language = langs.language
where s.identifier in ('services', 'support')
on conflict (item_id, language) do nothing;
