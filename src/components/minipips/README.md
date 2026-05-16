# MiniPips — Documentación técnica

Componente Astro que implementa el puzzle de dominós diario del NYT (Pips), integrado en la barra lateral como uno de los minijuegos de `MiniGames.astro`. El puzzle se obtiene en tiempo real a través de un proxy VPS que evita las restricciones CORS del NYT.

---

## Estructura de ficheros

```
src/components/minipips/
└── MiniPips.astro   ← componente único (HTML + CSS global + script inline)
```

El componente no tiene props ni dependencias de build. Todo — fetch, lógica, persistencia, render — vive dentro del único fichero `.astro`.

---

## Cómo se obtiene el puzzle del día

El NYT no envía cabeceras CORS, por lo que el navegador no puede llamar directamente a su API. El flujo es:

```
Navegador (setupandhold.com)
  │
  │  GET puzzle.setupandhold.com/api/pips?date=YYYY-MM-DD
  ▼
VPS Node.js (puzzle.setupandhold.com)
  │
  │  GET https://www.nytimes.com/svc/pips/v1/YYYY-MM-DD.json
  │  (server→server, sin restricciones CORS)
  ▼
API NYT Pips
  │
  │  { printDate, editor, easy, medium, hard }
  ▼
VPS → devuelve { date, easy, medium, hard } con CORS headers
  │
  ▼
Componente MiniPips → parseNytDiff() → puzzle interno
```

El VPS está en `setupandhold-vps/src/server.js`, ruta `GET /api/pips`.

---

## Formato de datos

### Formato NYT (tal como llega del proxy)

```ts
{
  date: string,           // "YYYY-MM-DD"
  easy:   NytDiff | null,
  medium: NytDiff | null,
  hard:   NytDiff | null,
}

// NytDiff
{
  id:       number,
  dominoes: [number, number][],   // pares de valores (0–6)
  regions: {
    indices: [number, number][],  // [row, col] de cada celda
    type:    string,              // 'sum' | 'equals' | ...
    target?: number,
  }[]
}
```

### Formato interno (tras `parseNytDiff`)

```ts
{
  id:         string,           // "nyt-medium-42"
  difficulty: string,           // "fácil" | "medio" | "difícil"
  dominoes:   [number, number][],
  regions: {
    cells:   [number, number][],  // [row, col] — mismo que indices del NYT
    type:    string,
    target?: number,
  }[]
}
```

La diferencia principal es que `indices` se renombra a `cells` para coherencia con los puzzles artesanales.

---

## Estado y persistencia

### Clave de localStorage

```
mini-pips-state-v2
```

### Estructura del objeto guardado

```ts
{
  id:     string | number,  // puzzle.id — permite detectar si cambió el día
  diff:   string,           // dificultad activa ("easy" | "medium" | "hard")
  placed: (PlacedDomino | null)[],  // una entrada por dominó
  solved: boolean,
}

// PlacedDomino
{
  r1: number, c1: number,   // celda 1 (siempre la más arriba/izquierda)
  r2: number, c2: number,   // celda 2
}
```

### Lógica de carga

Al inicializar:

1. Se carga el JSON de `localStorage.getItem('mini-pips-state-v2')`.
2. Si `s.id !== puzzle.id` → se descarta (el puzzle del día ha cambiado).
3. Si coincide → se restauran `placed` y `cellMap` recalculando los valores de pip según `puzzle.dominoes[i]`.
4. Si no hay estado guardado → se empieza desde cero (`initState()`).

El estado guardado no incluye `cellMap` — se reconstruye en `loadState()` a partir de `placed` y `puzzle.dominoes`.

### Variables de estado en memoria

| Variable | Tipo | Descripción |
|---|---|---|
| `difficulty` | `'easy' \| 'medium' \| 'hard'` | Dificultad activa |
| `nytPuzzles` | `{ easy, medium, hard }` | Todos los puzzles del día |
| `puzzle` | `PuzzleObject` | Puzzle activo (apunta a `nytPuzzles[difficulty]`) |
| `placed` | `(PlacedDomino \| null)[]` | Posición de cada dominó en el tablero |
| `cellMap` | `{ "r,c": number }` | Valor pip en cada celda ocupada |
| `selectedDomino` | `number` | Índice del dominó seleccionado en la bandeja (`-1` = ninguno) |
| `rotation` | `0 \| 1 \| 2 \| 3` | Orientación del dominó seleccionado (0=H, 1=V, 2=H-flip, 3=V-flip) |
| `rotDeg` | `number` | Grados acumulados para la transición CSS suave (`--mp-rot`) |
| `targetCell` | `string \| null` | Primera celda del par durante colocación por click (`"r,c"`) |
| `solved` | `boolean` | Si el puzzle está resuelto |

---

## Tipos de restricción de región

La función `checkRegion(region, cellMap)` devuelve `true`, `false`, o `null` (incompleta):

| `type` | Condición para ganar |
|---|---|
| `sum` | Suma de todos los valores de la región === `target` |
| `greater` | Suma > `target` |
| `less` | Suma < `target` |
| `equals` | Todos los valores son iguales entre sí |
| `unequal` | Todos los valores son distintos entre sí |
| `empty` | Siempre válida (sin restricción) |

La suma se aplica a todas las celdas de la región. Para regiones de una sola celda, `sum`, `greater` y `less` equivalen a comparar el valor de esa celda directamente.

---

## Renderizado del tablero

### Rejilla CSS

El tablero se genera como CSS Grid. Las columnas y filas se calculan a partir del bounding box del conjunto de celdas del puzzle:

```js
boardEl.style.gridTemplateColumns = `repeat(${cols}, var(--mp-cell, 46px))`;
boardEl.style.gridTemplateRows    = `repeat(${rows}, var(--mp-cell, 46px))`;
```

Las celdas fuera del bounding box que no pertenecen al puzzle se renderizan como `mp__cell--ghost` (invisibles, solo ocupan espacio en el grid).

### Colores de región

Cada región recibe un color del array `REGION_COLORS` (15 colores), ciclando por índice (`ri % 15`). El color se aplica como custom property CSS `--rcolor` en el elemento celda:

```js
div.style.setProperty('--rcolor', REGION_COLORS[ri % REGION_COLORS.length]);
```

### Badge de restricción (diamante)

El badge de cada región se muestra en la primera celda (la de menor fila, menor columna). Es un cuadrado rotado 45° via CSS:

```css
.mp__label {
  transform: translate(-50%, -50%) rotate(45deg);
}
.mp__label-inner {
  transform: rotate(-45deg);   /* cancela la rotación para el texto */
}
```

El texto es generado por `labelText(region)`:

| Tipo | Texto mostrado |
|---|---|
| `sum` | el número del target (ej. `"7"`) |
| `greater` | `">N"` |
| `less` | `"<N"` |
| `equals` | `"="` |
| `unequal` | `"≠"` |

### PIP_MAP — disposición de los puntos

Cada celda tiene una rejilla 3×3 de 9 posiciones (0=arriba-izquierda … 8=abajo-derecha). `PIP_MAP` define qué posiciones se iluminan para cada valor 0–6:

```js
const PIP_MAP = {
  0: [],
  1: [4],           // centro
  2: [2, 6],        // diagonal
  3: [2, 4, 6],
  4: [0, 2, 6, 8],  // esquinas
  5: [0, 2, 4, 6, 8],
  6: [0, 3, 6, 2, 5, 8],  // dos columnas de 3
};
```

Los puntos apagados permanecen en el DOM con `opacity: 0` (en lugar de `display: none`) para no romper el auto-placement del grid CSS.

### Borde visual de dominó colocado

Cada mitad del dominó recibe una clase CSS que dibuja solo los bordes correspondientes a su lado:

| Clase | Lado del dominó | Bordes visibles |
|---|---|---|
| `mp__cell--dl` | izquierda (horizontal) | top, left, bottom (sin derecha) |
| `mp__cell--dr` | derecha (horizontal) | top, right, bottom (sin izquierda) |
| `mp__cell--dt` | arriba (vertical) | top, left, right (sin abajo) |
| `mp__cell--db` | abajo (vertical) | bottom, left, right (sin arriba) |

Los bordes se dibujan via `::after` pseudo-element para no interferir con el background de color de región.

---

## Interacción

### Colocación por click (dos clicks)

1. Click en dominó de la bandeja → lo selecciona (`selectedDomino = i`).
2. Click en primera celda del tablero → la marca como `targetCell`.
3. Click en celda adyacente → coloca el dominó (`placeDomino`).
   - Si la segunda celda no es adyacente (distancia Manhattan ≠ 1) → reasigna `targetCell` a la nueva celda.
4. Click en celda ya ocupada → levanta el dominó de vuelta a la bandeja (`liftDomino`).

### Colocación por drag & drop

El drag usa Pointer Events (`pointerdown`, `pointermove`, `pointerup`). El umbral de activación es 8px — por debajo se trata como click.

Durante el drag se crea un ghost element que sigue al puntero. La detección del snap funciona:
1. Busca la celda vacía del tablero más cercana al puntero (máx. 80px).
2. Busca la celda vecina vacía más cercana al punto medio entre el cursor y la celda anterior.
3. Resalta las dos celdas con `mp__cell--snap`.
4. Al soltar (`pointerup`), si hay snap válido → coloca el dominó.

### Rotación

- Click en dominó ya seleccionado → rota 90° (ciclo 0→1→2→3→0).
- Botón "↔ Girar" → mismo efecto.
- `rotation` afecta qué pip es el izquierdo/superior en `placeDomino`:
  - `rotation >= 2`: el par se invierte (`[right, left]` en lugar de `[left, right]`).

---

## Comprobación de victoria

`checkWin()` se llama tras cada colocación:

1. Comprueba que todas las celdas del puzzle estén en `cellMap`.
2. Llama a `checkRegion` en cada región — si alguna devuelve `false`, resalta esas celdas en rojo 1,2s y termina.
3. Si todas las regiones están OK → animación bounce en todas las celdas, mensaje "¡Puzzle resuelto! 🎉", guarda estado.

---

## Badge del día

`getDayIndex()` calcula los días transcurridos desde el 1 de enero de 2026 usando la hora local del cliente. El badge muestra `"día N"` (índice base 1).

Este cálculo es puramente local — no está ligado al ID del puzzle del NYT.

---

## Nota: puzzles artesanales en el código

El archivo contiene un array `PUZZLES` con 10 puzzles escritos a mano (5 fáciles, 3 medios, 2 difíciles) y la función `getDayIndex()` que los rotaba por días. Actualmente son **código muerto** — nada los referencia desde que se integró la fuente NYT. Se mantienen por si la API del NYT no está disponible en algún momento y se quiera restaurar un fallback local.
