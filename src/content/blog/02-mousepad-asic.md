---
slug: mousepad-asic
title: "Alfombrilla ASIC"
description: "Un repaso detallado de la alfombrilla de escritorio ASIC con explicaciones por secciones: Verilog, timing, CDC, clock gating, PRBS, punto fijo y representación de signo."
date: 2026-01-11
tags: [asic, verilog, proyectos]
draft: false
---

<img src="/img/asic-mousepad.png" alt="Alfombrilla ASIC" style="max-width:100%;height:auto;" />

Esta alfombrilla nació de una necesidad sencilla: tener a mano, sobre la mesa, una referencia clara y visual con los conceptos que más consulto cuando trabajo en diseño digital. Quería algo inmediato que funcionara como una chuleta práctica durante las sesiones de trabajo, y que además quedara bien en el escritorio 😎.

Trabajo en diseño de ASIC (microchips), centrado en la parte RTL y en el análisis de timing para la síntesis lógica; por eso gran parte del contenido está orientado a problemas reales que aparecen en el desarrollo de RTL, la síntesis, la simulación y la integración en silicio.

La imagen que ves arriba reúne en un solo plano los bloques más útiles para el día a día: desde sintaxis básica y operadores en Verilog hasta conceptos de metastabilidad, sincronización y estrategias de ahorro de energía. No pretende servir de documentación ni nada por el estilo: su valor está en que contiene las cosas básicas y la información está ordenada para consultarla en segundos.

Si quieres ver los detalles, puedes visitar la página dedicada a la alfombrilla, **[Alfombrilla ASIC](/mousepad)**. Allí hay un visor con zoom para poder ver los detalles en alta resolución 🔍.

## Herramientas usadas

Usé **<a href="https://www.drawio.com/" target="_blank" rel="noreferrer noopener">Draw.io</a>** para todo el diseño. Draw.io es la copia open source de Microsoft Visio, aunque en mi opinión es mejor en casi todos los aspectos.

## Contenidos

Quería que la alfombrilla fuera una chuleta visual con lo esencial de ASIC, con ejemplos mínimos y diagramas limpios, siendo a la vez útil y agradable a la vista.

- **Sintaxis básica de Verilog:** recordatorios somo cómo declarar *unpacked arrays* o cómo usar los `genvar` correctamente para instanciar módulos.
- **Setup y Hold:** diagrama temporal para recordar qué representan los tiempos de setup y hold y las ecuaciones básicas que deben cumplirse para respetar el timing.
- **PRBS (Pseudorandom Binary Sequence):** esquema e idea básica de implementación de un PRBS. Me apetecía tener la arquitectura y código Verilog de algún bloque chulo, y un PRBS me pareció buena opción.
- **Clock gating cell:** una celda de clock gating con diagrama para ver cómo se evitan los glitches en el reloj.
- **Tabla de operadores en Verilog:** referencia compacta de operadores aritméticos, lógicos, bitwise, shifts y concatenación.
- **Metastabilidad:** contiene un diagrama temporal de lo que puede ocurrir si se violan los tiempos de setup y hold.
- **Sincronizador CDC de dos flip-flops:** patrón estándar para cruzar señales entre dominios de reloj.
- **Notación de punto fijo:** interpretación de formatos con signo y sin signo, resolución y rango.
- **Representación de signo:** comparación rápida entre *sign-magnitude*, *1's complement* y *2's complement*.

Como ves, tiene un poco de todo, pero tampoco tiene material super técnico. Lo que más me interesaba era que fuera limpia y bonita.

## Cómo conseguirla

Si te interesa una copia física, visita la página dedicada: **[Alfombrilla ASIC](/mousepad)**. Allí encontrarás una forma de contacto para pedirla 🙂.