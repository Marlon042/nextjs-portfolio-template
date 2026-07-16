# Changelog

## [1.1.0] — 2026-07-16

### Added
- Panel de administración en `/admin` con login via Supabase Auth
- Dashboard con estadísticas de contenido (proyectos, skills, secciones, testimonios)
- Layout protegido con sidebar de navegación para el admin
- Secciones placeholder: Projects, Sections, Skills, Testimonials, Translations, Settings
- Migración SQL inicial con tablas y seeds para Supabase PostgreSQL
- RLS policies para lectura pública y escritura solo para admin autenticado
- `src/lib/supabase.ts` con cliente lazy para Supabase (Proxy)
- `src/utils/iconMap.ts` — mapa de identificadores a componentes SVG
- `supabase/migrations/00001_initial_schema.sql` — esquema completo + datos iniciales
- `PLAN.md` con la estrategia del admin panel usando Supabase, Cloudinary y Firebase
- `.env.example` con todas las variables de entorno del proyecto

### Changed
- Actualizado `.gitignore` para incluir `.env.example` como excepción
- Instalada dependencia `@supabase/supabase-js`
