---
slug: mousepad-asic
title: "Alfombrilla ASIC — Cheatsheet visual"
description: "Un repaso detallado de la alfombrilla de escritorio con explicaciones por secciones: Verilog, timing, CDC, clock gating, PRBS, punto fijo y representación de signo."
date: 2026-01-11
tags: [asic, verilog, proyectos]
draft: true
---

<img src="/img/asic-mousepad.png" alt="Alfombrilla ASIC" style="max-width:100%;height:auto;display:block;margin:0 auto;" />

Esta alfombrilla nació de una necesidad sencilla: tener a mano, sobre la mesa, una referencia clara y visual con los conceptos que más consulto cuando trabajo en diseño digital. En lugar de perder tiempo buscando notas o abrir docenas de pestañas, quería algo inmediato que funcionara como una chuleta práctica durante las sesiones de trabajo.

Trabajo en diseño de ASIC (microchips), centrado en la parte RTL y en el análisis de timing para la síntesis lógica; por eso gran parte del contenido está orientado a problemas reales que aparecen en la síntesis, la simulación y la integración en silicio.

La imagen que ves arriba reúne en un solo plano los bloques más útiles para el día a día: desde atajos de sintaxis en Verilog hasta diagramas de timing, sincronización y estrategias de ahorro de energía. No pretende sustituir documentación exhaustiva: su valor está en la inmediatez y en ordenar la información para consultarla en segundos.

## Cómo conseguirla

Si te interesa una copia física o la versión en alta resolución, visita la página dedicada: [Alfombrilla ASIC](/mousepad). Allí hay un visor con zoom, y un formulario de contacto para pedidos 🙂.

## Herramientas usadas

Usé <a href="https://www.drawio.com/" target="_blank" rel="noreferrer noopener">Draw.io</a> para todo el diseño. Draw.io es la copia open source de Microsoft Visio, aunque en mi opinión es mucho mejor en muchísimos aspectos.

## Contenidos

Quería que la alfombrilla fuera una chuleta visual con lo esencial de ASIC, con ejemplos mínimos y diagramas limpios, siendo a la vez útil y agradable a la vista.

- **Sintaxis básica de Verilog:** recordatorios somo cómo declarar *unpacked arrays* o cómo usar los `genvar` correctamente para instanciar módulos.
- **Setup y Hold:** diagrama temporal para recordar qué representan los tiempos de setup y hold y las ecuaciones básicas que deben cumplirse para respetar el timing.
- **PRBS (Pseudorandom Binary Sequence):** esquema e idea básica de implementación de un PRBS. Me apetecía tener la arquitectura y código Verilog de algún bloque chulo, y un PRBS me pareció buena opción.
- **QUEDA LO DE ABAJO...........**
- **Clock gating cell:** cómo funciona el gating de reloj, cuándo usarlo y qué precauciones tomar para evitar glitches.
- **Tabla de operadores en Verilog:** referencia compacta de operadores aritméticos, lógicos, bitwise, shifts y concatenación.
- **Metastabilidad:** qué es, por qué importa y mitigaciones prácticas (sincronizadores, handshakes).
- **Sincronizador CDC de dos flip-flops:** patrón estándar para cruzar señales entre dominios de reloj.
- **Notación de punto fijo:** interpretación de formatos `S[I,F]` o `X[M,N]`, resolución y rango.
- **Representación de signo:** comparación rápida entre `sign-magnitude`, `1's complement` y `2's complement`.

Si te interesa que alguno de estos bullets tenga una explicación ampliada con un ejemplo (por ejemplo un snippet Verilog del PRBS o un diagrama ampliado de setup/hold), dímelo y lo añado.

## Contacto y recursos

En la alfombrilla verás mi referencia de contacto y la web del proyecto. Usa la página [Alfombrilla ASIC](/mousepad) para pedidos y consultas, o escríbeme desde la sección "Sobre mí" si prefieres hablar directamente.

---

Notas finales

- Este post acompaña a la alfombrilla; si quieres una versión más técnica con ejemplos y recortes por secciones lo preparo y la publico como entrada ampliada.
- ¿Quieres que incluya una galería con recortes por zona (Verilog, timing, CDC) dentro de esta misma entrada? Dímelo y lo preparo.
