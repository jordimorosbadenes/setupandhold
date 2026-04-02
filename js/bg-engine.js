/**
 * bg-engine.js — Motor compartido del fondo animado.
 *
 * Uso: initBgEngine(containerId, CFG, icons)
 *
 * CFG:
 *   COUNT              – número de elementos
 *   SIZE_MIN/MAX       – tamaño (px)
 *   DUR_MIN/MAX        – duración del ciclo de animación (s)
 *   DIST_MIN/MAX       – distancia de deriva (px)
 *   ROT_START_MIN/MAX  – ángulo inicial (deg)
 *   ROT_DELTA_MIN/MAX  – variación de rotación durante el ciclo (deg)
 *   SCALE_MIN/MAX      – factor de escala
 *   PEAK_OPACITY_MIN/MAX – opacidad pico
 *   SPEED_MULT         – multiplicador global de velocidad
 *   COLORS             – array de colores CSS (usa `currentColor`)
 *   ICON_OPACITY       – opacidad base del SVG (modo oscuro, 0-1)
 *   ICON_OPACITY_LIGHT – opacidad base del SVG (modo claro, 0-1)
 *   HOVER_OPACITY      – opacidad al hover
 *   HOVER_FREEZE       – true = congela posición al hacer hover
 *   HOVER_SHAKE        – true = vibra al hacer hover
 *   HOVER_SHAKE_PX     – amplitud del temblor (px)
 *   HOVER_SHAKE_SPEED  – duración del ciclo de temblor (ms). Menor = más rápido
 *   BLUR               – blur base del SVG (px). 0 = nítido
 *   HOVER_BLUR         – blur al hacer hover (px). 0 = sin blur extra
 *
 * El CSS de la página host debe definir:
 *   .container .bg-piece              { animation: bgDrift linear infinite; ... }
 *   .container .bg-piece.bg-piece--launching { animation: bgLaunch !important; ... }
 *   @keyframes bgDrift  { ... }
 *   @keyframes bgLaunch { ... }
 */
function initBgEngine(containerId, CFG, icons) {
    const rnd = (a, b) => a + Math.random() * (b - a);
    const bg = document.getElementById(containerId);
    if (!bg || !icons || !icons.length) return;

    // Cache de texto SVG para inyección inline — permite usar `currentColor`
    const svgCache = new Map();

    function makeInlineSvg(src, div) {
        const cached = svgCache.get(src);
        if (cached) {
            div.innerHTML = cached;
            return Promise.resolve();
        }
        return fetch(src)
            .then(r => r.text())
            .then(txt => {
                let sv = txt.replace(/<\?xml[^>]*>/g, '').trim();
                sv = sv.replace(/\s(width|height)="[^"]*"/gi, '');
                sv = sv.replace(/fill="[^"]*"/gi, 'fill="currentColor"');
                sv = sv.replace(/style="([^"]*)"/gi, (m, inner) => {
                    const out = inner.replace(/fill\s*:\s*[^;]+;?/gi, 'fill:currentColor;');
                    return `style="${out}"`;
                });
                svgCache.set(src, sv);
                div.innerHTML = sv;
            })
            .catch(() => {
                // Fallback: imagen normal si fetch/inlining falla
                const img = document.createElement('img');
                img.src = src;
                img.alt = '';
                img.draggable = false;
                div.appendChild(img);
            });
    }

    function spawnItem(immediate) {
        const src   = icons[Math.floor(Math.random() * icons.length)];
        const color = CFG.COLORS[Math.floor(Math.random() * CFG.COLORS.length)];
        const div   = document.createElement('div');
        div.className = 'bg-piece';
        div.style.color = color;
        makeInlineSvg(src, div);

        const sz = Math.round(rnd(CFG.SIZE_MIN, CFG.SIZE_MAX));
        div.style.width  = sz + 'px';
        div.style.height = sz + 'px';
        div.style.left   = (Math.random() * 100) + '%';
        div.style.top    = (Math.random() * 100) + '%';

        const dur   = rnd(CFG.DUR_MIN, CFG.DUR_MAX) * CFG.SPEED_MULT;
        const delay = immediate ? 0 : -Math.random() * dur;
        div.style.animationDuration = dur + 's';
        div.style.animationDelay    = delay + 's';

        const angle = Math.random() * Math.PI * 2;
        const dist  = rnd(CFG.DIST_MIN, CFG.DIST_MAX);
        div.style.setProperty('--dx',                 (Math.cos(angle) * dist) + 'px');
        div.style.setProperty('--dy',                 (Math.sin(angle) * dist) + 'px');
        div.style.setProperty('--r0',                 rnd(CFG.ROT_START_MIN, CFG.ROT_START_MAX) + 'deg');
        div.style.setProperty('--dr',                 rnd(CFG.ROT_DELTA_MIN,  CFG.ROT_DELTA_MAX)  + 'deg');
        div.style.setProperty('--s',                  rnd(CFG.SCALE_MIN, CFG.SCALE_MAX).toFixed(2));
        div.style.setProperty('--peak-o',             rnd(CFG.PEAK_OPACITY_MIN, CFG.PEAK_OPACITY_MAX).toFixed(2));
        div.style.setProperty('--icon-opacity',       String(CFG.ICON_OPACITY));
        div.style.setProperty('--icon-opacity-light', String(CFG.ICON_OPACITY_LIGHT));
        div.style.setProperty('--hover-opacity',      String(CFG.HOVER_OPACITY));
        div.style.setProperty('--blur',               (CFG.BLUR       ?? 0) + 'px');
        div.style.setProperty('--hover-blur',         (CFG.HOVER_BLUR ?? 0) + 'px');

        // ── Lanzamiento al hacer clic / tocar ──
        function launch(e) {
            if (div.classList.contains('bg-piece--launching')) return;
            if (div._shakeAnim) { div._shakeAnim.cancel(); div._shakeAnim = null; }
            div.style.animationPlayState = '';

            const bgRect = bg.getBoundingClientRect();
            const rect   = div.getBoundingClientRect();

            // Congela la posición visual actual y cancela el drift
            div.style.animation = 'none';
            div.style.left      = (rect.left - bgRect.left) + 'px';
            div.style.top       = (rect.top  - bgRect.top)  + 'px';
            div.style.opacity   = String(Math.max(parseFloat(getComputedStyle(div).opacity) || 0, 0.5));
            div.style.setProperty('--r0', '0deg');
            div.style.setProperty('--s',  '1');

            // Fuerza reflow para aplicar el estado antes de la animación de lanzamiento
            void div.getBoundingClientRect();

            // Dirección: desde el cursor hacia fuera (rebote)
            const cx  = rect.left + rect.width  / 2;
            const cy  = rect.top  + rect.height / 2;
            const ex  = e.clientX ?? (e.touches?.[0]?.clientX ?? cx);
            const ey  = e.clientY ?? (e.touches?.[0]?.clientY ?? cy);
            const ddx = cx - ex, ddy = cy - ey;
            const len = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
            const pwr = rnd(350, 650);
            div.style.setProperty('--lx',         (ddx / len * pwr) + 'px');
            div.style.setProperty('--ly',         (ddy / len * pwr) + 'px');
            div.style.setProperty('--lspin',      (rnd(300, 540) * (Math.random() < 0.5 ? 1 : -1)) + 'deg');
            div.style.setProperty('--launch-dur', rnd(0.45, 0.7) + 's');
            div.style.setProperty('--peak-o',     div.style.opacity);
            div.classList.add('bg-piece--launching');

            div.addEventListener('animationend', () => {
                div.remove();
                setTimeout(() => bg.appendChild(spawnItem(true)), rnd(200, 600));
            }, { once: true });
        }
        div.addEventListener('click',      launch);
        div.addEventListener('touchstart', launch, { passive: true });

        // ── Hover: congela posición + vibra (como si tuviera miedo) ──
        div.addEventListener('mouseenter', () => {
            if (div.classList.contains('bg-piece--launching')) return;
            div.classList.add('bg-piece--hovering');
            if (CFG.HOVER_FREEZE) {
                div.style.animationPlayState = 'paused';
                const cur = parseFloat(getComputedStyle(div).opacity) || 0;
                div.style.setProperty('opacity', String(Math.max(cur, 0.5)), 'important');
            }
            if (CFG.HOVER_SHAKE) {
                const px = CFG.HOVER_SHAKE_PX;
                div._shakeAnim = div.animate([
                    { translate: '0 0' },
                    { translate: `${px}px ${-px * 0.6}px` },
                    { translate: `${-px * 0.8}px ${px * 0.4}px` },
                    { translate: `${px * 0.5}px ${px}px` },
                    { translate: '0 0' },
                ], { duration: CFG.HOVER_SHAKE_SPEED, iterations: Infinity, easing: 'ease-in-out' });
            }
        });
        div.addEventListener('mouseleave', () => {
            if (div.classList.contains('bg-piece--launching')) return;
            div.classList.remove('bg-piece--hovering');
            if (CFG.HOVER_FREEZE) {
                div.style.removeProperty('opacity');
                div.style.animationPlayState = '';
            }
            if (div._shakeAnim) { div._shakeAnim.cancel(); div._shakeAnim = null; }
        });

        return div;
    }

    const frag = document.createDocumentFragment();
    for (let i = 0; i < CFG.COUNT; i++) frag.appendChild(spawnItem(false));
    bg.appendChild(frag);
}
