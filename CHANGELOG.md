# Changelog

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
