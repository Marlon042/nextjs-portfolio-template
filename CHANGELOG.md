# Changelog

## [No liberado]

### Agregado
- **Sistema i18n** — Internacionalización completa con 5 idiomas (EN, ES, FR, DE, RU)
  - Archivo de traducciones: `src/i18n/translations.ts` con todas las claves de texto UI
  - LanguageContext provider con persistencia en `localStorage`
  - Hook `useLanguage()` con función `t(key)` para traducciones
- **LanguageSwitcher** — Elemento UI flotante abajo a la derecha, posicionado arriba del ThemeMenu
  - Ícono de globo + etiqueta del idioma actual
  - Dropdown que se abre hacia arriba con las 5 opciones de idioma
  - Clic fuera para cerrar
- **Contenido de acordeones traducido** — Todos los títulos y descripciones de tarjetas de servicios y soporte técnico ahora son traducibles mediante claves i18n

### Cambiado
- **Navbar** — Eliminado `overflow-hidden` para permitir que los dropdowns se muestren correctamente; logo siempre visible (eliminado ocultamiento condicional al abrir menú mobile)
- **Footer** — Eliminada sección decorativa de selector de idioma; todo el texto (Resumen, descripción, Contáctenos, Ubicación, copyright) ahora usa traducciones i18n
- **Hero** — Saludo, roles, subtítulo y texto de botones ahora traducidos via i18n
- **Sección de Contacto** — Labels del formulario, placeholders, encabezados de sección y botón de descargar CV ahora traducidos
- **ProjectSection** — Convertido a `'use client'` para acceso a i18n
- **ServiceSection / ComputerSupportSection** — Convertidos a `'use client'`; fuente de texto movida de `appData` hardcodeado a claves de traducción i18n
- **`appData/index.ts`** — `serviceData` y `computerSupportData` reducidos a solo íconos; texto eliminado (ahora en traducciones)
- **ThemeMenu** — Texto `_select-theme` ahora traducible
- **DisclaimerBanner** — Eliminado del layout

### Corregido
- Dropdown del LanguageSwitcher estaba siendo recortado por `overflow-hidden` del Navbar
- Menú mobile ahora abre/cierra correctamente sin ocultar el logo
- Alineación del dropdown del LanguageSwitcher en mobile (ahora alineado a la izquierda con los items del menú)
- Visibilidad del ícono de globo al recargar página y al cambiar de idioma

### Deuda Técnica
- Todos los componentes servidor que renderizan texto traducible fueron convertidos a componentes cliente para acceder al hook `useLanguage()`
