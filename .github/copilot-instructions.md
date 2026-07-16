# Copilot Instructions for Flexy Dev Portfolio

## Project Overview
This is a **Next.js 16 portfolio template** built with React 19, Tailwind CSS v4, and TypeScript. It's designed as a customizable personal portfolio/resume site with **i18n support** (5 languages), Firebase integration for contact forms, dynamic content loading, theme support, and sections for services and computer support.

## Architecture & Key Patterns

### Data Architecture: File-Based + i18n
- **Projects & Testimonials**: Stored as JSON files in `/content/{projects,testimonials}/` directories
- **Services, Computer Support**: Icons only in `src/appData/index.ts`; **all text is translated via i18n** (`translations.ts`)
- **Personal Data (Socials)**: Defined in `src/appData/personal.tsx`
- **Data Flow**: Uses `src/services/index.ts` with `fs` module to read files, sort by `priority` or `createdAt`
- **Why**: Simplifies management—edit JSON files without code changes; facilitates future CMS migration

### i18n System
- **5 languages**: English, Spanish, French, German, Russian
- **Translation file**: `src/i18n/translations.ts` — all UI text keys organized by language
- **Context**: `LanguageContext` (`src/context/LanguageContext.tsx`)
  - Provides `lang`, `setLang`, and `t(key)` function
  - Persists selection in `localStorage`
  - Updates `<html lang="...">` dynamically
- **Usage**: `const { t } = useLanguage()` in client components, then `{t('key.name')}`
- **LanguageSwitcher**: Floating button at bottom-right (`src/components/LanguageSwitcher/`), positioned above ThemeMenu

### Component Structure
- **Folder-based organization**: Each section has its own folder (`Hero/`, `Projects/`, `Services/`, `ComputerSupport/`, etc.)
- **Page composition**: `src/app/page.tsx` orchestrates section components (Hero → Skills → Projects → ClientServiceSection → ClientComputerSupportSection → Contact)
- **Client vs Server**:
  - **Server components by default**; only interactive elements use `'use client'`
  - Components using `useLanguage()` must be client components (e.g., `Hero`, `ContactForm`, `ProjectSection`, `Footer`, `Navbar`, `ServicesAccordion`, `ComputerSupportAccordion`, `ServiceSection`, `ComputerSupportSection`, `ThemeMenu`)
- **Context & State**: `SectionContext` for toggling services visibility via `SectionToggle` component

### Type Safety
- Central types in `src/lib/types.d.ts`: `Project`, `Testimonial`, `Heading`
- **When extending data**: Add types here first, then update content JSON structure to match

### Styling Strategy
- **Tailwind v4 with CSS variables**: Uses `--primary`, `--secondary`, `--accent`, etc. defined in `globals.css`
- **Theme support**: `data-theme="dark"` in `<html>` tag, managed by `ThemeMenu.tsx` (light/dark/aqua/retro)
- **Config**: `postcss.config.mjs` with `@tailwindcss/postcss`, `globals.css` for theme variables
- **Font**: Fira Code loaded in `src/app/layout.tsx`
- **Responsive**: Mobile-first approach; test at `sm:`, `md:`, `lg:` breakpoints

## Critical Developer Workflows

### Setup & Development
```bash
npm install                    # Install dependencies (Next.js 16, React 19, Tailwind v4)
npm run dev                   # Start dev server with Turbopack (http://localhost:3000)
npm run build && npm run start # Production build & server
npm run lint                  # ESLint check
```

### Adding New Content
1. **Projects**: Add JSON to `content/projects/` matching `Project` interface
2. **Testimonials**: Add JSON to `content/testimonials/` with `Testimonial` interface (currently commented out in `page.tsx`)
3. **Skills**: Edit `src/appData/index.ts` directly (hardcoded array with name + icon)
4. **Services/Computer Support text**: Add/edit keys in `src/i18n/translations.ts` (format: `services.N.title`, `services.N.desc`, `support.N.title`, `support.N.desc`)
5. **Services/Computer Support icons**: Edit `serviceData`/`computerSupportData` arrays in `src/appData/index.ts`
6. **Social Links**: Edit `src/appData/personal.tsx`
7. **Icons**: Add SVG imports to `src/utils/icons.tsx`, export as components

### Adding a New Language
1. Add language code to `Language` type in `src/i18n/translations.ts`
2. Add entry to `languages` array
3. Add all translation keys under the new language code
4. LanguageSwitcher automatically picks up new languages

### Environment Configuration
- **Required**: `.env.local` with `NEXT_PUBLIC_SITE_URL`
- **Firebase** (optional): Set in `src/lib/firebase.ts`—contact form saves to Firestore if configured
- **SEO**: Edit `src/app/layout.tsx` metadata (title, description, Open Graph tags)

## Project-Specific Patterns

### Custom Hooks (src/hooks/)
- `useRoleSwitcher`: Cycles through role strings at intervals (Hero section animation)
- `useRotatingAnimation`: ref-based animation controller (ellipse rotation)
- `useHeadingsData`: TableOfContents extraction from page headings
- `useOutsideClick`: Close dropdowns/menus on external click

### SVG Icon Handling
- **Pattern**: Import SVG as components in `src/utils/icons.tsx`, then pass as props
- **Example**: `icon: JavaScriptIcon` in `serviceData`, rendered via `<Image src={icon} />`
- **Avoid**: Using `react-icons` library alongside custom SVGs (inconsistency)

### Server Actions
- **Contact form**: `src/actions/contact-form.ts` uses `'use server'` directive
- **Firebase integration**: Uses `addDoc` to Firestore `contactSubmissions` collection
- **Validation**: Form fields validated server-side before Firebase write

### Responsive Images
- **Next.js Image component**: Used in ServiceCard, ProjectCard
- **Remote patterns**: Configured in `next.config.ts` for Unsplash, ImageKit, Cloudinary, GitHub
- **Local images**: Import from `src/assets/images/` (e.g., `HeroImage`)

### Section Toggling
- **Context**: `SectionContext` manages `showServices` state
- **Toggle**: `SectionToggle` component allows hiding/showing services sections
- **Usage**: Wrap sections in conditional rendering based on context

## Key Integration Points

### Firebase Setup
- File: `src/lib/firebase.ts`
- Contact submissions → Firestore collection `contactSubmissions`
- Gracefully degrades if not configured (shows error to user)

### Metadata & SEO
- File: `src/app/layout.tsx`
- Configures Open Graph, Twitter cards, canonical URLs
- Uses `process.env.NEXT_PUBLIC_SITE_URL` for dynamic base URL

### Tailwind & Theme System
- **File**: `src/app/globals.css` (CSS variable overrides for 4 themes)
- **Customization**: Modify `--primary`, `--secondary` in `globals.css` for brand colors

### Floating UI Elements
- **ThemeMenu**: Bottom-right, fixed position (`fixed right-6 bottom-4`)
- **LanguageSwitcher**: Bottom-right, fixed position (`fixed right-6 bottom-20`), above ThemeMenu

## Common Tasks & Where to Make Changes

| Task | Location |
|------|----------|
| Change portfolio name/title | `src/app/layout.tsx`, `src/components/Navbar/Logo.tsx` |
| Add project | `content/projects/projectN.json` |
| Update skills | `src/appData/index.ts` (`skillList` array) |
| Update services text | `src/i18n/translations.ts` (`services.N.title`, `services.N.desc`) |
| Update computer support text | `src/i18n/translations.ts` (`support.N.title`, `support.N.desc`) |
| Update services/support icons | `src/appData/index.ts` (`serviceData`/`computerSupportData`) |
| Update social links | `src/appData/personal.tsx` |
| Modify color scheme | `src/app/globals.css` (CSS vars for each theme) |
| Add new section | Create component in `src/components/`, import in `src/app/page.tsx` |
| Toggle section visibility | Use `SectionContext` in component rendering |
| Add/edit translation key | `src/i18n/translations.ts` |
| Add new language | `src/i18n/translations.ts` (type, array, translation object) |
| Update contact email | `.env.local` (Firebase config) or form backend |
| Change LanguageSwitcher position | `src/components/LanguageSwitcher/LanguageSwitcher.tsx` (Tailwind classes) |

## TypeScript & Code Quality
- **Strict mode enabled**: Required to add types for new code
- **Path aliases**: `@/*` resolves to `./src/*` (use for imports)
- **No required external types**: All types defined locally in `src/lib/types.d.ts`

## Changelog
See [CHANGELOG.md](../CHANGELOG.md) for recent updates.
