# Copilot Instructions for Flexy Dev Portfolio

## Project Overview
This is a **Next.js 15 portfolio template** built with React 19, Tailwind CSS v4, and TypeScript. It's designed as a customizable personal portfolio/resume site with dynamic content loading, theme support, Firebase integration for contact forms, and sections for services and computer support.

## Architecture & Key Patterns

### Data Architecture: File-Based Content
- **Projects & Testimonials**: Stored as JSON files in `/content/{projects,testimonials}/` directories
- **Services, Skills, Computer Support**: Defined in `src/appData/index.ts` (hardcoded data with icon mappings)
- **Personal Data (Socials)**: Defined in `src/appData/personal.tsx`
- **Data Flow**: Uses `src/services/index.ts` with `fs` module to read files, sort by `priority` or `createdAt`
- **Why**: Simplifies management—edit JSON files without code changes; facilitates future CMS migration

### Component Structure
- **Folder-based organization**: Each section has its own folder (`Hero/`, `Projects/`, `Services/`, `ComputerSupport/`, etc.)
- **Page composition**: `src/app/page.tsx` orchestrates section components (Hero → Skills → Projects → ClientServiceSection → ClientComputerSupportSection → Contact)
- **Client vs Server**: Most components are **server components** except:
  - `Hero.tsx` ('use client'): Custom hooks for role switching animation
  - `ContactForm.tsx`: Form submission logic
  - `ThemeMenu.tsx`: Theme switcher with state management
  - `ClientServiceSection.tsx`, `ClientComputerSupportSection.tsx`: Client components for interactive sections
- **Context & State**: `SectionContext` for toggling services visibility via `SectionToggle` component

### Type Safety
- Central types in `src/lib/types.d.ts`: `Project`, `Testimonial`, `Heading`
- **When extending data**: Add types here first, then update content JSON structure to match

### Styling Strategy
- **Tailwind v4 with DaisyUI semantics**: Uses CSS variables (`--primary`, `--secondary`, `--accent`, etc.)
- **Theme support**: `data-theme="dark"` in `<html>` tag, managed by `ThemeMenu.tsx`
- **Config**: `tailwindcss.config.js` (not in workspace—uses defaults), `globals.css` for theme variables
- **Font**: Fira Code loaded in `src/app/layout.tsx`
- **Responsive**: Mobile-first approach; test at `sm:`, `md:`, `lg:` breakpoints

## Critical Developer Workflows

### Setup & Development
```bash
npm install                    # Install dependencies (Next.js 15, React 19, Tailwind v4)
npm run dev                   # Start dev server with Turbopack (http://localhost:3000)
npm run build && npm run start # Production build & server
npm run lint                  # ESLint check
```

### Adding New Content
1. **Projects**: Add JSON to `content/projects/` matching `Project` interface
2. **Testimonials**: Add JSON to `content/testimonials/` with `Testimonial` interface (currently commented out in `page.tsx`)
3. **Skills/Services/Computer Support**: Edit `src/appData/index.ts` directly (hardcoded arrays)
4. **Social Links**: Edit `src/appData/personal.tsx`
5. **Icons**: Add SVG imports to `src/utils/icons.tsx`, export as components

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
- **File**: `src/app/globals.css` (CSS variable overrides for themes)
- **DaisyUI integration**: Buttons, cards use semantic class names (`btn`, `card`)
- **Customization**: Modify `--primary`, `--secondary` in globals.css for brand colors

## Common Tasks & Where to Make Changes

| Task | Location |
|------|----------|
| Change portfolio name/title | `src/app/layout.tsx`, `src/components/Navbar/Logo.tsx` |
| Add project | `content/projects/projectN.json` |
| Update skills/services/computer support | `src/appData/index.ts` |
| Update social links | `src/appData/personal.tsx` |
| Modify color scheme | `src/app/globals.css` (CSS vars) |
| Add new section | Create component in `src/components/`, import in `src/app/page.tsx` |
| Toggle section visibility | Use `SectionContext` in component rendering |
| Add page section | Create component in `src/components/`, import in `src/app/page.tsx` |
| Update contact email | `.env.local` (Firebase config) or form backend |

## TypeScript & Code Quality
- **Strict mode enabled**: Required to add types for new code
- **Path aliases**: `@/*` resolves to `./src/*` (use for imports)
- **No required external types**: All types defined locally in `src/lib/types.d.ts`
