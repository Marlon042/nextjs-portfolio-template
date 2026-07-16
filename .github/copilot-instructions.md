# Instrucciones de Copilot para Flexy Dev Portfolio

> 📋 Ver historial de cambios → [CHANGELOG.md](./CHANGELOG.md)

> **Nota sobre commits**: Todos los mensajes de commit deben escribirse en **español (Costa Rica)**.

## Descripción del Proyecto
Este es un **portfolio template en Next.js 16** construido con React 19, Tailwind CSS v4 y TypeScript. Está diseñado como un sitio personalizable de portafolio/currículum con **soporte i18n** (5 idiomas), integración con Firebase para formularios de contacto, carga dinámica de contenido, soporte de temas, secciones de servicios y soporte técnico, y un **panel de administración** con Supabase.

## Arquitectura y Patrones Clave

### Arquitectura de Datos: Archivos + i18n + Supabase (en transición)
- **Proyectos y Testimonios**: Actualmente en archivos JSON en `/content/{projects,testimonials}/`; migrando a Supabase PostgreSQL
- **Servicios y Soporte Técnico**: Íconos en `src/appData/index.ts`; **texto traducido via i18n** (`translations.ts`); migrando a Supabase (tablas `sections` + `section_items`)
- **Datos Personales (Redes Sociales)**: Definidos en `src/appData/personal.tsx`; migrando a Supabase (tabla `social_links`)
- **Flujo de Datos Actual**: `src/services/index.ts` con `fs` para leer archivos JSON
- **Flujo de Datos Futuro**: Queries a Supabase via `src/lib/supabase.ts` (cliente lazy con Proxy)
- **Panel Admin**: `/admin/*` protegido con Supabase Auth, layout con sidebar y dashboard
- **Por qué la migración**: Centralizar datos en PostgreSQL permite CRUD desde el admin panel sin tocar código

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

### Agregar Nuevo Contenido
1. **Proyectos**: Agregar JSON a `content/projects/` que coincida con la interfaz `Project`
2. **Testimonios**: Agregar JSON a `content/testimonials/` con interfaz `Testimonial` (actualmente comentado en `page.tsx`)
3. **Skills**: Editar `src/appData/index.ts` directamente (arreglo hardcodeado con nombre + ícono)
4. **Texto de Servicios/Soporte**: Agregar/editar claves en `src/i18n/translations.ts` (formato: `services.N.title`, `services.N.desc`, `support.N.title`, `support.N.desc`)
5. **Íconos de Servicios/Soporte**: Editar arreglos `serviceData`/`computerSupportData` en `src/appData/index.ts`
6. **Redes Sociales**: Editar `src/appData/personal.tsx`
7. **Íconos**: Agregar imports SVG a `src/utils/icons.tsx`, exportar como componentes

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
| Agregar proyecto (admin) | `/admin/projects` (futuro CRUD) |
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
