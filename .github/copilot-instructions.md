# Instrucciones de Copilot para Flexy Dev Portfolio

> 📋 Ver historial de cambios → [CHANGELOG.md](./CHANGELOG.md)

> **Nota sobre commits**: Todos los mensajes de commit deben escribirse en **español (Costa Rica)**.

## Descripción del Proyecto
Este es un **portfolio template en Next.js 16** construido con React 19, Tailwind CSS v4 y TypeScript. Está diseñado como un sitio personalizable de portafolio/currículum con **soporte i18n** (5 idiomas), integración con Firebase para formularios de contacto, carga dinámica de contenido, soporte de temas, secciones de servicios y soporte técnico, y un **panel de administración** con Supabase.

## Arquitectura y Patrones Clave

### Arquitectura de Datos: Supabase + Frontend Público
- **Proyectos, Testimonios, Skills, Secciones, Redes Sociales, Footer, Temas, Traducciones**: Todos almacenados en Supabase PostgreSQL
- **Server Components**: Usan `getSupabaseServer()` de `src/lib/supabase-server.ts` para queries directas (público)
- **Client Components**: Usan `supabase` (cliente lazy Proxy) o reciben datos como props desde server components
- **Datos en vivo**: Componentes como `ProjectSection`, `Skills` y `DynamicAccordion` obtienen datos directamente desde Supabase en el cliente (useEffect) para reflejar cambios del admin sin recargar la página
- **Skills Display Mode**: Se controla desde Admin → Settings. Dos modos: `marquee` (animación horizontal) y `grid` (grilla estática de chips). El valor se guarda en `site_config` con key `skills_display_mode`
- **Resolución de Íconos**: `iconMap` en `src/utils/iconMap.ts` convierte `icon_id` (string) a componentes SVG
- **Íconos personalizados**: Los SVGs custom se guardan en la tabla `icons` de Supabase y se renderizan inline con `dangerouslySetInnerHTML`
- **Tabla `icons`**: Contiene `id`, `label`, `category`, `svg_content`, `is_bundled` — 40 íconos bundlados precargados
- **Traducciones**: `LanguageContext` carga desde Supabase al cambiar idioma, con caché en `Map` para evitar re-fetch. Idioma por defecto: español (`es`)
- **Traducciones de items de sección**: Guardadas en `section_item_translations` (item_id, language, title, description). Solo se almacena español (ES); DynamicAccordion hace fallback automático a español si el idioma seleccionado no tiene traducción
- **Panel Admin**: `/admin/*` protegido con Supabase Auth, layout con sidebar y dashboard
- **Archivos JSON locales**: Ya no se usan en producción (se mantienen como referencia)

### Sistema i18n
- **5 idiomas**: Inglés, Español, Francés, Alemán, Ruso
- **Archivo de traducciones**: `src/i18n/translations.ts` — todas las claves de texto UI organizadas por idioma
- **Contexto**: `LanguageContext` (`src/context/LanguageContext.tsx`)
  - Provee `lang`, `setLang` y la función `t(key)`
  - Persiste la selección en `localStorage`
  - Actualiza `<html lang="...">` dinámicamente
- **Uso**: `const { t } = useLanguage()` en componentes client, luego `{t('key.name')}`
- **LanguageSwitcher**: Soporta dos variantes:
  - `variant="floating"` (default): botón flotante abajo a la derecha, posicionado arriba del ThemeMenu
  - `variant="inline"`: para integrar en el sidebar del admin panel
- **LanguageSwitcherWrapper**: Oculta el flotante en rutas `/admin` para evitar duplicados con el inline

### Estructura de Componentes
- **Organización por carpetas**: Cada sección tiene su propia carpeta (`Hero/`, `Projects/`, `Services/`, `ComputerSupport/`, etc.)
- **Composición de página**: `src/app/page.tsx` orquesta los componentes de sección (Hero → Skills → ProjectsAccordion → DynamicAccordion (services) → DynamicAccordion (support) → Contact)
- **Cliente vs Servidor**:
  - **Componentes servidor por defecto**; solo elementos interactivos usan `'use client'`
  - Los componentes que usan `useLanguage()` deben ser client components (ej: `Hero`, `ContactForm`, `ProjectSection`, `Footer`, `Navbar`, `ProjectsAccordion`, `DynamicAccordion`, `ThemeMenu`)
- **Contexto y Estado**: `SectionContext` para alternar visibilidad de servicios mediante `SectionToggle`

### Seguridad de Tipos
- Tipos centralizados en `src/lib/types.d.ts`: `Project`, `Testimonial`, `Heading`
- **Al extender datos**: Agregar tipos aquí primero, luego actualizar la estructura JSON

### Estrategia de Estilos
- **Tailwind v4 con variables CSS**: Usa `--primary`, `--secondary`, `--accent`, etc. definidas en `globals.css`
- **Soporte de temas**: `data-theme="dark"` en la etiqueta `<html>`, manejado por `ThemeMenu.tsx` (light/dark/aqua/retro)
- **Config**: `postcss.config.mjs` con `@tailwindcss/postcss`, `globals.css` para variables de tema
- **Fuente**: Fira Code cargada en `src/app/layout.tsx`
- **Responsive**: Enfoque mobile-first; probar en breakpoints `sm:`, `md:`, `lg:`

## Flujos de Trabajo Críticos

### Instalación y Desarrollo
```bash
npm install                    # Instalar dependencias
npm run dev                   # Iniciar servidor dev con Turbopack
npm run build && npm run start # Build producción y servidor
npm run lint                  # Verificar ESLint
```

### Agregar Nuevo Contenido (vía Admin Panel)
1. **Proyectos**: Usar `/admin/projects/new` — formulario con subida de imagen a Cloudinary
2. **Skills**: Usar `/admin/skills` → "+ New Skill" — selector visual de íconos con filtros por categoría
3. **Íconos personalizados**: Usar `/admin/icons` → "+ New Icon" — pegar markup SVG, asignar categoría
4. **Velocidad del carrusel**: `/admin/skills` → slider "Marquee Speed"
5. **Testimonios**: Usar `/admin/testimonials` (próximamente)
6. **Texto de Servicios/Soporte/Traducciones**: Usar `/admin/translations` (próximamente)
7. **Secciones Acordeón**: Usar `/admin/sections` → editar items con campos en español (fallback automático a otros idiomas)
8. **Editar título de sección** (ej: Projects): Ir a la página de listado, hacer hover sobre el título y click en el lápiz para editar inline

### Agregar Nuevo Contenido (directo en Supabase)
1. **Proyectos**: Insertar fila en tabla `projects` (Supabase Dashboard → Table Editor)
2. **Testimonios**: Insertar fila en tabla `testimonials`
3. **Skills**: Insertar fila en tabla `skills` — `icon_id` debe coincidir con un `id` en la tabla `icons`
4. **Traducciones**: Insertar fila en tabla `translations` — columnas: `key`, `language`, `value`
5. **Redes Sociales**: Insertar en `social_links`
6. **Íconos**: Usar `/admin/icons` para crear SVGs personalizados, o agregar SVG a `src/assets/icons/`, importar en `src/utils/icons.tsx`, agregar a `iconMap.ts`
7. **Items de acordeones**: Insertar en `section_items` + sus traducciones en `section_item_translations`

### Agregar un Nuevo Idioma
1. Agregar código de idioma al tipo `Language` en `src/i18n/translations.ts`
2. Agregar entrada al arreglo `languages`
3. Agregar todas las claves de traducción bajo el nuevo código de idioma
4. LanguageSwitcher detecta automáticamente los nuevos idiomas

### Configuración de Entorno
- **Requerido**: `.env.local` con `NEXT_PUBLIC_SITE_URL`
- **Firebase** (opcional): Configurar en `src/lib/firebase.ts` — el formulario de contacto guarda en Firestore si está configurado
- **SEO**: Editar metadatos en `src/app/layout.tsx` (título, descripción, Open Graph)

## Patrones Específicos del Proyecto

### Hooks Personalizados (src/hooks/)
- `useRoleSwitcher`: Cicla entre textos de rol a intervalos (animación del Hero)
- `useRotatingAnimation`: Controlador de animación basado en ref (rotación de elipse)
- `useHeadingsData`: Extracción de encabezados para TableOfContents
- `useOutsideClick`: Cerrar dropdowns/menús al hacer clic fuera

### Manejo de Íconos SVG
- **Dos tipos de íconos**:
  - **Bundlados**: Importados de `src/assets/icons/` como componentes React en `src/utils/icons.tsx`, mapeados en `iconMap.ts`
  - **Custom**: Almacenados en la tabla `icons` de Supabase con `svg_content` (markup SVG), renderizados inline con `dangerouslySetInnerHTML`
- **Resolución**: `IconRenderer` en `Skills.tsx` prueba `iconMap[iconId]` primero; si no existe, busca en el caché de íconos custom de la DB
- **Admin**: `/admin/icons` permite crear, editar, eliminar y filtrar íconos por categoría (tech, social, support, ui, stats, custom)
- **Evitar**: Usar `react-icons` junto con SVGs personalizados (inconsistencia)

### Server Actions
- **Formulario de contacto**: `src/actions/contact-form.ts` usa directiva `'use server'`
- **CRUD Proyectos**: `src/actions/projects.ts` — getProjects, getProject, createProject, updateProject, deleteProject
- **CRUD Skills**: `src/actions/skills.ts` — getSkills, getSkill, createSkill, updateSkill, deleteSkill
- **CRUD Íconos**: `src/actions/icons.ts` — getIcons, getIcon, createIcon, updateIcon, deleteIcon
- **Site Config**: `src/actions/site-config.ts` — getSiteConfig, updateSiteConfig
- **CRUD Secciones**: `src/actions/sections.ts` — getSections, getSection, createSection, updateSection, deleteSection, getSectionItems, createSectionItem, updateSectionItem, deleteSectionItem, getItemTranslations, upsertItemTranslation
- **CRUD Traducciones**: `src/actions/translations.ts` — upsertTranslation
- **Integración Firebase**: Usa `addDoc` a la colección `contactSubmissions` de Firestore
- **Validación**: Campos del formulario validados del lado del servidor antes de escribir en Firebase

### Imágenes Responsive
- **Componente Image de Next.js**: Usado en ServiceCard, ProjectCard
- **Patrones remotos**: Configurados en `next.config.ts` para Unsplash, ImageKit, Cloudinary, GitHub
- **Imágenes locales**: Importar desde `src/assets/images/` (ej: `HeroImage`)

### Alternancia de Secciones
- **Contexto**: `SectionContext` maneja el estado `showServices`
- **Toggle**: `SectionToggle` permite ocultar/mostrar secciones de servicios
- **Uso**: Envolver secciones en renderizado condicional basado en contexto

## Puntos de Integración Clave

### Cloudinary (Imágenes del Admin)
- **Cuenta**: Crear en cloudinary.com (plan free: 25 GB storage, 25 GB CDN/mes)
- **SDK**: `cloudinary` (server-side) para upload/delete
- **Server utility**: `src/lib/cloudinary.ts` — uploadImage, deleteImage, generateSignature
- **API route**: `POST /api/upload` — genera signature para signed uploads
- **Componente reutilizable**: `src/components/Admin/ImageUpload.tsx`
- **Variables**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Server Actions (Admin CRUD)
- **Ubicación**: `src/actions/projects.ts` con directiva `'use server'`
- **Lectura pública**: Usar `supabase` (cliente anon, RLS permite lectura pública)
- **Escritura admin**: Usar `getSupabaseAdmin()` de `src/lib/supabase-admin.ts` (service_role key, bypass RLS)
- **Métodos**: getProjects, getProject, createProject, updateProject, deleteProject

### DynamicAccordion
- **Propósito**: Componente único para todos los acordeones de contenido dinámico (services, support)
- **Data**: Obtiene section_id de la tabla `sections` por `identifier` (filtrado por `is_active`), luego items de `section_items` con traducciones de `section_item_translations`
- **Iconos**: Soporta tanto bundlados (`iconMap`) como custom SVG desde la tabla `icons`
- **Fallback de idioma**: Si el idioma seleccionado no tiene traducción, usa español (`es`) automáticamente
- **Projects**: Usa `ProjectsAccordion` separado (tabla `projects` con estructura diferente)
- **Admin**: Los items se editan en `/admin/sections/[id]` con selector de íconos filtrado por categoría, input de orden, campos de título/descripción en español

### Panel de Administración (Supabase)
- **Login**: `/admin/login` con Supabase Auth (email + password)
- **Layout**: `src/app/admin/layout.tsx` — verifica sesión con `getUser()` + `onAuthStateChange`
- **Dashboard**: `/admin/page.tsx` — estadísticas de contenido desde Supabase
- **Cliente Supabase**: `src/lib/supabase.ts` — instancia lazy via Proxy (solo se crea al primer uso)
- **Migraciones SQL**: `supabase/migrations/` — esquema de tablas + seeds
- **RLS Policies**: Lectura pública, escritura solo para admin autenticado (`auth.role() = 'authenticated'`)
- **Iconos**: Identificadores string en DB, resueltos via `src/utils/iconMap.ts` (bundlados) o desde tabla `icons` (custom SVG inline)
- **Gestión de íconos**: Admin page `/admin/icons` con CRUD completo, categorías y previsualización de SVGs
- **Idioma default**: Español (`es`). El admin panel usa `useLanguage()` y `t()` para traducir sidebar y textos; si no hay traducción en la DB, muestra el texto en inglés como fallback
- **Sidebar admin traducido**: Las claves de traducción son las palabras en inglés (ej: `'Dashboard'`, `'Projects'`). Para agregar traducciones, insertar en tabla `translations` con `key` = palabra en inglés y `language` = código del idioma

### Configuración de Entorno
- **Requerido** (producción): `.env.local` con `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Firebase** (opcional): Configurar en `src/lib/firebase.ts` — el formulario de contacto guarda en Firestore si está configurado
- **SEO**: Editar metadatos en `src/app/layout.tsx` (título, descripción, Open Graph)
- **Admin**: Crear usuario en Supabase Dashboard → Authentication → Users

### Metadatos y SEO
- Archivo: `src/app/layout.tsx`
- Configura Open Graph, Twitter cards, URLs canónicas
- Usa `process.env.NEXT_PUBLIC_SITE_URL` para URL base dinámica

### Tailwind y Sistema de Temas
- **Archivo**: `src/app/globals.css` (variables CSS para 4 temas)
- **Personalización**: Modificar `--primary`, `--secondary` en `globals.css` para colores de marca

### Elementos UI Flotantes
- **ThemeMenu**: Abajo a la derecha, posición fija (`fixed right-6 bottom-4`)
- **LanguageSwitcher**: Abajo a la derecha, posición fija (`fixed right-6 bottom-20`), arriba del ThemeMenu

## Tareas Comunes y Dónde Hacer Cambios

| Tarea | Ubicación |
|-------|-----------|
| Cambiar nombre/título del portafolio | `src/app/layout.tsx`, `src/components/Navbar/Logo.tsx` |
| Agregar proyecto (admin) | `/admin/projects/new` (formulario con upload a Cloudinary) |
| Agregar proyecto (directo) | `content/projects/projectN.json` |
| CRUD skills (admin) | `/admin/skills` — crear, editar, eliminar, reordenar |
| Agregar skill (admin) | `/admin/skills/new` — nombre + selector visual de íconos |
| Gestionar íconos (admin) | `/admin/icons` — agregar/editar/eliminar SVGs con categorías |
| Agregar ícono custom | `/admin/icons` → "+ New Icon" — pegar markup SVG |
| Modo de Skills (admin) | `/admin/settings` → Skills Display Mode (Marquee / Grid) |
| Velocidad del marquee (admin) | `/admin/settings` → Marquee Speed (solo visible en modo Marquee) |
| Editar items de acordeones (admin) | `/admin/sections` → elegir sección → editar items con íconos filtrados por categoría, orden y texto en español |
| Editar título de sección inline (admin) | `/admin/projects` o `/admin/sections/[id]` → hover sobre título → click lápiz → editar → botón guardar |
| Cambiar idioma por defecto | `src/context/LanguageContext.tsx` — cambiar `'es'` en `useState<Language>('es')` y en el fallback de localStorage |
| Agregar traducción al admin sidebar | Insertar en tabla `translations` con `key` = palabra en inglés, `language` = código, `value` = traducción |
| Actualizar redes sociales | `src/appData/personal.tsx` o tabla `social_links` en Supabase |
| Agregar nueva sección acordeón (admin) | `/admin/sections` → elegir sección → "Edit Items" |
| Agregar nueva sección (código) | Crear componente en `src/components/`, importar en `src/app/page.tsx` |
| Agregar/editar clave de traducción | `src/i18n/translations.ts` o tabla `translations` en Supabase |
| Agregar nuevo idioma | `src/i18n/translations.ts` (tipo, arreglo, objeto de traducción) |
| Actualizar correo de contacto | `.env.local` (config Firebase) o backend del formulario |
| Modificar esquema de colores | `src/app/globals.css` (variables CSS por tema) o tabla `themes` en Supabase |
| Acceder al admin | `/admin/login` — credenciales creadas en Supabase Auth |
| Agregar nuevo ícono SVG (bundlado) | Agregar SVG a `src/assets/icons/`, importar en `src/utils/icons.tsx`, agregar a `iconMap.ts` |
| Agregar nuevo ícono SVG (custom) | `/admin/icons` → "+ New Icon" — pegar markup SVG en el campo "SVG Markup" |

## TypeScript y Calidad de Código
- **Modo estricto activado**: Requerido agregar tipos para código nuevo
- **Alias de rutas**: `@/*` resuelve a `./src/*` (usar para imports)
- **Sin tipos externos requeridos**: Todos los tipos definidos localmente en `src/lib/types.d.ts`
