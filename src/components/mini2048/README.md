# Mini-2048 — Documentación técnica

Componente Astro que implementa el juego 2048 en formato compacto (sidebar), con soporte de leaderboard online, guardado automático y animaciones de movimiento de fichas.

---

## Estructura de ficheros

```
src/components/mini2048/
└── Mini2048.astro   ← componente único (HTML + CSS scoped/global + script inline)
```

---

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `storageKey` | `string` | `'mini-2048-state-v2'` | Clave de `localStorage` donde se guarda el estado de la partida |
| `apiBase` | `string` | `import.meta.env.PUBLIC_LEADERBOARD_URL ?? ''` | URL base del servidor de leaderboard. Si está vacío, el leaderboard se deshabilita silenciosamente |

Los props se leen en el frontmatter Astro y se pasan al DOM como atributos `data-storage-key` y `data-api-base` en el elemento raíz `.m2048`. El script inline los lee en tiempo de ejecución con `root.getAttribute(...)`.

---

## Estado y persistencia

### Clave de localStorage

Por defecto: `mini-2048-state-v2` (configurable via prop `storageKey`).

### Estructura del objeto guardado

```ts
{
  board:                number[16],  // estado del tablero, 0 = celda vacía
  score:                number,      // puntuación acumulada
  milestone:            number,      // próxima ficha objetivo (por defecto 2048)
  lastMilestone:        number,      // último hito alcanzado (0 si ninguno)
  submittedMilestone:   boolean,     // si se envió la puntuación al hito actual
  submittedThisGame:    boolean,     // si ya se envió una puntuación en esta partida
  currentPlayerName:    string,      // nombre del jugador (puede estar vacío)
  lastSubmittedThousand: number,     // último múltiplo de 1000 puntos enviado
}
```

### Lógica de carga

Al inicializar:

1. Se intenta leer y parsear el objeto de `localStorage`.
2. Si existe y el array `board` tiene exactamente 16 elementos → se restaura la partida.
3. Si no existe o está corrupto → se llama a `reset()` para empezar una nueva.

Tras la carga, si `canMove()` devuelve `false`, se marca el juego como terminado inmediatamente (para el caso en que el jugador recargue con el tablero bloqueado).

---

## Tablero y lógica de movimiento

### Representación

El tablero es un array unidimensional de 16 enteros. La celda en fila `r`, columna `c` se accede como `board[r * 4 + c]`. El valor `0` indica celda vacía.

### Spawn de fichas

```js
const spawn = () => {
  const empties = emptyIndexes(); // índices de celdas con valor 0
  if (!empties.length) return;
  const idx = empties[rand(empties.length)];
  state.board[idx] = Math.random() < 0.9 ? 2 : 4; // 90% probabilidad de 2, 10% de 4
};
```

Al empezar una partida se ejecutan dos `spawn()` consecutivos.

### Construcción de líneas (`buildLines`)

Para cada dirección, se construyen 4 líneas de 4 índices. Las líneas siempre van **en el sentido del movimiento** (de destino a origen) para que `slideAndMergeLine` funcione igual en todas las direcciones:

| Dirección | Líneas |
|---|---|
| `left` | 4 filas de izquierda a derecha |
| `right` | 4 filas de derecha a izquierda (reversas) |
| `up` | 4 columnas de arriba a abajo |
| `down` | 4 columnas de abajo a arriba (reversas) |

### Slide y merge (`slideAndMergeLine`)

Dada una línea de valores `[a, b, b, 0]`:

1. Se filtran los ceros: `[a, b, b]`.
2. Se recorre de izquierda a derecha; si dos valores adyacentes son iguales, se fusionan en uno (`2b`) y se avanza el índice extra (`i += 1`).
3. Se rellena con ceros hasta longitud 4.

Resultado: `[a, 2b, 0, 0]`. La puntuación ganada es la suma de todas las fusiones.

### `computeMove(dir)`

Calcula el estado resultante de un movimiento **sin modificar `state.board`**. Devuelve:

```ts
{
  before:             number[16], // board antes del movimiento
  next:               number[16], // board después
  moves:              Move[],     // lista de { from, to, value, merged }
  gained:             number,     // puntos ganados
  mergeDestinations:  number[],   // índices donde hubo fusión (para animación pop)
  changed:            boolean,    // si el tablero cambió
}
```

Si `changed` es `false`, el movimiento no se ejecuta ni se anima.

---

## Animación de movimiento

### Overlay de tiles

Las fichas animadas se crean como `div.m2048__tile` dentro de `div.m2048__overlay`, que es un overlay `position: absolute; inset: 0` sobre el tablero. Esto evita que las fichas en movimiento se vean afectadas por el z-index de las celdas estáticas.

Como estos elementos se crean dinámicamente por JS, sus estilos usan `:global()` para saltarse el scoping de Astro:

```css
.m2048__board :global(.m2048__tile) { ... }
.m2048__board :global(.m2048__overlay) { ... }
```

### Proceso de `animateMoves(result)`

1. Se oculta el texto de las celdas de origen (`data-value="0"`, `textContent = ''`).
2. Para cada movimiento con `from !== to`, se crea un tile en la posición absoluta de la celda origen (usando `offsetLeft/offsetTop` reales del DOM).
3. Se aplica la transformación CSS con `transform: translate(dx, dy)` para mover el tile al destino.
4. Se espera a que todos los tiles terminen su transición (`transitionend` o timeout de seguridad de `duration + 120 ms`).
5. Los tiles se eliminan del DOM.

**Parámetros de animación:**
- Duración: **140 ms** en escritorio y móvil.
- Easing: `cubic-bezier(0.2, 0.9, 0.2, 0.9)` (arranque suave, aceleración rápida, frenado suave).

**Ajuste para móvil:** en dispositivos móviles se usa `translate3d` en lugar de `translate` y se fuerza un doble `requestAnimationFrame` antes de iniciar la transición para asegurar que el browser registra el estado inicial correctamente.

### Animación de aparición y fusión

- **Nueva ficha** (`m2048__cell--appear`): `scale(0) → scale(1)`, 200 ms. Se aplica tras el spawn identificando qué celda pasó de 0 a no-0.
- **Fusión** (`m2048__cell--pop`): `scale(1) → scale(1.2) → scale(1)`, 200 ms. Se aplica en `mergeDestinations`.

---

## Hitos y leaderboard

### Hitos

Los hitos son las potencias de 2 a partir de 256: 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072.

```js
const milestoneMin = 256;
const milestoneMax = 131972; // ≈ 131072 * 2 como tope lógico

const milestoneForMax = (m) => {
  if (m < milestoneMin) return 0;
  let v = milestoneMin;
  while (v <= milestoneMax / 2 && v * 2 <= m) v *= 2;
  return v;
};
```

Al detectar un nuevo hito (`m > lastMilestone`), se muestra el mensaje "¡Has llegado a N!" durante 5 segundos y se actualiza `lastMilestone`.

### Envío automático al leaderboard

Si el jugador tiene nombre introducido y no ha enviado puntuación en esta partida, el envío es automático en:

1. **Cada 1000 puntos nuevos**: `currentThousand = floor(score / 1000) > lastSubmittedThousand`.
2. **Cada hito alcanzado**: cualquier nueva potencia de 2 desde 256.
3. **Al terminar la partida** (Game Over).

El envío automático en hito/puntos usa `{ after: 'continue' }` (la partida sigue), y el de Game Over usa `{ after: 'reset' }` (se marca como terminada).

### API del leaderboard

La URL se construye a partir del prop `apiBase`:

```js
const leaderboardEndpoint = (() => {
  if (!normalizedApi) return ''; // leaderboard deshabilitado
  if (/\/api\/leaderboard$|\/leaderboard$/i.test(normalizedApi)) return normalizedApi;
  return `${normalizedApi}/api/leaderboard`;
})();
```

Esto permite pasar tanto la URL base (`https://api.ejemplo.com`) como la URL completa del endpoint.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/leaderboard` | Obtiene las entradas. Respuesta: `{ ok: true, entries: Entry[] }` |
| `POST` | `/api/leaderboard` | Envía una puntuación. Body: `{ name, score, maxTile }`. Respuesta: `{ ok: true, entries: Entry[] }` |

```ts
type Entry = {
  name:      string,
  score:     number,
  maxTile:   number,
  createdAt: number, // Unix timestamp en segundos
}
```

La URL se inyecta en build time via la variable de entorno `PUBLIC_LEADERBOARD_URL` (definida como variable de repositorio en GitHub Actions, ver `.github/workflows/deploy.yml`).

### Columnas del leaderboard y auto-scroll

El leaderboard muestra hasta 10 entradas con columnas: `#`, nombre, puntuación, ficha máxima y fecha. Como el ancho de las columnas es variable, tras renderizar el DOM el script:

1. Mide el ancho real de cada celda con `getBoundingClientRect()`.
2. Fija el ancho de todas las celdas de cada columna al máximo medido.
3. Sincroniza el header de la columna "tail" (Score/Max/Date) con el `scrollLeft` de las filas via `requestAnimationFrame` continuo.

Las filas "tail" (Score/Max/Date) implementan un **auto-scroll horizontal** con ciclo:
1. Dwell izquierda: 3000 ms.
2. Scroll suave a la derecha: `Math.max(1500, Math.min(4500, 1200 + max * 6))` ms.
3. Dwell derecha: 3000 ms.
4. Scroll suave de vuelta a la izquierda.

La animación usa un easing `easeInOutQuad` implementado manualmente via `requestAnimationFrame` (no `scroll-behavior: smooth`) para tener control exacto sobre la duración.

Si el usuario tiene `prefers-reduced-motion: reduce`, el auto-scroll se desactiva.

---

## Controles

### Teclado físico

Las teclas de flecha (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) mueven el tablero. Solo funcionan cuando el elemento `[data-board]` tiene el foco. El click/tap sobre el tablero lo enfoca automáticamente.

### Gestos (pointer events)

El tablero escucha `pointerdown` y `pointerup`. Si el desplazamiento absoluto supera 18 px, se infiere una dirección:
- `|dx| > |dy|` → movimiento horizontal.
- `|dy| > |dx|` → movimiento vertical.

El uso de Pointer Events (en lugar de Touch Events) cubre tanto ratón como touch con una sola API y no requiere `touchAction: none` en el HTML (el CSS ya lo incluye).

---

## Debug cheat

Con `DEBUG_CHEAT = 1` (valor por defecto), `Ctrl/Cmd + clic` en el botón "Nueva partida" abre dos `prompt()` para:
- Establecer la puntuación a cualquier valor.
- Colocar una ficha de cualquier valor en la primera celda vacía.

Para desactivar en producción, cambiar `DEBUG_CHEAT` a `0`.

---

## CSS y scoping de Astro

El componente usa **dos tipos de CSS**:

### 1. CSS scoped (normal)

Los estilos de elementos estáticos del template (`.m2048`, `.m2048__header`, `.m2048__score`, etc.) están en la etiqueta `<style>` normal de Astro, que añade automáticamente un atributo `data-astro-cid-xxx` para evitar colisiones.

### 2. CSS con `:global()` (para elementos dinámicos)

Los elementos creados por JavaScript en runtime no tienen el atributo de scoping de Astro. Por eso se usan selectores `:global()` para:

```css
.m2048__board :global(.m2048__overlay) { ... }
.m2048__board :global(.m2048__tile) { ... }
.m2048__lb-list :global(.m2048__lb-item) { ... }
.m2048__lb-list :global(.m2048__lb-rank) { ... }
.m2048__lb-list :global(.m2048__lb-name) { ... }
.m2048__lb-list :global(.m2048__lb-score) { ... }
.m2048__lb-list :global(.m2048__lb-date) { ... }
.m2048__lb-list :global(.m2048__lb-max) { ... }
.m2048__lb-list :global(.m2048__lb-tail) { ... }
```

El selector padre (`.m2048__board`, `.m2048__lb-list`) sí está scoped, por lo que los estilos siguen siendo específicos al componente.

---

## Colores de las fichas

Las fichas no usan colores hardcoded: se basan en el gradiente `linear-gradient(135deg, var(--accent), var(--accent-2))` con opacidad variable según el valor:

| Valor | Opacidad (`--tile-o`) |
|---|---|
| 2 | 0.10 |
| 4 | 0.14 |
| 8 | 0.18 |
| … | +0.04 por potencia |
| 2048 | 0.55 |
| > 2048 | 0.65 |

Esto hace que el esquema de colores respete el tema oscuro/claro automáticamente sin necesidad de colores específicos por modo.

---

## Inicialización

El script usa IIFE sin módulos ES (`is:inline`). La función `init(root)` se registra para cada `.m2048` del documento. Para aguardar al DOM completo:

```js
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot(); // DOM ya listo (script inline al final del body)
}
```

El flag `root.dataset.m2048Init = '1'` previene doble inicialización.
