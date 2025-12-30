# setupandhold

Blog estático construido con [Astro](https://astro.build) y listo para publicar
en GitHub Pages. Incluye RSS, páginas de etiquetas y dos posts de
muestra.

## Requisitos

- Node.js 18+ (se recomienda 20+)
- npm (o pnpm/yarn si prefieres; ajusta los comandos)

winget install -e --id OpenJS.NodeJS.LTS

## Puesta en marcha

```bash
npm install
npm run dev
```

El servidor quedará en `http://localhost:4321`.

## Scripts principales

- `npm run dev`: modo desarrollo con recarga en caliente.
- `npm run build`: genera la salida estática en `dist`.
- `npm run preview`: sirve la versión generada.
- `npm run check`: validación de tipos y rutas de contenido.

## Añadir nuevas entradas

1. Crea un archivo Markdown en `src/content/blog/ejemplo.md`.
2. Incluye el frontmatter:

```markdown
---
title: Título visible
description: Resumen corto (aparece en tarjetas y SEO)
date: 2025-03-10
updated: 2025-03-14 # opcional
tags: [tema1, tema2]
draft: false # opcional, por defecto false
hero:
  src: https://...
  alt: Texto alternativo
---

Contenido en Markdown...
```

3. Guarda y revisa en `http://localhost:4321`.

## Despliegue en GitHub Pages

- Workflow: `.github/workflows/deploy.yml`.
- Rama de origen: `main` → construye y publica en `gh-pages`.
- Ajusta la URL del sitio si usas otro nombre de repo o dominio:
  - En `astro.config.mjs` se calcula `base` con la variable `GITHUB_REPOSITORY`.
  - El `site` se puede inyectar en el workflow con la variable `SITE`, por
    ejemplo: `https://<usuario>.github.io/<nombre-repo>`.
- Tras el primer despliegue, habilita GitHub Pages en Settings → Pages apuntando
  a la rama `gh-pages`.

## Estructura rápida

- `src/pages`: páginas y rutas (blog, etiquetas, about, 404, RSS).
- `src/layouts/BaseLayout.astro`: marco general y navegación.
- `src/components/PostCard.astro`: tarjetas de resumen para listados.
- `src/content/blog`: posts en Markdown.
- `src/styles/global.css`: estilos base (colores, tipografía, layout).

## Personalización

- Colores/tipografía: `src/styles/global.css`.
- Navegación y footer: `src/layouts/BaseLayout.astro`.
- Tarjetas del blog: `src/components/PostCard.astro`.
- Etiquetas: páginas en `src/pages/tags`.

## Próximos pasos sugeridos

- Añadir modo claro/oscuro con persistencia.
- Crear buscador estático con `Fuse.js`.
- Añadir métricas ligeras (Plausible) si lo necesitas.
- Integrar demos externas (Render, Railway) enlazando desde los posts.
