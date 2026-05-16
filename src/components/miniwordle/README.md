# MiniWordle — Documentación técnica

Componente Astro que implementa una versión del juego Wordle en español, integrada en la barra lateral de la página de inicio como uno de los minijuegos de `MiniGames.astro`.

---

## Estructura de ficheros

```
src/components/miniwordle/
└── MiniWordle.astro   ← componente único (HTML + CSS scoped + script inline)
```

El componente no tiene dependencias externas ni props. Todo — lista de palabras, lógica de juego, persistencia — vive dentro del único fichero `.astro`.

---

## De dónde vienen las palabras

### La lista

La lista de palabras está embebida directamente en el script del componente como un array JavaScript `WORDS`:

```js
const WORDS = [
  'ABRIR', 'ACASO', 'ACERO', ... 'SEÑAL',
];
```

Son **~235 palabras** de 5 letras en castellano, seleccionadas manualmente con los siguientes criterios:

- Exactamente 5 caracteres (en Unicode, no bytes).
- Sin tildes en vocales (á → A, é → E, etc.) para mantener el teclado simple.
- La **Ñ sí está incluida** como letra propia (SEÑAL, OTOÑO, BAÑAR, PIÑON, TEÑIR, AÑEJO).
- Palabras comunes del vocabulario español general, sin nombres propios ni términos muy técnicos.
- LL y CH se tratan como dos letras separadas (criterio actual de la RAE desde 1994), por eso CALLE = C-A-L-L-E son 5 letras.

### Selección de la palabra del día

La palabra diaria se calcula de forma **determinista en el cliente** a partir de la fecha:

```js
const getDayIndex = () => {
  const epoch = new Date('2026-01-01').getTime(); // fecha base fija
  const d = new Date();
  d.setHours(0, 0, 0, 0);                         // medianoche local
  return Math.max(0, Math.floor((d.getTime() - epoch) / 86400000));
};

const getTodayWord = () => WORDS[getDayIndex() % WORDS.length];
```

- **Época**: 1 de enero de 2026.
- **Índice**: número de días transcurridos desde la época, usando la medianoche del huso horario local del cliente.
- **Ciclo**: cuando el índice supera la longitud de la lista, vuelve a empezar (`% WORDS.length`).
- Con ~235 palabras, el ciclo completo dura aproximadamente **7,8 meses** antes de repetirse.

El badge `#N` que aparece en la cabecera muestra `getDayIndex() + 1` (empezando en #1 el 1 de enero de 2026).

> **Importante:** la palabra se recalcula en el dispositivo del usuario en función de su hora local. Dos usuarios en zonas horarias muy distintas podrían ver palabras distintas durante la hora del cambio de día.

---

## Estado y persistencia

### Clave de localStorage

```
mini-wordle-state-v1
```

### Estructura del objeto guardado

```ts
{
  date:         string,   // "YYYY-MM-DD" – fecha local del día activo
  word:         string,   // palabra de ese día (5 letras, mayúsculas)
  guesses:      string[], // palabras enviadas (máximo 6)
  currentInput: string,   // letras escritas en la fila activa (0–5 chars)
  status:       "playing" | "won" | "lost"
}
```

### Lógica de carga

Al inicializar el componente:

1. Se intenta leer y parsear `localStorage.getItem('mini-wordle-state-v1')`.
2. Si existe y su campo `date` coincide con la fecha local de hoy → **se restaura el estado guardado**.
3. Si no existe, o `date` es otro día → **se crea un estado nuevo** con la palabra del día actual.

Cualquier excepción (JSON malformado, `localStorage` no disponible) también genera un estado nuevo.

Esto garantiza que:
- El progreso del día persiste si recargas la página.
- Al cambiar de día, la partida anterior se descarta automáticamente y empieza una nueva.

---

## Algoritmo de evaluación

La función `evaluate(guess, word)` devuelve un array de 5 estados (`'correct'`, `'present'`, `'absent'`) y es la pieza central del juego. Implementa el algoritmo estándar de Wordle con **dos pasadas** para manejar letras duplicadas correctamente:

### Pasada 1 — coincidencias exactas

```js
for (let i = 0; i < 5; i++) {
  if (guess[i] === word[i]) {
    result[i]    = 'correct';
    wordUsed[i]  = true;   // esta posición de la palabra ya está "consumida"
    guessUsed[i] = true;   // esta posición del intento también
  }
}
```

### Pasada 2 — letras presentes en otra posición

```js
for (let i = 0; i < 5; i++) {
  if (guessUsed[i]) continue; // ya marcado como 'correct'
  for (let j = 0; j < 5; j++) {
    if (!wordUsed[j] && guess[i] === word[j]) {
      result[i]   = 'present';
      wordUsed[j] = true; // consumir esta ocurrencia de la letra
      break;
    }
  }
}
```

Las posiciones que no coincidan en ninguna pasada quedan como `'absent'`.

El uso de los arrays `wordUsed` y `guessUsed` evita que una misma letra de la palabra "consuma" dos letras del intento, que es el comportamiento correcto cuando hay letras repetidas.

---

## Colores de retroalimentación

Los tres estados se mapean a estilos CSS usando el sistema de variables del tema del sitio:

| Estado | Color | CSS |
|---|---|---|
| `correct` – posición correcta | Verde (`--accent`) | `color-mix(in srgb, var(--accent) 30%, var(--card))` |
| `present` – letra presente, posición incorrecta | Ámbar | `color-mix(in srgb, #f0b429 35%, var(--card))` |
| `absent` – letra no en la palabra | Gris tenue | `color-mix(in srgb, var(--muted) 18%, var(--card))` |

Los mismos tres estados se aplican a las teclas del teclado virtual vía el atributo `data-kstate`. El teclado mantiene **la mejor puntuación alcanzada** para cada letra: si una letra fue `absent` en un intento pero `correct` en otro, la tecla mostrará `correct`.

```js
const prio = { correct: 3, present: 2, absent: 1 };
// Solo se actualiza si el nuevo estado tiene mayor prioridad
if (!best[ch] || prio[s] > prio[best[ch]]) best[ch] = s;
```

---

## Animaciones

Todas las animaciones son CSS puras, añadidas y eliminadas dinámicamente via `classList`:

| Clase CSS | Keyframe | Duración | Cuándo se usa |
|---|---|---|---|
| `mw__cell--pop` | escala 1 → 1.13 → 1 | 130 ms | al escribir una letra |
| `mw__cell--flip` | `scaleY` 1 → 0 → 1 | 500 ms | al revelar una fila (escalonado) |
| `mw__cell--shake` | traslación X ±5 px | 400 ms | palabra inválida o incompleta |
| `mw__cell--bounce` | traslación Y –9 px | 550 ms | al ganar la partida |

**Revelación escalonada**: cada celda de una fila se revela con un retardo de `columna × 110 ms`. El cambio de color (`data-state`) se aplica a los 240 ms, en el punto medio del flip (cuando la celda tiene `scaleY(0)` y no es visible). La callback `onDone` se ejecuta tras `(4 × 110) + 550 = 990 ms`.

Para evitar que una animación no se reinicie si la clase ya existe (por ejemplo, dos shakes seguidos), se usa el patrón:

```js
cell.classList.remove('mw__cell--shake');
void cell.offsetWidth; // fuerza un reflow, reinicia la animación
cell.classList.add('mw__cell--shake');
```

---

## Teclado

### Virtual (on-screen)

Layout español en 3 filas:

```
Q  W  E  R  T  Y  U  I  O  P
A  S  D  F  G  H  J  K  L  Ñ
↵  Z  X  C  V  B  N  M  ⌫
```

Cada botón tiene el atributo `data-key` con la letra (o `ENTER` / `BACKSPACE`). El script añade el listener de click sobre todos los `[data-key]` al inicializar.

Las teclas de acción (↵ y ⌫) tienen `flex: 1.6` vs. `flex: 1` de las letras normales, de modo que toda la fila rellena el ancho del componente sin overflow.

### Físico

El componente añade un listener `keydown` al `document`. Antes de procesar cualquier tecla comprueba:

1. `isActive()`: el panel padre no tiene la clase `mg__panel--hidden` (cuando el juego está oculto por `MiniGames`, no captura teclas).
2. El foco no está en un `<input>` o `<textarea>` (para no interferir con el formulario de nombre del Mini-2048).

Las letras acentuadas físicas se normalizan: Á→A, É→E, Í→I, Ó→O, Ú→U. La Ñ física (`e.key === 'ñ'` o `'Ñ'`) se acepta directamente como `'Ñ'`.

---

## CSS y scoping de Astro

Los estilos del componente están en una etiqueta `<style>` estándar de Astro, que por defecto aplica **scoping automático** (añade un atributo `data-astro-cid-xxx` a los elementos del template y a los selectores CSS).

Dado que **todos los elementos del DOM** (celdas, teclas) son parte del template Astro estático, ya tienen el atributo de scoping al renderizarse. Cuando el script JS añade clases dinámicamente (`.mw__cell--pop`, `data-kstate`, etc.), los selectores scoped siguen funcionando porque el atributo ya existe en el elemento.

Esto contrasta con el Mini-2048, que crea elementos dinámicamente (tiles, filas del leaderboard) y por eso necesita `:global()` en su CSS.

---

## Validación de palabras

Solo se aceptan como intentos válidos palabras que estén en la lista `WORDS`. Si el jugador introduce una combinación de letras no reconocida, aparece el mensaje "Palabra no válida" y la fila tiembla con `mw__cell--shake`.

No hay distinción entre "lista de respuestas" y "lista de intentos válidos": la misma lista sirve para ambos propósitos.

---

## Mensajes de feedback

| Situación | Texto | Tipo | Duración |
|---|---|---|---|
| Menos de 5 letras al pulsar ↵ | "Faltan letras" | `error` | 1500 ms |
| Palabra no en la lista | "Palabra no válida" | `error` | 1500 ms |
| Victoria en fila 0 | "¡Increíble!" | `success` | persistente |
| Victoria en fila 1 | "¡Excelente!" | `success` | persistente |
| Victoria en fila 2 | "¡Muy bien!" | `success` | persistente |
| Victoria en fila 3 | "¡Genial!" | `success` | persistente |
| Victoria en fila 4 | "¡Bien!" | `success` | persistente |
| Victoria en fila 5 | "¡Uf, por poco!" | `success` | persistente |
| Derrota | "Era: XXXXX" | `error` | persistente |
| Carga con victoria previa | "¡Ya ganaste hoy! Nueva palabra mañana." | `success` | persistente |

Los mensajes persistentes (duración 0) no se borran automáticamente y representan el estado final de la partida.

---

## Inicialización

El script usa el patrón IIFE (`(() => { ... })()`), sin módulos ES, para ser compatible con `is:inline`. Esto significa que el script se inyecta literalmente en el HTML sin procesado por Vite/Rollup.

La función `initWordle(root)` se llama para cada elemento `.mw` encontrado en el documento:

```js
document.querySelectorAll('.mw').forEach(initWordle);
```

El flag `root.dataset.mwInit = '1'` evita doble inicialización si por alguna razón el script se ejecutase dos veces sobre el mismo elemento.
