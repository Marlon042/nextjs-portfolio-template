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
- **Resolución de Íconos**: `iconMap` en `src/utils/iconMap.ts` convierte `icon_id` (string) a componentes SVG
- **Traducciones**: `LanguageContext` carga desde Supabase al cambiar idioma, con caché en `Map` para evitar re-fetch
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
- **LanguageSwitcher**: Botón flotante abajo a la derecha (`src/components/LanguageSwitcher/`), posicionado arriba del ThemeMenu

### Estructura de Componentes
- **Organización por carpetas**: Cada sección tiene su propia carpeta (`Hero/`, `Projects/`, `Services/`, `ComputerSupport/`, etc.)
- **Composición de página**: `src/app/page.tsx` orquesta los componentes de sección (Hero → Skills → Projects → ClientServiceSection → ClientComputerSupportSection → Contact)
- **Cliente vs Servidor**:
  - **Componentes servidor por defecto**; solo elementos interactivos usan `'use client'`
  - Los componentes que usan `useLanguage()` deben ser client components (ej: `Hero`, `ContactForm`, `ProjectSection`, `Footer`, `Navbar`, `ServicesAccordion`, `ComputerSupportAccordion`, `ServiceSection`, `ComputerSupportSection`, `ThemeMenu`)
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
2. **Testimonios**: Usar `/admin/testimonials` (próximamente)
3. **Skills**: Usar `/admin/skills` (próximamente)
4. **Texto de Servicios/Soporte/Traducciones**: Usar `/admin/translations` (próximamente)
5. **Secciones Acordeón**: Usar `/admin/sections` (próximamente)

### Agregar Nuevo Contenido (directo en Supabase)
1. **Proyectos**: Insertar fila en tabla `projects` (Supabase Dashboard → Table Editor)
2. **Testimonios**: Insertar fila en tabla `testimonials`
3. **Skills**: Insertar fila en tabla `skills` — `icon_id` debe coincidir con una clave en `iconMap.ts`
4. **Traducciones**: Insertar fila en tabla `translations` — columnas: `key`, `language`, `value`
5. **Secciones**: Insertar en `sections` + sus items en `section_items`
6. **Redes Sociales**: Insertar en `social_links`
7. **Íconos**: Agregar SVG a `src/assets/icons/`, importar en `src/utils/icons.tsx`, agregar al `iconMap.ts`

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
- **Patrón**: Importar SVG como componentes en `src/utils/icons.tsx`, luego pasar como props
- **Ejemplo**: `icon: JavaScriptIcon` en `serviceData`, renderizado via `<Image src={icon} />`
- **Evitar**: Usar `react-icons` junto con SVGs personalizados (inconsistencia)

### Server Actions
- **Formulario de contacto**: `src/actions/contact-form.ts` usa directiva `'use server'`
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

### Panel de Administración (Supabase)
- **Login**: `/admin/login` con Supabase Auth (email + password)
- **Layout**: `src/app/admin/layout.tsx` — verifica sesión con `getUser()` + `onAuthStateChange`
- **Dashboard**: `/admin/page.tsx` — estadísticas de contenido desde Supabase
- **Cliente Supabase**: `src/lib/supabase.ts` — instancia lazy via Proxy (solo se crea al primer uso)
- **Migraciones SQL**: `supabase/migrations/` — esquema de tablas + seeds
- **RLS Policies**: Lectura pública, escritura solo para admin autenticado (`auth.role() = 'authenticated'`)
- **Iconos**: Identificadores string en DB, resueltos via `src/utils/iconMap.ts`

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
| Actualizar skills (admin) | `/admin/skills` (futuro CRUD) |
| Actualizar skills (directo) | `src/appData/index.ts` (`skillList`) |
| Actualizar texto de servicios/soporte (admin) | `/admin/translations` (futuro editor) |
| Actualizar texto de servicios/soporte (directo) | `src/i18n/translations.ts` (claves `services.N.*`, `support.N.*`) |
| Actualizar íconos de servicios/soporte | `src/appData/index.ts` (`serviceData`/`computerSupportData`) + `src/utils/iconMap.ts` |
| Actualizar redes sociales | `src/appData/personal.tsx` o tabla `social_links` en Supabase |
| Agregar nueva sección acordeón (admin) | `/admin/sections` (futuro editor) |
| Agregar nueva sección (código) | Crear componente en `src/components/`, importar en `src/app/page.tsx` |
| Agregar/editar clave de traducción | `src/i18n/translations.ts` o tabla `translations` en Supabase |
| Agregar nuevo idioma | `src/i18n/translations.ts` (tipo, arreglo, objeto de traducción) |
| Actualizar correo de contacto | `.env.local` (config Firebase) o backend del formulario |
| Modificar esquema de colores | `src/app/globals.css` (variables CSS por tema) o tabla `themes` en Supabase |
| Acceder al admin | `/admin/login` — credenciales creadas en Supabase Auth |
| Agregar nuevo ícono SVG | Agregar SVG a `src/assets/icons/`, importar en `src/utils/icons.tsx`, agregar a `iconMap.ts` |

## TypeScript y Calidad de Código
- **Modo estricto activado**: Requerido agregar tipos para código nuevo
- **Alias de rutas**: `@/*` resuelve a `./src/*` (usar para imports)
- **Sin tipos externos requeridos**: Todos los tipos definidos localmente en `src/lib/types.d.ts`
