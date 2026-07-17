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

### Added
- Integración con Cloudinary para subida de imágenes
- `src/lib/cloudinary.ts` — utilidad server-side para Cloudinary SDK
- `src/lib/supabase-admin.ts` — cliente Supabase con service_role key para escritura
- `src/actions/projects.ts` — server actions CRUD para proyectos
- `src/components/Admin/ImageUpload.tsx` — componente de subida de imágenes a Cloudinary
- `src/components/Admin/ProjectForm.tsx` — formulario de crear/editar proyectos
- `src/app/api/upload/route.ts` — API route para generar signature de Cloudinary
- CRUD completo de proyectos en `/admin/projects` (lista, crear, editar, eliminar)

### Fixed
- Navegación del formulario de proyectos: usa `window.location.href` en vez de `router.push()` para evitar que el formulario se quede colgado

### Changed
- Migración del frontend público de archivos/fs a Supabase
- `src/services/index.ts` ahora consulta Supabase en vez de leer JSON con `fs`
- `src/appData/index.ts` ahora exporta funciones async desde servicios Supabase
- `src/components/Skills/Skills.tsx` usa `iconMap` en vez de `<Image src>`
- `src/components/Services/ServiceSection.tsx` + `ServiceCard.tsx` usan Supabase + `iconMap`
- `src/components/ComputerSupport/` usan Supabase + `iconMap`
- `src/components/Footer/Footer.tsx` obtiene links sociales y footer desde Supabase
- `src/components/Theme/ThemeMenu.tsx` obtiene temas desde Supabase
- `src/context/LanguageContext.tsx` obtiene traducciones desde Supabase con caché
- `src/i18n/translations.ts` reducido a solo tipos y constantes (datos movidos a Supabase)
- `src/app/page.tsx` usa `getSkills()` async en vez de `skillList` estático
- Import directo de server actions en `ProjectForm.tsx` en vez de `await import()` dinámico
- Actualizado `.gitignore` para incluir `.env.example` como excepción
- Instalada dependencia `@supabase/supabase-js`
- Instaladas dependencias `cloudinary` y `next-cloudinary`

### Added
- `src/lib/supabase-server.ts` — cliente Supabase para server components
- `src/services/site.ts` — servicios para skills, sections, social, footer, themes, config

### Fixed
- SVGs importados de archivos convertidos a componentes React con `SvgIcon` wrapper
- IconMap ahora retorna solo componentes React (no strings URL)
- Mapping snake_case → camelCase en `getAllProjects()` de Supabase
- Key duplicada en `ProjectSection` (usa `id` en vez de `priority`)
- `ProjectCard` maneja `cover_url` vacía sin romper
- `IconText` en ProjectCard ahora renderiza componentes SVG
