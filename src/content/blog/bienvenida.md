---
title: Bienvenida a setupandhold
description: Por qué existe este blog y cómo está montado con Astro para GitHub Pages.
date: 2025-01-15
tags: [astro, github-pages, setup]
hero:
  src: https://images.unsplash.com/photo-1522199584615-1e6c61c7ed0c?auto=format&fit=crop&w=1400&q=80
  alt: Teclado con luz tenue
---

¡Hola! Este proyecto es un blog estático construido con **Astro** y pensado para
publicar directamente en **GitHub Pages**. El flujo es sencillo:

1. Escribes tus posts en Markdown dentro de `src/content/blog`.
2. Haces push a `main`.
3. GitHub Actions construye y despliega el sitio en la rama `gh-pages`.

Astro genera HTML estático ultra ligero, lo que hace que el sitio cargue rápido y
sea fácil de mantener. Las etiquetas (`tags`) te permiten agrupar temas y el RSS
se genera automáticamente para lectores o newsletters.

Si quieres cambiar la apariencia, empieza por `src/styles/global.css` y el
layout base en `src/layouts/BaseLayout.astro`. Para agregar páginas nuevas basta
con crear archivos `.astro` en `src/pages`.
