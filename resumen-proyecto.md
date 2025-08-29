# 📋 Resumen del Proyecto - Portfolio Next.js

Tu proyecto es un **portfolio profesional de desarrollador full-stack** construido con Next.js 15 y React 19 para Marlon Gutiérrez V, un desarrollador de Costa Rica.

## 🛠️ Tecnologías Principales
- **Framework**: Next.js 15 con Turbopack
- **Lenguaje**: TypeScript  
- **Styling**: Tailwind CSS 4.0
- **Iconos**: React Icons
- **Fuente**: Fira Code (monospace)

## 🎯 Funcionalidades Clave

### 1. Estructura y Layout
- Layout responsivo con [`Navbar`](src/components/Navbar/Navbar.tsx), banner de disclaimer, menú de temas y footer
- SEO optimizado con metadata para OpenGraph y Twitter
- 4 temas de color personalizables (Light, Dark, Aqua, Retro)

### 2. Secciones del Portfolio
- **Hero**: Presentación principal
- **Skills**: Muestra habilidades técnicas con iconos ([`JavaScript`](src/utils/icons.tsx), TypeScript, React, Next.js, etc.)
- **Projects**: Muestra proyectos desde archivos JSON en [`content/projects/`](content/projects/)
- **Services**: Servicios de desarrollo ofrecidos
- **Testimonials**: Opiniones de clientes desde [`content/testimonials/`](content/testimonials/)
- **Contact**: Formulario de contacto

### 3. Gestión de Datos
- Los proyectos y testimonios se leen dinámicamente desde archivos JSON
- Se ordenan por prioridad y fecha automáticamente
- Datos estáticos en [`src/appData/index.ts`](src/appData/index.ts:1) para habilidades y servicios

### 4. Características Avanzadas
- Soporte multilingüe para 5 idiomas
- Diseño moderno y profesional con Tailwind CSS
- Arquitectura modular y componentes reutilizables

## 🚀 Propósito
El portfolio sirve para mostrar tus habilidades como desarrollador full-stack, exhibir proyectos realizados, ofrecer servicios profesionales y facilitar el contacto con clientes potenciales.

Es un proyecto bien estructurado, moderno y profesional que efectivamente demuestra capacidades de desarrollo web full-stack.