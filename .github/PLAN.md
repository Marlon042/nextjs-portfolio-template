# Plan: Panel de Administración con Supabase

## Stack Tecnológico (todo gratis)

| Servicio | Uso | Free Tier |
|---|---|---|
| **Supabase** | Base de datos (PostgreSQL) + Autenticación | 500 MB DB, 50K MAUs |
| **Cloudinary** | Imágenes (covers de proyectos, fotos de testimonios, CV) | 25 GB storage, 25 GB CDN/mes |
| **Firebase** | Solo formulario de contacto (Firestore) | Blaze — $0 real |
| **Netlify** | Hosting del sitio | 100 GB/mes |
| **SVGs (bundled)** | Íconos de skills, servicios, soporte, redes sociales | Van en el código, no necesitan CDN |

## Objetivo

Crear un panel de administración que permita gestionar todo el contenido del portafolio (proyectos, secciones tipo acordeón, habilidades, testimonios, traducciones, configuración) usando **Supabase** como backend.

---

## Arquitectura General

```
Admin UI (React) ──→ Supabase SDK ──→ PostgreSQL
                       ↓
Página Pública (Server Components) ──→ Supabase SDK ──→ Renderiza (ISR o SSR)
```

**Subida de imágenes**: El admin sube a Cloudinary, Cloudinary devuelve la URL, esa URL se guarda en la tabla de Supabase.

---

## 1. Esquema de Base de Datos (PostgreSQL en Supabase)

```sql
-- Proyectos
create table projects (
  id uuid primary key default gen_random_uuid(),
  priority int not null default 0,
  title text not null,
  short_description text not null,
  cover_url text not null,
  live_preview_url text,
  github_link text,
  type text not null default 'Free 🔥',
  visitors text,
  earned text,
  github_stars text,
  ratings text,
  number_of_sales text,
  site_age text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Habilidades
create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_id text not null,
  display_order int not null default 0
);

-- Secciones dinámicas (accordions/grids)
create table sections (
  id uuid primary key default gen_random_uuid(),
  identifier text unique not null,
  section_type text not null default 'accordion',
  display_order int not null default 0,
  is_active boolean default true
);

-- Items dentro de cada sección
create table section_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references sections(id) on delete cascade,
  icon_id text not null,
  display_order int not null default 0
);

-- Traducciones multi-idioma
create table translations (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  language text not null,
  value text not null,
  unique(key, language)
);

-- Testimonios
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  feedback text not null,
  image_url text not null,
  stars int not null default 5,
  created_at timestamptz default now()
);

-- Redes sociales
create table social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  icon_id text not null,
  display_order int not null default 0
);

-- Footer links
create table footer_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  href text not null,
  display_order int not null default 0
);

-- Temas de color
create table themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  colors jsonb not null,
  is_active boolean default true
);

-- Configuración general del sitio
create table site_config (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null
);
```

---

## 2. Reemplazo de Lecturas Actuales

| Actual (fs/JSON / hardcode) | Nuevo (Supabase) |
|---|---|
| `src/services/index.ts` → `fs.readFile` | `supabase.from('projects').select('*').order('priority')` |
| `src/appData/index.ts` → arrays hardcodeados | `supabase.from('skills').select('*').order('display_order')` |
| `src/i18n/translations.ts` → objeto estático | `supabase.from('translations').select('*').eq('language', lang)` |
| `src/appData/personal.tsx` → JSX | `supabase.from('social_links').select('*')` + `site_config` |
| `content/testimonials/*.json` | `supabase.from('testimonials').select('*').order('created_at', { ascending: false })` |

---

## 3. Íconos SVG

Los íconos se guardan en Supabase como **identificadores** (strings: `'javascript'`, `'react'`). En el frontend se resuelven mediante un mapa:

```typescript
// src/utils/iconMap.ts
import { JavaScriptIcon, ReactIcon, ... } from './icons'

export const iconMap: Record<string, React.ComponentType> = {
  javascript: JavaScriptIcon,
  react: ReactIcon,
  typescript: TypescriptIcon,
}
```

Uso: `const Icon = iconMap[sectionItem.icon_id]`

Los íconos están bundlados en el código (no se necesita Cloudinary ni Supabase Storage para ellos).

---

## 4. Imágenes — Cloudinary

Cloudinary reemplaza a Supabase Storage para todo lo que son imágenes:

- **Covers de proyectos** — subidas desde el admin a Cloudinary, se guarda la URL en `projects.cover_url`
- **Fotos de testimonios** — mismo flujo, URL en `testimonials.image_url`
- **CV / documentos** — PDF subido a Cloudinary o carpeta `public/`

Ya está configurado como patrón remoto en `next.config.ts`.

**Flujo**: Admin sube imagen → Cloudinary Upload API → devuelve URL → se guarda en la fila de Supabase.

---

## 5. Firebase — Solo Contacto (se mantiene)

El formulario de contacto sigue usando Firebase Firestore exactamente como está ahora:
- `src/lib/firebase.ts` — sin cambios
- `src/actions/contact-form.ts` — sin cambios
- Las respuestas se guardan en la colección `contactSubmissions`

Si más adelante quieres migrarlo a Supabase, se crea una tabla `contact_submissions` y se cambia la server action.

---

## 6. Autenticación

Usar **Supabase Auth** con email/password:

- Login en `/admin/login`
- Middleware protege `/admin/*`
- RLS policies para que solo el admin autenticado pueda escribir
- 1-2 cuentas admin, sin registro público

---

## 7. Admin UI — Estructura de Rutas

```
src/app/admin/
  login/page.tsx              → Login con Supabase Auth
  page.tsx                    → Dashboard protegido
  layout.tsx                  → Layout admin + sidebar

  projects/
    page.tsx                  → DataTable con CRUD
    new/page.tsx              → Formulario crear (con upload a Cloudinary)
    [id]/page.tsx             → Formulario editar

  sections/
    page.tsx                  → Lista de secciones (accordions)
    new/page.tsx              → Crear sección + sus items
    [id]/page.tsx             → Editar sección

  sections/[id]/items/
    page.tsx                  → Items de la sección (CRUD)

  skills/
    page.tsx                  → CRUD + drag & drop reordenar

  testimonials/
    page.tsx                  → CRUD con upload de foto a Cloudinary

  translations/
    page.tsx                  → Editor multi-idioma con tabs

  settings/
    page.tsx                  → Temas, redes sociales, footer, SEO
```

---

## 8. Implementación de Secciones Genéricas (Accordions Dinámicos)

El admin podrá crear nuevas secciones tipo acordeón sin tocar código:

1. **Crear sección**: nombre, tipo (`accordion`/`grid`), orden
2. **Agregar items**: ícono, título y descripción (en cada idioma)
3. **Componente genérico**: `DynamicAccordionSection` renderiza cualquier sección basada en los datos de Supabase

---

## 9. Orden de Implementación

1. **Configurar Supabase** — proyecto, tablas SQL, Auth (email/password)
2. **Configurar Cloudinary** — cuenta free, API keys para upload desde el admin
3. **Cliente Supabase** — crear `src/lib/supabase.ts` (clients server y browser)
4. **Migrar servicios** — reemplazar `src/services/index.ts` para leer de Supabase
5. **Migrar appData** — skills, social, footer, themes, sections desde Supabase
6. **Migrar traducciones** — cargar desde Supabase en `LanguageContext`
7. **Admin layout + login** — proteger `/admin` con Supabase Auth
8. **Admin CRUD** — proyectos (con upload a Cloudinary), skills, testimonios
9. **Admin secciones** — editor de accordions dinámicos
10. **Admin traducciones** — editor multi-idioma
11. **Admin settings** — temas, redes, footer, SEO

---

## 10. Consideraciones Técnicas

- **Firebase** coexiste sin problemas — solo es el contact form, no hay conflicto con Supabase
- **ISR**: Las páginas públicas pueden usar `revalidate` o revalidación on-demand tras cambios en Supabase
- **Cache de traducciones**: Cargar todas las claves de un idioma al iniciar sesión y cachearlas en el LanguageContext
- **Tipos compartidos**: Mantener `src/lib/types.d.ts` actualizado, con interfaces que reflejen las tablas de Supabase
- **Costos**: Supabase gratis + Cloudinary gratis + Firebase en $0 + Netlify gratis = **costo total $0**
