# Changelog

## [Unreleased] — Blog CMS (Fases 1–4: DB + Backend + Admin + Frontend)

### Added
- **Blog CMS — base de datos** (`supabase/migrations/00013_blog_schema.sql`): tablas `blog_categories`, `blog_authors`, `blog_posts` (slug único compartido es/en, `status` draft/published/archived, tags `text[]` + GIN, `views`, `reading_time`, trigger `updated_at`) y `blog_post_translations` (es/en, `content_html` + `content_json` TipTap)
- **Blog CMS — backend** (`src/actions/blogs.ts`, `blog-categories.ts`, `blog-authors.ts`): CRUD + `togglePublish` + `incrementViews` + `findAvailableSlug` (Slug Policy §2.2 en `docs/blog_plan.md`)
- **Blog CMS — API pública** (`/api/blogs`, `/api/blogs/[slug]`, `/api/blogs/[slug]/views`): filtros lang/categoría/search/tag, paginación y contador de vistas
- Deps: `zod`, `sanitize-html` (+ `@types/sanitize-html`). Sanitizado server-only en `src/lib/blog-sanitize.ts`
- **Blog CMS — Admin** (`/admin/blogs`): tabla con filtros draft/published/archived/featured, toggle publish inline, drag&drop `display_order`, Realtime; `BlogForm` con tabs ES/EN, slug auto + verificación §2.2, cover vía Cloudinary, tags, categorías; editor **TipTap 2.x** (toolbar + highlight + align + imágenes Cloudinary) en `src/components/Admin/TipTapEditor.tsx` + estilos `.tiptap` en `globals.css`; sidebar link `Blog`
- Deps: `@tiptap/*` (react, pm, starter-kit, image, link, placeholder, character-count, text-align, highlight)
- **Blog CMS — Frontend** (`/blogs` + `/blogs/[slug]`): `BlogCard`/`BlogList` con filtros por categoría, búsqueda con debounce, "Ver más" y Realtime; artículo SSR con SEO (`generateMetadata`, canonical, OG), TOC auto, tracker de vistas, share X/LinkedIn, autor y relacionados; ISR 60s
- **Blog CMS — SEO/API**: `sitemap.xml` con posts, OG dinámica por slug, feed RSS (`/api/blogs/rss`)
- **Blog CMS — Asistente IA** (Fase 5A, sin commitear): endpoint admin-only `POST /api/blogs/ai-assist` (modos generar/traducir, Gemini Flash gratis, rate-limit 20s, errores ES) + modal ✨ en `BlogForm` con preview y volcado al form vía `generateJSON`

### Notes
- Pendiente Fase 5 (RSS ✔ hecho, resto backlog); crear posts desde `/admin/blogs`
- Requiere habilitar Realtime en Supabase para: `blog_posts`, `blog_post_translations`, `blog_categories`
- Ver plan completo (local, no versionado — `docs/` está en `.gitignore`): `docs/blog_plan.md`

## [2.0.1] — 2026-07-24

### Added
- **Supabase Realtime en frontend**: cambios del admin se reflejan al instante sin recargar
  - DynamicAccordion escucha `section_items` y `section_item_translations`
  - ProjectsAccordion escucha `projects` (datos + contador)
  - Skills escucha `skills` y `site_config` (modo, velocidad)
  - LanguageContext escucha `translations` (títulos de acordeones al instante)
- Skills refactorizado a fetching cliente (ya no recibe props del server)
- Skills ahora se conecta por su cuenta a Supabase y se actualiza solo

### Fixed
- Skills no cargaba ningún item porque usaba `order('priority')` pero la columna se llama `display_order` — la query fallaba en silencio y se veía vacío
- LanguageContext cacheaba traducciones para siempre; al editar un título desde el admin, el front nunca se enteraba

### Notes
- Requiere habilitar Realtime en Supabase para las tablas: `projects`, `skills`, `sections`, `section_items`, `section_item_translations`, `site_config`, `icons`, `translations`

## [2.0.0] — 2026-07-24

### Added
- **Drag & drop reordering**: en editor de secciones, skills y proyectos — olvídate de escribir números como un cavernícola
- **Galería de imágenes por proyecto**: subí múltiples imágenes a Cloudinary desde el formulario, se ven en un carrusel con auto-slide que tienes miedo de que acelere mucho
- **Auto-slide configurable**: velocidad del carrusel ajustable desde Admin Settings (1s–12s). Ponlo en 1s si quieres marear a tus usuarios
- **Animaciones de entrada**: ProjectCard aparece con fade-in + slide-up al hacer scroll. Stagger incluido para que no lleguen todos borrachos a la vez
- **Skeleton loading** con 9 estilos:
  - `pulse` — el clásico, aburrido pero funcional
  - `shimmer` — barrido de luz, como YouTube pero sin los ads
  - `wave` — ondulación secuencial, como olas en el mar... de la carga
  - `gradient` — gradiente sutil que respira. Zen
  - `cyber` — cuadrícula Tron + barra de escaneo. Tu skeleton usa más efectos que tu PC
  - `neon` — colores que cambian, partículas flotantes, borde rave. Fiesta en cada carga
  - `quantum` — estrellas titilantes, auroras boreales, vórtice warp, anillos expansivos. Tu skeleton tiene más capas que una cebolla
  - `terminal` — modo hacker: texto verde apareciendo línea por línea, scanlines CRT, cursor parpadeante. Matrix tiene envidia
  - `powershell` — igual que terminal pero azul, porque el azul es más profesional (?
- **Skeleton config en Admin Settings**: elegí estilo y delay artificial (0–5000ms). Pon 0 si eres impaciente
- **SectionSkeleton**: skeleton para DynamicAccordion (services/support) con todas las animaciones
- **Scroll arrows en descripción**: flechitas arriba/abajo solo cuando el texto se desborda. Como un ascensor pero para leer
- **Phone icon en navbar**: el contacto ahora tiene un teléfono, porque el sobre es muy 2010
- **Iconos intercambiados**: Services tiene el planeta, Blogs tiene la llave inglesa. Caos controlado

### Changed
- ProjectCard: lightbox movido fuera del div animado (el `fixed` no se llevaba bien con `translate-y-8`)
- ProjectCard: descripción vuelve a altura fija 100px con scroll (como Dios manda)
- Navbar: icono de contacto cambiado a PhoneIcon

### Fixed
- Lightbox se posicionaba mal por el `transform` del animated wrapper (fix: fragmento)
- Terminal skeleton no arrancaba en Projects accordion si no abrías Services primero (faltaban keyframes en ProjectSkeleton)

## [1.5.0] — 2026-07-22

### Added
- **Editor de secciones mejorado**: filtro de íconos por categoría, input de orden editable, cards con numeración
- **InlineEditableTitle en todas las secciones**: services, support y projects desde sus respectivos editores
- **Título traducido en lista de secciones**: `/admin/sections` ahora muestra el título usando `t()`
- **Botón de guardar** (diskette) en InlineEditableTitle
- **Skills Display Mode** en Admin → Settings: toggle entre Marquee (animated) y Grid (static)
- **Marquee Speed movido a Settings**: slider ya no está en Skills, ahora en Settings
- **Skills como grilla estática**: nuevo modo grid con chips de icono + nombre
- **MarqueeWrapper mejorado**: limpia animaciones previas, no anima si contenido no desborda, `pointer-events: none` para evitar interferencias con scroll
- `DynamicAccordion` ahora carga iconos custom desde DB y filtra por `is_active`
- `supabase/migrations/00008_contact_translations.sql` — traducciones de contacto en 5 idiomas
- `supabase/migrations/00009_skills_display_mode.sql` — seed de skills_display_mode en site_config

### Changed
- Admin Settings ahora funcional con controles de Skills Display Mode y Marquee Speed
- Admin Skills ya no muestra el control de velocidad del marquee
- `Skills.tsx` soporta ambos modos (marquee/grid) según `site_config`

### Fixed
- DynamicAccordion ignoraba `is_active` en secciones
- Iconos custom no se renderizaban en DynamicAccordion ni en editor de secciones
- Animación del marquee se acumulaba en cada resize
- Textos de contacto actualizados a 1ra persona sin tuteo en todos los idiomas

## [1.4.0] — 2026-07-22

### Added
- **Lightbox en proyectos**: hover con ojo + "Ver imagen" sobre cover, click abre modal con imagen en grande
- **Idioma por defecto español** en toda la app (LanguageContext usa `'es'`)
- **LanguageSwitcher en admin**: selector de idioma en el sidebar del admin con `variant="inline"`
- **LanguageSwitcherWrapper**: oculta el flotante en rutas `/admin` para evitar duplicados
- **Admin sidebar traducido**: usa `useLanguage()` y `t()` con fallback al inglés
- **InlineEditableTitle**: componente para editar títulos (como `projects.title`) directamente en el admin con hover → lápiz → click → inline edit → Enter guarda
- `src/actions/translations.ts` — server action upsertTranslation
- `src/components/ScrollProgressBar.tsx` — barra de progreso al scroll en el front principal
- `supabase/migrations/00007_admin_translations.sql` — traducciones al español para el admin panel

### Changed
- `LanguageSwitcher.tsx` ahora acepta `variant` prop (`'floating'` | `'inline'`) con estilos específicos para cada modo
- Acordeones reducen espaciado de `my-14` a `my-6`

## [1.3.0] — 2026-07-22

### Added
- **DynamicAccordion** unificado: reemplaza ServicesAccordion, ComputerSupportAccordion y ProjectsAccordion para servicios/soporte
- **CRUD completo de Secciones** en `/admin/sections` con listado, toggle activo/inactivo, y editor de items
- **`src/actions/sections.ts`** — server actions para sections, section_items, section_item_translations
- **Editor de items por sección** en `/admin/sections/[id]` con selector visual de íconos y campos en español
- `supabase/migrations/00006_section_item_translations.sql` — tabla section_item_translations + migración de datos existentes

### Changed
- Acordeones ahora inician **cerrados** por defecto (`defaultOpen = false`)
- Editor de secciones simplificado: solo campos en **español** (se eliminaron EN, FR, DE, RU)
- DynamicAccordion hace fallback a español si el idioma seleccionado no tiene traducción
- `page.tsx` ahora usa `ProjectsAccordion` para projects y `DynamicAccordion` para services/support

### Fixed
- DynamicAccordion requería 2 clicks para abrirse (cambiado `useRef` → `useState` para sectionId)
- Sección de projects aparecía vacía (usaba DynamicAccordion sin soporte para tabla projects)

## [1.2.0] — 2026-07-22

### Added
- **CRUD completo de Skills** en `/admin/skills` con formulario, lista, crear, editar y eliminar
- `src/actions/skills.ts` — server actions CRUD para skills
- `src/components/Admin/SkillForm.tsx` — formulario con selector visual de íconos
- **Control de velocidad del carrusel** en el admin de Skills (slider 5s–60s, guardado en `site_config`)
- `src/actions/site-config.ts` — server actions para leer/escribir configuración del sitio
- **Sistema de gestión de íconos** en `/admin/icons` con tabla `icons` en Supabase
- `src/actions/icons.ts` — server actions CRUD para íconos
- Grid de íconos con filtros por categoría (tech, social, support, ui, stats, custom)
- Formulario inline para crear/editar íconos personalizados con preview de SVG en vivo
- Soporte para SVGs personalizados: pegar markup SVG desde el admin
- El selector de íconos en SkillForm ahora carga desde la DB con filtros por categoría
- `IconRenderer` en Skills.tsx público: prueba `iconMap` primero, fallback a SVG inline desde DB
- Vista previa de íconos custom en la tabla de skills del admin
- Enlace "Icons" en el sidebar del admin
- `supabase/migrations/00005_icons_table.sql` — tabla icons con seed de 40 íconos + RLS

### Changed
- `ProjectSection.tsx` cambiado a fetching cliente con Supabase (refleja cambios del admin sin recargar)
- `MarqueeWrapper.tsx` acepta `duration` prop para control de velocidad
- Título de Skills cambiado a "Technical Knowledge" / "Conocimientos técnicos" en 5 idiomas
- `Skills.tsx` ahora obtiene `marquee_duration` de `site_config` y pasa a MarqueeWrapper
- `netlify.toml` actualizado para Next.js 16 (se eliminó `publish` y redirects SPA)
- Footer oculto en rutas `/admin` mediante `FooterWrapper.tsx`

### Fixed
- Error de build por `publish = ".next"` en netlify.toml
- Los cambios del admin ahora se reflejan en la página principal al recargar (client-side fetching)
