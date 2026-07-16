# Changelog

## [Unreleased]

### Added
- **i18n system** — Full internationalization with 5 languages (EN, ES, FR, DE, RU)
  - Translation file: `src/i18n/translations.ts` with all UI text keys
  - LanguageContext provider with `localStorage` persistence
  - `useLanguage()` hook with `t(key)` function for translations
- **LanguageSwitcher** — Floating UI element at bottom-right, positioned above ThemeMenu
  - Globe icon + current language label
  - Dropdown opens upward with all 5 language options
  - Click outside to close
- **Translated accordion content** — All service and computer support card titles and descriptions are now translatable via i18n keys

### Changed
- **Navbar** — Removed `overflow-hidden` to allow dropdowns to display properly; logo always visible (removed conditional hiding on mobile menu open)
- **Footer** — Removed decorative language selector section; all text (Resume, description, Contact Us, Location, copyright) now uses i18n translations
- **Hero** — Greeting, roles, subtitle, and button text now translated via i18n
- **Contact section** — Form labels, placeholders, section headings, and CV download button now translated
- **ProjectSection** — Converted to `'use client'` for i18n access
- **ServiceSection / ComputerSupportSection** — Converted to `'use client'`; text source moved from hardcoded `appData` to i18n translation keys
- **`appData/index.ts`** — `serviceData` and `computerSupportData` reduced to icon-only mappings; text removed (now in translations)
- **ThemeMenu** — `_select-theme` text now translatable
- **DisclaimerBanner** — Removed from layout

### Fixed
- LanguageSwitcher dropdown was being clipped by Navbar's `overflow-hidden`
- Mobile menu now correctly opens/closes without hiding the logo
- LanguageSwitcher dropdown alignment on mobile (now left-aligned within menu items)
- Globe icon visibility on page reload and language switch

### Technical Debt
- All server components that render translatable text were converted to client components to access `useLanguage()` hook
