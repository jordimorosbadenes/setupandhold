// ============================================================
//  CONFIGURACIÓN DE VALORES POR DEFECTO DE RELLENO
//  Edita este bloque para cambiar los valores iniciales de cada
//  tipo de relleno según el tipo de puzzle y forma de pieza.
//
//  CLAVES DE PUZZLE:
//    'normal'    → puzzle normal (piezas rectangulares)
//    'fractal_0' → puzzle fractal, piezas circulares
//    'fractal_1' → puzzle fractal, piezas cuadradas
//    'fractal_2' → puzzle fractal, piezas octagonales
//
//  PARÁMETROS COMUNES (aplican a todos los rellenos excepto Sólido):
//    infill_wall          → grosor de la pared exterior de la pieza (mm)
//
//  PARÁMETROS POR TIPO DE RELLENO:
//    hollow   → (sin parámetros extra)
//    grid     → infill_fill_width  grosor línea rejilla (mm)
//               infill_spacing     separación entre líneas (mm)
//               infill_angle       ángulo de rotación (°)
//    stripes  → infill_fill_width_s  ancho de cada raya (mm)
//               infill_spacing_s    separación entre rayas (mm)
//               infill_angle        ángulo de rotación (°)
//    zigzag   → infill_fill_width_z  grosor línea zigzag (mm)
//               infill_spacing_z    separación entre líneas (mm)
//               infill_amplitude    amplitud del zigzag (mm)
//               infill_angle        ángulo de rotación (°)
//    honeycomb→ infill_fill_width_h  grosor pared celda hexagonal (mm)
//               infill_cell_size    tamaño de cada celda (mm)
//               infill_angle        ángulo de rotación (°)
//    circles  → infill_fill_width_c  grosor del anillo de cada círculo (mm)
// ============================================================
const INFILL_DEFAULTS = {
    // ── PUZZLE NORMAL (piezas rectangulares) ─────────────────
    normal: {
        common:    { infill_wall: 2.0 },
        hollow:    {},
        grid:      { infill_fill_width: 1.0,  infill_spacing: 3.5,  infill_angle: 45 },
        stripes:   { infill_fill_width_s: 1.5, infill_spacing_s: 2.0, infill_angle: 45 },
        zigzag:    { infill_fill_width_z: 1.5, infill_spacing_z: 1.5, infill_amplitude: 1.0, infill_angle: 45 },
        honeycomb: { infill_fill_width_h: 0.5, infill_cell_size: 4.0, infill_angle: 45 },
        circles:   { infill_fill_width_c: 2.2 },
    },
    // ── FRACTAL — piezas CIRCULARES (arc_shape = 0) ──────────
    fractal_0: {
        common:    { infill_wall: 1.5 },
        hollow:    {},
        grid:      { infill_fill_width: 1.0,  infill_spacing: 3.0,  infill_angle: 0 },
        stripes:   { infill_fill_width_s: 1.0, infill_spacing_s: 1.5, infill_angle: 0 },
        zigzag:    { infill_fill_width_z: 1.0, infill_spacing_z: 1.5, infill_amplitude: 1.0, infill_angle: 0 },
        honeycomb: { infill_fill_width_h: 0.5, infill_cell_size: 3.5, infill_angle: 0 },
        circles:   { infill_fill_width_c: 1.7 },
    },
    // ── FRACTAL — piezas CUADRADAS (arc_shape = 1) ───────────
    fractal_1: {
        common:    { infill_wall: 1.5 },
        hollow:    {},
        grid:      { infill_fill_width: 1.0,  infill_spacing: 3.0,  infill_angle: 0 },
        stripes:   { infill_fill_width_s: 1.0, infill_spacing_s: 1.5, infill_angle: 0 },
        zigzag:    { infill_fill_width_z: 1.0, infill_spacing_z: 1.5, infill_amplitude: 1.0, infill_angle: 0 },
        honeycomb: { infill_fill_width_h: 0.5, infill_cell_size: 3.5, infill_angle: 0 },
        circles:   { infill_fill_width_c: 2.33 },
    },
    // ── FRACTAL — piezas OCTAGONALES (arc_shape = 2) ─────────
    fractal_2: {
        common:    { infill_wall: 1.5 },
        hollow:    {},
        grid:      { infill_fill_width: 1.0,  infill_spacing: 3.0,  infill_angle: 0 },
        stripes:   { infill_fill_width_s: 1.0, infill_spacing_s: 1.5, infill_angle: 0 },
        zigzag:    { infill_fill_width_z: 1.0, infill_spacing_z: 1.5, infill_amplitude: 1.0, infill_angle: 0 },
        honeycomb: { infill_fill_width_h: 0.5, infill_cell_size: 3.5, infill_angle: 0 },
        circles:   { infill_fill_width_c: 1.7 },
    },
    // ── JIGSAW ───────────────────────────────────────────────
    jigsaw: {
        common:    { infill_wall: 1.5 },
        hollow:    {},
        grid:      { infill_fill_width: 1.0,  infill_spacing: 3.0,  infill_angle: 0 },
        stripes:   { infill_fill_width_s: 1.0, infill_spacing_s: 1.5, infill_angle: 0 },
        zigzag:    { infill_fill_width_z: 1.0, infill_spacing_z: 1.5, infill_amplitude: 1.0, infill_angle: 0 },
        honeycomb: { infill_fill_width_h: 0.5, infill_cell_size: 3.5, infill_angle: 0 },
        circles:   { infill_fill_width_c: 1.7 },
    },
};
// ============================================================

// ============================================================
//  PARÁMETROS DE VISUALIZACIÓN (isométrico / plano / 2D)
//  Modifica estos valores para ajustar la apariencia de los
//  visores de puzzle sin tocar el resto del código.
// ============================================================
const VIEWER_PARAMS = {
    // ── Isométrico ──────────────────────────────────────────
    /** Factor de altura de extrusión relativo al tamaño del puzzle */
    extrudeHeightFactor: 0.08,
    /** Factor de margen de borde de la base respecto al tamaño del puzzle */
    baseBorderFactor: 0.06,
    /** Margen en píxeles alrededor del puzzle proyectado */
    isoMarginPx: 30,
    /** Segmentos para circular contoured base en isométrico */
    circleBaseSegments: 72,
    /** Segmentos para clip circular en isométrico */
    circleClipSegments: 72,
    /** Grosor de línea de contorno de pieza (factor sobre fitScale × coordSize) */
    pieceStrokeWidthFactor: 0.002,
    /** Color base de la plataforma */
    baseColor: '#d0d4dc',
    /** Oscurecimiento lateral derecho (deltas relativos de shade) */
    baseShadeRight: -30,
    /** Oscurecimiento lateral izquierdo */
    baseShadeLeft: -15,
    /** Gradiente superior de la base */
    baseTopGradient: ['#e0e4ec', -8],

    // ── Vista plana (flat / SVG) ────────────────────────────
    /** Padding en el viewBox SVG (factor sobre tamaño puzzle) */
    flatPadFactor: 0.05,
    /** Margen de borde de la base en flat (factor) */
    flatBaseBorderFactor: 0.04,
    /** Grosor de trazo de borde de base (factor) */
    flatBaseStrokeFactor: 0.004,
    /** Grosor de trazo de pieza (factor) */
    flatStrokeFactor: 0.002,

    // ── Visor 2D acabados ───────────────────────────────────
    /** Padding en píxeles para el visor 2D */
    viewer2DPadPx: 20,
};

// ============================================================
//  VALORES POR DEFECTO DE TODOS LOS CONTROLES DE LA UI
//  Edita este bloque para cambiar cualquier valor inicial.
//  Las claves son directamente los IDs de los elementos HTML.
//  Se aplican automáticamente al cargar la página.
// ============================================================
const DEFAULTS = {
    // ── Dimensiones del puzzle ─────────────────────────────
    _puzzle: {
        normal:  { M: 6,  N: 7,  min_size: 3, max_size: 4 },
        fractal: { M: 8,  N: 8,  min_size: 3, max_size: 6 },
        jigsaw:  { M: 5,  N: 7,  min_size: 3, max_size: 5 },
        sliding: { M: 3,  N: 3 }
    },

    // ── Piezas (puzzle normal/fractal/jigsaw) ──────────────
    stl_cube_size:              10,
    stl_height:                 3,
    stl_tolerance:              0.3,
    stl_corner_style:           'round',    // sharp | round | chamfer
    stl_corner_radius:          1.0,
    stl_corner_inner:           false,        // also apply to concave corners
    stl_color_pieces:           '#00998A',
    stl_color_relief:           '#C1B399',
    piece_chamfer_top_on:       false,
    piece_chamfer_top:          0.5,
    piece_chamfer_bottom_on:    false,
    piece_chamfer_bottom:       0.5,

    // ── Base (puzzle normal/fractal/jigsaw) ────────────────
    stl_border:                 5,
    stl_base_thickness:         1,
    stl_wall_height:            3,
    stl_base_corner_style:      'round',    // sharp | round | chamfer (exterior)
    stl_base_corner_style_inner:'round',    // sharp | round | chamfer (interior)
    base_inner_same_as_piece:   true,         // mirror piece corner for interior
    stl_base_corner_radius:     2.5,
    stl_base_corner_radius_inner: 1.0,
    stl_color_base:             '#808080',
    base_chamfer_top_outer_on:      false,
    base_chamfer_top_outer:         0.5,
    base_chamfer_top_inner_on:      false,
    base_chamfer_top_inner:         0.5,
    base_chamfer_bottom_outer_on:   false,
    base_chamfer_bottom_outer:      0.5,

    // ── Slider — piezas ────────────────────────────────────
    sliding_cell_size:          20,
    sliding_clearance:          0.3,
    sliding_piece_height:       8.0,
    sliding_corner_style:       'round',    // sharp | round | chamfer
    sliding_corner_radius:      1.0,
    sliding_stem_height:        1.0,
    sliding_cap_height:         1.0,
    sliding_overhang:           3.0,
    sliding_shift_direction:    'br',       // br | bl | tr | tl
    sliding_piece_chamfer_top_on:    false,
    sliding_piece_chamfer_top:       0.3,
    sliding_piece_chamfer_bottom_on: false,
    sliding_piece_chamfer_bottom:    0.3,

    // ── Slider — base ──────────────────────────────────────
    sliding_frame_border:       5,
    sliding_floor_height:       1.0,
    sliding_base_corner_style:  'round',    // sharp | round | chamfer
    sliding_base_corner_style_inner: 'round', // sharp | round | chamfer (interior)
    sliding_base_inner_same_as_piece: true,     // mirror piece corner for interior
    sliding_base_corner_radius: 2.0,
    sliding_base_corner_radius_inner: 1.0,
    sliding_base_chamfer_top_outer_on:      true,
    sliding_base_chamfer_top_outer:         1.0,
    sliding_base_chamfer_top_inner_on:      false,
    sliding_base_chamfer_top_inner:         1.0,
    sliding_base_chamfer_bottom_outer_on:   true,
    sliding_base_chamfer_bottom_outer:      1.0,
    sliding_base_chamfer_bottom_inner_on:   false,
    sliding_base_chamfer_bottom_inner:      1.0,
    sliding_empty_corner:       'br',       // br | bl | tr | tl

    // ── Jigsaw específico ──────────────────────────────────
    jigsaw_type:                'rectangular', // rectangular | hexagonal | circular
    jigsaw_rings:               4,
    jigsaw_tab_size:            25,
    jigsaw_jitter:              0,
    jigsaw_truncate_edge:       true,
    jigsaw_contoured_base:      true,

    // ── Acabados — relleno ─────────────────────────────────
    stl_infill_type:            'solid',
    stl_infill_wall:            2,
    stl_infill_fill_width:      1,      stl_infill_spacing:          4,      stl_infill_angle_grid:       0,
    stl_infill_fill_width_s:    1.5,    stl_infill_spacing_s:        3,      stl_infill_angle_stripes:    0,
    stl_infill_fill_width_z:    1,      stl_infill_spacing_z:        3,      stl_infill_amplitude:        2,      stl_infill_angle_zigzag: 0,
    stl_infill_fill_width_h:    1,      stl_infill_cell_size:        5,      stl_infill_angle_honeycomb:  0,
    stl_infill_circle_radius:   40,     stl_infill_fill_width_c:     2,      stl_infill_circle_filled:    true,

    // ── Acabados — textura ─────────────────────────────────
    stl_texture_type:           'solid',
    stl_texture_direction:      'outward',
    stl_texture_height:         0.6,
    stl_texture_wall:           0.5,
    stl_texture_no_border:      false,
    stl_texture_invert:         false,
    stl_texture_engrave_depth:  0.4,
    stl_texture_fill_width_grid:     1,   stl_texture_spacing_grid:        4,   stl_texture_angle_grid:       0,
    stl_texture_fill_width_stripes:  1.5, stl_texture_spacing_stripes:     3,   stl_texture_angle_stripes:    0,
    stl_texture_fill_width_zigzag:   1,   stl_texture_spacing_zigzag:      3,   stl_texture_amplitude:        2,   stl_texture_angle_zigzag: 0,
    stl_texture_fill_width_honeycomb:1,   stl_texture_cell_size:           5,   stl_texture_angle_honeycomb:  0,
    stl_texture_circle_radius:  40,       stl_texture_fill_width_circles:  2,   stl_texture_circle_filled:    true,

    // ── Acabados — imagen ──────────────────────────────────
    stl_image_direction:        'outward',
    stl_image_height:           0.6,
    stl_image_wall:             0.5,
    stl_image_no_border:        false,
    stl_image_engrave_depth:    0.4,
    stl_texture_custom_zoom:    100,
    stl_texture_custom_threshold: 128,
    stl_image_already_bw:       false,
    stl_texture_custom_blur:    true,
    stl_image_line_thickness:   0,

    // ── Visor ──────────────────────────────────────────────
    stl_assembled:              true,
    inline3d_show_base:         true,
    inline3d_free_camera:       false,

    // ── Varios ─────────────────────────────────────────────
    arc_shape:                  '0',
    border_prob:                '0',
    air_prob:                   '0',
    target_solutions:           '0',
};

/**
 * Aplica todos los valores de DEFAULTS a los elementos HTML.
 * Llama a esta función al cargar la página.
 */
function applyDefaults() {
    for (var id in DEFAULTS) {
        if (id.startsWith('_')) continue;
        var el = document.getElementById(id);
        if (!el) continue;
        var val = DEFAULTS[id];
        if (el.type === 'checkbox') {
            el.checked = val;
            el.defaultChecked = val;
        } else {
            el.value = val;
            el.defaultValue = String(val);
        }
        // Sync linked range ↔ number pairs
        var linked = el.getAttribute('data-link');
        if (linked) {
            var partner = document.getElementById(linked);
            if (partner) { partner.value = val; partner.defaultValue = String(val); }
        }
        // Also check if a range has this element as its data-link target
        var rangePair = document.querySelector('input[type="range"][data-link="' + id + '"]');
        if (rangePair) { rangePair.value = val; rangePair.defaultValue = String(val); }
    }
}
applyDefaults();
// Sync checkbox-controlled inputs: enable/disable number inputs based on checkbox state
['piece_chamfer_top', 'piece_chamfer_bottom',
 'base_chamfer_top_outer', 'base_chamfer_top_inner', 'base_chamfer_bottom_outer',
 'sliding_piece_chamfer_top', 'sliding_piece_chamfer_bottom',
 'sliding_base_chamfer_top_outer', 'sliding_base_chamfer_top_inner',
 'sliding_base_chamfer_bottom_outer', 'sliding_base_chamfer_bottom_inner'].forEach(function(id) {
    var cb = document.getElementById(id + '_on');
    var num = document.getElementById(id);
    if (cb && num) num.disabled = !cb.checked;
});

// Estado global
let puzzleData = {
    grid: null,
    pieces: null,
    solutions: [],         // array of solution piece-arrays
    currentSolutionPage: 0,
    galleryPage: 0,        // current gallery page
    viewMode: 'isometric',
    puzzleType: 'normal',  // 'normal' | 'fractal' | 'jigsaw'
    arcsData: null,        // arcos fractal para STL
    svgPaths: null,        // SVG path 'd' strings para renderizado fractal
    fractalNcols: 0,
    fractalNrows: 0
};

const PIECE_COLORS = [
    "#FF6666", "#FFCC66", "#99CC66", "#66CCCC", "#6699CC",
    "#CC99CC", "#FF99CC", "#CCCCCC", "#99CC99", "#CC6666",
    "#99CCCC", "#CC9966", "#66CC99", "#9966CC", "#9999CC",
    "#FF9966", "#FF6699", "#66FF99", "#99FFCC", "#FFCC99"
];

// Colores de sombra (versiones oscuras)
const SHADOW_COLORS = PIECE_COLORS.map(c => {
    const r = parseInt(c.slice(1, 3), 16);
    const g = parseInt(c.slice(3, 5), 16);
    const b = parseInt(c.slice(5, 7), 16);
    return `rgb(${Math.max(0, r-50)}, ${Math.max(0, g-50)}, ${Math.max(0, b-50)})`;
});

// Canvas variables
const puzzleCanvas = document.getElementById('puzzle-canvas');
const galleryCanvas = document.getElementById('gallery-canvas');
const puzzleCtx = puzzleCanvas.getContext('2d');
const galleryCtx = galleryCanvas.getContext('2d');

// Event Listeners
document.getElementById('generate-btn').addEventListener('click', generatePuzzle);
document.getElementById('solve-10-btn').addEventListener('click', () => findSolutions(10));
document.getElementById('solve-50-btn').addEventListener('click', () => findSolutions(50));
document.getElementById('sol-prev-page').addEventListener('click', prevSolutionPage);
document.getElementById('sol-next-page').addEventListener('click', nextSolutionPage);
const exportStlBtn = document.getElementById('export-stl-btn');
if (exportStlBtn) exportStlBtn.addEventListener('click', exportSTL);

// New download buttons
const exportPiecesBtn = document.getElementById('export-stl-pieces-btn');
const exportBaseBtn   = document.getElementById('export-stl-base-btn');
const exportBothSingleBtn  = document.getElementById('export-stl-both-single-btn');
const exportBothSeparateBtn = document.getElementById('export-stl-both-separate-btn');
if (exportPiecesBtn) exportPiecesBtn.addEventListener('click', () => exportSTL('pieces'));
if (exportBaseBtn)   exportBaseBtn.addEventListener('click',   () => exportSTL('base'));
if (exportBothSingleBtn)  exportBothSingleBtn.addEventListener('click',  () => exportSTL('both'));
if (exportBothSeparateBtn) exportBothSeparateBtn.addEventListener('click', exportSTLSeparate);

// 3MF multi-color download button
const export3mfBtn = document.getElementById('export-3mf-btn');
if (export3mfBtn) export3mfBtn.addEventListener('click', export3MF);

// Ripple effect for btn-t1 buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-t1')) {
        const button = e.target;
        
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // Get button dimensions and click position
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        // Set ripple size and position
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Add ripple to button
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Utility Functions: status por sección
function showStatus(elementId, message, type = 'info') {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.className = `status ${type}`;
    }
    console.log(`[${elementId}:${type}]`, message);
}

function showGenerateStatus(message, type = 'info') {
    showStatus('status-generate', message, type);
}

function showSolutionsStatus(message, type = 'info') {
    showStatus('status-solutions', message, type);
}

function showExportStatus(message, type = 'info') {
    showStatus('status-viewer', message, type);
}

function showDownloadStatus(message, type = 'info') {
    showStatus('status-download', message, type);
}

function onTargetSolutionsChange(value) {
    const disclaimer = document.getElementById('target-disclaimer');
    if (disclaimer) {
        disclaimer.style.display = value === '1' ? 'block' : 'none';
    }
}

const PUZZLE_DEFAULTS = DEFAULTS._puzzle;

function switchPuzzleType(value) {
    document.getElementById('btn-type-normal').classList.toggle('active', value === 'normal');
    document.getElementById('btn-type-fractal').classList.toggle('active', value === 'fractal');
    document.getElementById('btn-type-jigsaw').classList.toggle('active', value === 'jigsaw');
    document.getElementById('btn-type-sliding').classList.toggle('active', value === 'sliding');

    // Apply per-type defaults
    const defs = PUZZLE_DEFAULTS[value] || PUZZLE_DEFAULTS.normal;
    document.getElementById('M').value = defs.M;
    document.getElementById('N').value = defs.N;
    if (defs.min_size !== undefined) document.getElementById('min_size').value = defs.min_size;
    if (defs.max_size !== undefined) document.getElementById('max_size').value = defs.max_size;

    onPuzzleTypeChange(value);
}

function onPuzzleTypeChange(value) {
    const normalOnlyEls = document.querySelectorAll('.normal-only');
    const fractalOnlyEls = document.querySelectorAll('.fractal-only');
    const jigsawOnlyEls = document.querySelectorAll('.jigsaw-only');
    const slidingOnlyEls = document.querySelectorAll('.sliding-only');
    const nonSlidingEls = document.querySelectorAll('.non-sliding');
    const solutionsPanel = document.getElementById('solutions-panel');
    const isFractal = value === 'fractal';
    const isJigsaw = value === 'jigsaw';
    const isSliding = value === 'sliding';

    normalOnlyEls.forEach(el => {
        el.style.display = (isFractal || isJigsaw || isSliding) ? 'none' : '';
    });
    fractalOnlyEls.forEach(el => {
        el.style.display = isFractal ? '' : 'none';
    });
    jigsawOnlyEls.forEach(el => {
        el.style.display = isJigsaw ? '' : 'none';
    });
    slidingOnlyEls.forEach(el => {
        el.style.display = isSliding ? '' : 'none';
    });
    nonSlidingEls.forEach(el => {
        el.style.display = isSliding ? 'none' : '';
    });
    // Hide min/max size for jigsaw and sliding
    const minGroup = document.getElementById('min_size').closest('.form-group');
    const maxGroup = document.getElementById('max_size').closest('.form-group');
    if (minGroup) minGroup.style.display = (isJigsaw || isSliding) ? 'none' : '';
    if (maxGroup) maxGroup.style.display = (isJigsaw || isSliding) ? 'none' : '';
    if (solutionsPanel) {
        solutionsPanel.style.display = (isFractal || isJigsaw || isSliding) ? 'none' : '';
    }
    // Toggle canvas vs SVG containers
    setFractalVisibility(isFractal || isJigsaw);
    // Update jigsaw sub-type visibility
    if (isJigsaw) onJigsawTypeChange();

    // Hide normal piece/base dims panels for sliding (they use PIP-specific params)
    // Hide normal piece/base dims panels for sliding (they use PIP-specific params)
    const panelPiece = document.getElementById('panel-piece-settings');
    const panelBase = document.getElementById('panel-base-settings');
    if (panelPiece) panelPiece.style.display = isSliding ? 'none' : '';
    if (panelBase) panelBase.style.display = isSliding ? 'none' : '';
    // sliding-only and non-sliding panels are handled via their CSS classes above

    // Reset isometric viewer when puzzle type changes
    const puzzleCanvas = document.getElementById('puzzle-canvas');
    const fractalSvg = document.getElementById('fractal-puzzle-svg');
    const configHint = document.getElementById('config-viewer-hint');
    
    if (puzzleCanvas) {
        const ctx = puzzleCanvas.getContext('2d');
        ctx.clearRect(0, 0, puzzleCanvas.width, puzzleCanvas.height);
    }
    if (fractalSvg) {
        fractalSvg.innerHTML = '';
    }
    if (configHint) {
        configHint.style.display = '';
    }

    // Reset 3D viewer camera so it auto-fits next time section opens
    viewerHasModel = false;

    // Regenerate stock puzzle for mini-viewers when puzzle type changes
    if (typeof window.onPuzzleTypeChangeMiniViewers === 'function') {
        window.onPuzzleTypeChangeMiniViewers(value);
    }
}

function onJigsawTypeChange() {
    const jtype = document.getElementById('jigsaw_type');
    const isHexOrCircular = jtype && (jtype.value === 'hexagonal' || jtype.value === 'circular');
    // Rows/Cols (M,N) are for rectangular; rings for hexagonal/circular
    const mGroup = document.getElementById('M').closest('.form-group');
    const nGroup = document.getElementById('N').closest('.form-group');
    if (mGroup) mGroup.style.display = isHexOrCircular ? 'none' : '';
    if (nGroup) nGroup.style.display = isHexOrCircular ? 'none' : '';
    document.querySelectorAll('.jigsaw-hex-only').forEach(el => {
        el.style.display = isHexOrCircular ? '' : 'none';
    });
}

async function generatePuzzle() {
    try {
        showGenerateStatus('⏳ Generando puzzle...', 'info');

        // Reveal animation: cubrir el visor mientras se genera (corre en paralelo con la API)
        const revealEl = document.getElementById('viewer-reveal');
        revealEl.className = 'viewer-reveal is-entering';
        const revealReady = new Promise(r => setTimeout(r, 180));

        const puzzleType = document.getElementById('btn-type-sliding').classList.contains('active') ? 'sliding'
            : document.getElementById('btn-type-jigsaw').classList.contains('active') ? 'jigsaw'
            : document.getElementById('btn-type-fractal').classList.contains('active') ? 'fractal' : 'normal';
        const M = parseInt(document.getElementById('M').value);
        const N = parseInt(document.getElementById('N').value);
        const min_size = parseInt(document.getElementById('min_size').value);
        const max_size = parseInt(document.getElementById('max_size').value);

        let data;

        if (puzzleType === 'sliding') {
            // Generar puzzle sliding
            const empty_corner = document.getElementById('sliding_empty_corner').value;
            const response = await fetch('/api/generate_sliding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rows: M, cols: N, empty_corner })
            });
            data = await response.json();
        } else if (puzzleType === 'jigsaw') {
            // Generar puzzle jigsaw
            const jigsaw_type = document.getElementById('jigsaw_type').value;
            const tab_size = parseInt(document.getElementById('jigsaw_tab_size').value);
            const jitter = parseInt(document.getElementById('jigsaw_jitter').value);
            const body = { jigsaw_type, tab_size, jitter, min_size, max_size };
            if (jigsaw_type === 'hexagonal' || jigsaw_type === 'circular') {
                body.rings = parseInt(document.getElementById('jigsaw_rings').value);
                body.circle_warp = (jigsaw_type === 'circular');
                body.truncate_edge = document.getElementById('jigsaw_truncate_edge').checked;
                body.contoured_base = document.getElementById('jigsaw_contoured_base').checked;
                // Send the actual type to backend (hexagonal or circular)
                body.jigsaw_type = jigsaw_type;
            } else {
                body.rows = M;
                body.cols = N;
            }
            const response = await fetch('/api/generate_jigsaw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            data = await response.json();
        } else if (puzzleType === 'fractal') {
            // Generar puzzle fractal
            const arc_shape = parseInt(document.getElementById('arc_shape').value);
            const response = await fetch('/api/generate_fractal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ M, N, min_size, max_size, arc_shape })
            });
            data = await response.json();
        } else {
            // Generar puzzle normal
            const border_prob = parseInt(document.getElementById('border_prob').value) / 100;
            const air_prob = parseInt(document.getElementById('air_prob').value) / 100;
            const target_solutions = parseInt(document.getElementById('target_solutions').value);

            // Si hay target de soluciones, arrancar polling de progreso
            let progressInterval = null;
            if (target_solutions > 0) {
                const targetLabel = target_solutions === 1
                    ? 'solución única'
                    : `al menos ${target_solutions} soluciones`;
                showGenerateStatus(`⏳ Buscando puzzle con ${targetLabel}... intento 1 / 50`, 'info');
                progressInterval = setInterval(async () => {
                    try {
                        const pr = await fetch('/api/progress');
                        const pd = await pr.json();
                        if (pd.active) {
                            showGenerateStatus(
                                `⏳ Buscando puzzle con ${targetLabel}... intento ${pd.attempt} / ${pd.max}`,
                                'info'
                            );
                        }
                    } catch (_) {}
                }, 300);
            }

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        M, N, min_size, max_size, border_prob, air_prob, target_solutions
                    })
                });
                data = await response.json();
            } finally {
                if (progressInterval) clearInterval(progressInterval);
            }
        }

        if (data.success) {
            puzzleData.grid = data.grid;
            puzzleData.pieces = data.pieces;
            puzzleData.solutions = [];
            puzzleData.currentSolutionPage = 0;
            puzzleData.galleryPage = 0;
            puzzleData.puzzleType = puzzleType;
            puzzleData.arcsData = data.arcs_data || null;
            puzzleData.svgPaths = data.svg_paths || null;
            puzzleData.fractalNcols = data.ncols || 0;
            puzzleData.fractalNrows = data.nrows || 0;
            puzzleData.jigsawType = data.jigsaw_type || null;
            puzzleData.truncateEdge = data.truncate_edge || false;
            puzzleData.hexRadius = data.hex_radius || 0;
            puzzleData.hexOffset = data.hex_offset || 0;
            puzzleData.slidingRows = data.rows || 0;
            puzzleData.slidingCols = data.cols || 0;
            puzzleData.slidingEmptyRow = data.empty_row;
            puzzleData.slidingEmptyCol = data.empty_col;
            puzzleData.slidingEmptyCorner = data.empty_corner;

            // Apply per-puzzle-type infill defaults
            if (typeof applyInfillDefaults === 'function') applyInfillDefaults();

            // Update wizard validation
            if (typeof window.updateNextButtonValidation === 'function') {
                window.updateNextButtonValidation();
            }

            let statusMsg = `✅ Puzzle con ${data.piece_count} piezas generado correctamente`;
            let statusType = 'success';
            if (data.warning) {
                statusMsg = `⚠️ ${data.warning}`;
                statusType = 'error';
            } else if (data.target_met) {
                const t = data.target_solutions;
                const targetLabel = t === 1 ? 'Solución única' : `Al menos ${t} soluciones`;
                statusMsg += ` | 🎯 ${targetLabel} (${data.attempts} intento${data.attempts > 1 ? 's' : ''})`;
            }
            showGenerateStatus(statusMsg, statusType);

            // Esperar a que el overlay cubra el canvas antes de redibujar
            await revealReady;

            // Dibujar puzzle según tipo y modo de vista
            if (puzzleType === 'sliding') {
                setFractalVisibility(false);
                drawSlidingPuzzle();
            } else if (puzzleType === 'fractal' || puzzleType === 'jigsaw') {
                drawPuzzleFractal();
            } else {
                if (puzzleData.viewMode === 'flat') {
                    drawPuzzleFlat();
                } else {
                    setFractalVisibility(false);
                    drawPuzzle();
                }
            }
            drawGallery();
            updateSolutionInfo();
            // Hide solution previews on new puzzle
            const previewContainer = document.getElementById('solutions-preview');
            if (previewContainer) previewContainer.style.display = 'none';
            // Ocultar el hint del visor de configuración una vez hay puzzle
            const configHint = document.getElementById('config-viewer-hint');
            if (configHint) configHint.style.display = 'none';

            // Revelar el nuevo puzzle con sweep-out
            revealEl.className = 'viewer-reveal is-exiting';
            setTimeout(() => { revealEl.className = 'viewer-reveal'; }, 220);

            // Actualizar visor 3D automáticamente
            if (typeof scheduleViewerUpdate === 'function') {
                scheduleViewerUpdate();
            }
            // Actualizar visor 2D de acabados
            if (typeof render2DViewer === 'function') {
                render2DViewer();
            }
            // Actualizar inline 3D
            if (typeof scheduleInline3DUpdate === 'function') {
                scheduleInline3DUpdate();
            }
            // Actualizar mini-viewers de config 3D avanzada
            if (typeof window.scheduleMiniViewerUpdate === 'function') {
                window.scheduleMiniViewerUpdate();
            }
        } else {
            showGenerateStatus(`❌ Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showGenerateStatus(`❌ Error: ${error.message}`, 'error');
        const revealElErr = document.getElementById('viewer-reveal');
        if (revealElErr) revealElErr.className = 'viewer-reveal';
    }
}

async function findSolutions(max_solutions) {
    if (!puzzleData.grid || !puzzleData.pieces) {
        showSolutionsStatus('⚠️ Primero genera un puzzle', 'error');
        return;
    }

    try {
        showSolutionsStatus(`⏳ Buscando ${max_solutions} soluciones...`, 'info');

        const response = await fetch('/api/find_solutions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ max_solutions })
        });

        const data = await response.json();

        if (data.success) {
            puzzleData.solutions = data.solutions || [];
            puzzleData.currentSolutionPage = 0;
            showSolutionsStatus(`✅ ${data.solutions_count} soluciones encontradas`, 'success');
            updateSolutionInfo();
            renderSolutionPreviews();
        } else {
            showSolutionsStatus(`❌ Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showSolutionsStatus(`❌ Error: ${error.message}`, 'error');
    }
}

const SOLUTIONS_PER_PAGE = 4;

function nextSolutionPage() {
    const totalPages = Math.ceil(puzzleData.solutions.length / SOLUTIONS_PER_PAGE);
    if (totalPages === 0) return;
    puzzleData.currentSolutionPage = (puzzleData.currentSolutionPage + 1) % totalPages;
    renderSolutionPreviews();
}

function prevSolutionPage() {
    const totalPages = Math.ceil(puzzleData.solutions.length / SOLUTIONS_PER_PAGE);
    if (totalPages === 0) return;
    puzzleData.currentSolutionPage = (puzzleData.currentSolutionPage - 1 + totalPages) % totalPages;
    renderSolutionPreviews();
}

function updateSolutionInfo() {
    const infoEl = document.getElementById('solution-info');
    infoEl.textContent = `Soluciones encontradas: ${puzzleData.solutions.length}`;
}

function renderSolutionPreviews() {
    const container = document.getElementById('solutions-preview');
    const total = puzzleData.solutions.length;

    if (total === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    const totalPages = Math.ceil(total / SOLUTIONS_PER_PAGE);
    const page = puzzleData.currentSolutionPage;
    const startIdx = page * SOLUTIONS_PER_PAGE;

    // Update pagination info
    document.getElementById('sol-page-info').textContent = `Página ${page + 1} / ${totalPages}`;

    // Draw each of the 4 canvas slots
    for (let i = 0; i < SOLUTIONS_PER_PAGE; i++) {
        const solIdx = startIdx + i;
        const canvas = document.getElementById(`sol-canvas-${i}`);
        const title = document.getElementById(`sol-title-${i}`);
        const card = canvas.parentElement;

        if (solIdx < total) {
            card.style.visibility = 'visible';
            card.style.opacity = '1';
            title.textContent = `Solución ${solIdx + 1}`;
            drawSolutionOnCanvas(canvas, puzzleData.solutions[solIdx]);
        } else {
            // Empty slot - clear and hide
            card.style.visibility = 'hidden';
            card.style.opacity = '0';
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

function drawSolutionOnCanvas(canvas, solutionPieces) {
    const ctx = canvas.getContext('2d');
    const grid = puzzleData.grid;
    if (!grid || !solutionPieces) return;

    const M = grid.length;
    const N = grid[0].length;
    const w = canvas.width;
    const h = canvas.height;

    const padding = 16;
    const cellSize = Math.min((w - padding * 2) / N, (h - padding * 2) / M);
    const offsetX = (w - cellSize * N) / 2;
    const offsetY = (h - cellSize * M) / 2;

    // Clear
    ctx.fillStyle = '#f5f7fa';
    ctx.fillRect(0, 0, w, h);

    // Draw blocked cells (value 0)
    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            if (grid[r][c] === 0) {
                const x = offsetX + c * cellSize;
                const y = offsetY + r * cellSize;
                ctx.fillStyle = '#555555';
                ctx.fillRect(x, y, cellSize, cellSize);
            } else if (grid[r][c] === -1) {
                const x = offsetX + c * cellSize;
                const y = offsetY + r * cellSize;
                ctx.fillStyle = '#f0f0f0';
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        }
    }

    // Build a cell-to-piece map from the solution
    const cellPieceMap = {};
    for (let idx = 0; idx < solutionPieces.length; idx++) {
        const piece = solutionPieces[idx];
        for (let cell of piece) {
            cellPieceMap[`${cell[0]},${cell[1]}`] = idx;
        }
    }

    // Draw pieces with colors
    for (let pieceIdx = 0; pieceIdx < solutionPieces.length; pieceIdx++) {
        const piece = solutionPieces[pieceIdx];
        const color = PIECE_COLORS[pieceIdx % PIECE_COLORS.length];

        for (let cell of piece) {
            const r = cell[0];
            const c = cell[1];
            const x = offsetX + c * cellSize;
            const y = offsetY + r * cellSize;

            // Gradient fill
            const gradient = ctx.createLinearGradient(x, y, x, y + cellSize);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, shadeColor(color, -15));
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, cellSize, cellSize);
        }
    }

    // Draw grid lines to separate pieces
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            const myPiece = cellPieceMap[`${r},${c}`];
            if (myPiece === undefined) continue;

            const x = offsetX + c * cellSize;
            const y = offsetY + r * cellSize;

            // Right border
            if (c + 1 < N) {
                const rightPiece = cellPieceMap[`${r},${c + 1}`];
                if (rightPiece !== myPiece) {
                    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x + cellSize, y);
                    ctx.lineTo(x + cellSize, y + cellSize);
                    ctx.stroke();
                }
            }

            // Bottom border
            if (r + 1 < M) {
                const bottomPiece = cellPieceMap[`${r + 1},${c}`];
                if (bottomPiece !== myPiece) {
                    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x, y + cellSize);
                    ctx.lineTo(x + cellSize, y + cellSize);
                    ctx.stroke();
                }
            }
        }
    }

    // Outer border
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, cellSize * N, cellSize * M);
}

// Drawing Functions - VISUALIZACIÓN ISOMÉTRICA MEJORADA
function drawPuzzle() {
    if (!puzzleData.grid || !puzzleData.pieces) return;

    const grid = puzzleData.grid;
    const pieces = puzzleData.pieces;
    const M = grid.length;
    const N = grid[0].length;

    const w = puzzleCanvas.width;
    const h = puzzleCanvas.height;

    // Clear canvas
    const gradientBg = puzzleCtx.createLinearGradient(0, 0, w, h);
    gradientBg.addColorStop(0, '#f5f7fa');
    gradientBg.addColorStop(1, '#e9ecef');
    puzzleCtx.fillStyle = gradientBg;
    puzzleCtx.fillRect(0, 0, w, h);

    // Base shape: rectangle [0, 0] → [N, M] with border margin
    const coordW = N;
    const coordH = M;
    const baseBorder = Math.max(coordW, coordH) * VIEWER_PARAMS.baseBorderFactor;
    const extrudeH = Math.max(coordW, coordH) * VIEWER_PARAMS.extrudeHeightFactor;

    const baseShape = [
        [-baseBorder, -baseBorder],
        [coordW + baseBorder, -baseBorder],
        [coordW + baseBorder, coordH + baseBorder],
        [-baseBorder, coordH + baseBorder]
    ];

    // Isometric projection helpers
    const projectTop = (x, y) => [(x - y) * ISO_COS30, (x + y) * ISO_SIN30];
    const projectBot = (x, y) => [(x - y) * ISO_COS30, (x + y) * ISO_SIN30 + extrudeH];

    // Compute bounding box
    let bMinX = Infinity, bMaxX = -Infinity;
    let bMinY = Infinity, bMaxY = -Infinity;
    for (const [bx, by] of baseShape) {
        const [sx1, sy1] = projectTop(bx, by);
        const [sx2, sy2] = projectBot(bx, by);
        bMinX = Math.min(bMinX, sx1, sx2);
        bMaxX = Math.max(bMaxX, sx1, sx2);
        bMinY = Math.min(bMinY, sy1, sy2);
        bMaxY = Math.max(bMaxY, sy1, sy2);
    }

    const projW = bMaxX - bMinX;
    const projH = bMaxY - bMinY;
    const margin = VIEWER_PARAMS.isoMarginPx;
    const fitScale = Math.min((w - margin * 2) / projW, (h - margin * 2) / projH);
    const offX = w / 2 - (bMinX + projW / 2) * fitScale;
    const offY = h / 2 - (bMinY + projH / 2) * fitScale;

    const toScreen = (px, py) => [px * fitScale + offX, py * fitScale + offY];

    // === Draw extruded base (same approach as fractal/jigsaw) ===
    const baseColor = VIEWER_PARAMS.baseColor;
    const baseColorRight = shadeColor(baseColor, VIEWER_PARAMS.baseShadeRight);
    const baseColorLeft = shadeColor(baseColor, VIEWER_PARAMS.baseShadeLeft);

    const baseTopScreen = baseShape.map(([bx, by]) => {
        const [px, py] = projectTop(bx, by);
        return toScreen(px, py);
    });
    const baseBotScreen = baseShape.map(([bx, by]) => {
        const [px, py] = projectBot(bx, by);
        return toScreen(px, py);
    });

    const nBase = baseShape.length;
    let baseCx = 0, baseCy = 0;
    for (const [bx, by] of baseShape) { baseCx += bx; baseCy += by; }
    baseCx /= nBase; baseCy /= nBase;

    // Classify edges as front-facing or back-facing
    const frontEdges = [];
    const backEdges = [];
    for (let j = 0; j < nBase; j++) {
        const j2 = (j + 1) % nBase;
        const mx = (baseShape[j][0] + baseShape[j2][0]) / 2;
        const my = (baseShape[j][1] + baseShape[j2][1]) / 2;
        const nx = mx - baseCx;
        const ny = my - baseCy;
        if (nx + ny > 0) {
            const shade = nx > ny ? baseColorRight : baseColorLeft;
            frontEdges.push({ j, j2, shade });
        } else {
            backEdges.push({ j, j2 });
        }
    }

    // Draw back-facing walls
    for (const { j, j2 } of backEdges) {
        puzzleCtx.fillStyle = shadeColor(baseColor, -5);
        puzzleCtx.beginPath();
        puzzleCtx.moveTo(baseTopScreen[j][0], baseTopScreen[j][1]);
        puzzleCtx.lineTo(baseTopScreen[j2][0], baseTopScreen[j2][1]);
        puzzleCtx.lineTo(baseBotScreen[j2][0], baseBotScreen[j2][1]);
        puzzleCtx.lineTo(baseBotScreen[j][0], baseBotScreen[j][1]);
        puzzleCtx.closePath();
        puzzleCtx.fill();
    }

    // Base top face
    puzzleCtx.beginPath();
    puzzleCtx.moveTo(baseTopScreen[0][0], baseTopScreen[0][1]);
    for (let j = 1; j < nBase; j++) {
        puzzleCtx.lineTo(baseTopScreen[j][0], baseTopScreen[j][1]);
    }
    puzzleCtx.closePath();
    const baseGrad = puzzleCtx.createLinearGradient(0, baseTopScreen[0][1], 0, baseTopScreen[nBase - 1][1]);
    baseGrad.addColorStop(0, VIEWER_PARAMS.baseTopGradient[0]);
    baseGrad.addColorStop(1, shadeColor(VIEWER_PARAMS.baseTopGradient[0], VIEWER_PARAMS.baseTopGradient[1]));
    puzzleCtx.fillStyle = baseGrad;
    puzzleCtx.fill();
    puzzleCtx.strokeStyle = 'rgba(0,0,0,0.15)';
    puzzleCtx.lineWidth = 1;
    puzzleCtx.stroke();

    // Draw front-facing walls
    for (const { j, j2, shade } of frontEdges) {
        puzzleCtx.fillStyle = shade;
        puzzleCtx.beginPath();
        puzzleCtx.moveTo(baseTopScreen[j][0], baseTopScreen[j][1]);
        puzzleCtx.lineTo(baseTopScreen[j2][0], baseTopScreen[j2][1]);
        puzzleCtx.lineTo(baseBotScreen[j2][0], baseBotScreen[j2][1]);
        puzzleCtx.lineTo(baseBotScreen[j][0], baseBotScreen[j][1]);
        puzzleCtx.closePath();
        puzzleCtx.fill();
        puzzleCtx.strokeStyle = 'rgba(0,0,0,0.1)';
        puzzleCtx.lineWidth = 1;
        puzzleCtx.stroke();
    }

    // === Draw cells on top surface ===
    let cellPieceMap = {};
    for (let idx = 0; idx < pieces.length; idx++) {
        for (let cell of pieces[idx]) {
            cellPieceMap[`${cell[0]},${cell[1]}`] = idx;
        }
    }

    // Draw cells back-to-front (smaller r+c first)
    let cellsToDraw = [];
    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            cellsToDraw.push({ r, c, depth: r + c });
        }
    }
    cellsToDraw.sort((a, b) => a.depth - b.depth);

    const strokeW = Math.max(0.5, fitScale * 0.015);

    for (const { r, c } of cellsToDraw) {
        const val = grid[r][c];
        const pieceIdx = cellPieceMap[`${r},${c}`];

        let color;
        if (val === 0) color = '#555555';
        else if (val === -1) color = '#f0f0f0';
        else if (pieceIdx !== undefined && pieceIdx >= 0) {
            color = PIECE_COLORS[pieceIdx % PIECE_COLORS.length];
        } else {
            color = '#e0e0e0';
        }

        // Draw isometric diamond (top face of cell)
        const corners = [
            [c, r], [c + 1, r], [c + 1, r + 1], [c, r + 1]
        ];
        puzzleCtx.beginPath();
        for (let k = 0; k < 4; k++) {
            const [px, py] = projectTop(corners[k][0], corners[k][1]);
            const [sx, sy] = toScreen(px, py);
            if (k === 0) puzzleCtx.moveTo(sx, sy);
            else puzzleCtx.lineTo(sx, sy);
        }
        puzzleCtx.closePath();

        puzzleCtx.fillStyle = color;
        puzzleCtx.fill();

        // Draw piece outlines: only on edges between different pieces
        for (let k = 0; k < 4; k++) {
            const k2 = (k + 1) % 4;
            let nr, nc;
            if (k === 0) { nr = r - 1; nc = c; }       // top edge
            else if (k === 1) { nr = r; nc = c + 1; }   // right edge
            else if (k === 2) { nr = r + 1; nc = c; }   // bottom edge
            else { nr = r; nc = c - 1; }                  // left edge

            const neighborIdx = (nr >= 0 && nr < M && nc >= 0 && nc < N) ? (cellPieceMap[`${nr},${nc}`] ?? -1) : -2;
            if (neighborIdx !== pieceIdx) {
                const [px1, py1] = projectTop(corners[k][0], corners[k][1]);
                const [sx1, sy1] = toScreen(px1, py1);
                const [px2, py2] = projectTop(corners[k2][0], corners[k2][1]);
                const [sx2, sy2] = toScreen(px2, py2);
                puzzleCtx.strokeStyle = 'rgba(0,0,0,0.35)';
                puzzleCtx.lineWidth = strokeW;
                puzzleCtx.beginPath();
                puzzleCtx.moveTo(sx1, sy1);
                puzzleCtx.lineTo(sx2, sy2);
                puzzleCtx.stroke();
            }
        }
    }
}

function drawIsometricCubeSimple(x, y, size, color, gaps = {}) {
    const s = size;
    const hf = 0.5; // height factor: 0.5 = half-height cubes

    // Sombra
    puzzleCtx.shadowColor = 'rgba(0,0,0,0.2)';
    puzzleCtx.shadowBlur = 5;
    puzzleCtx.shadowOffsetX = 1;
    puzzleCtx.shadowOffsetY = 1;

    // Cara superior (diamond stays the same shape, just shifted down)
    const topY = y + s * 0.25 * (1 - hf); // shift top face down when shorter
    const gradTop = puzzleCtx.createLinearGradient(
        x + s * 0.25, topY,
        x + s * 0.25, topY + s * 0.25
    );
    gradTop.addColorStop(0, color);
    gradTop.addColorStop(1, shadeColor(color, -10));
    puzzleCtx.fillStyle = gradTop;
    
    puzzleCtx.beginPath();
    puzzleCtx.moveTo(x + s * 0.5, topY);
    puzzleCtx.lineTo(x + s, topY + s * 0.25);
    puzzleCtx.lineTo(x + s * 0.5, topY + s * 0.5);
    puzzleCtx.lineTo(x, topY + s * 0.25);
    puzzleCtx.closePath();
    puzzleCtx.fill();

    // Side height in pixels
    const sideH = s * 0.5 * hf;

    // Lado derecho
    const gradRight = puzzleCtx.createLinearGradient(
        x + s, topY + s * 0.25,
        x + s * 0.5, topY + s * 0.25 + sideH
    );
    const rightColor = shadeColor(color, -25);
    gradRight.addColorStop(0, shadeColor(rightColor, 5));
    gradRight.addColorStop(1, rightColor);
    puzzleCtx.fillStyle = gradRight;
    
    puzzleCtx.beginPath();
    puzzleCtx.moveTo(x + s, topY + s * 0.25);
    puzzleCtx.lineTo(x + s, topY + s * 0.25 + sideH);
    puzzleCtx.lineTo(x + s * 0.5, topY + s * 0.5 + sideH);
    puzzleCtx.lineTo(x + s * 0.5, topY + s * 0.5);
    puzzleCtx.closePath();
    puzzleCtx.fill();

    // Lado izquierdo
    const gradLeft = puzzleCtx.createLinearGradient(
        x, topY + s * 0.25,
        x + s * 0.5, topY + s * 0.25 + sideH
    );
    const leftColor = shadeColor(color, -35);
    gradLeft.addColorStop(0, shadeColor(leftColor, 5));
    gradLeft.addColorStop(1, leftColor);
    puzzleCtx.fillStyle = gradLeft;
    
    puzzleCtx.beginPath();
    puzzleCtx.moveTo(x, topY + s * 0.25);
    puzzleCtx.lineTo(x, topY + s * 0.25 + sideH);
    puzzleCtx.lineTo(x + s * 0.5, topY + s * 0.5 + sideH);
    puzzleCtx.lineTo(x + s * 0.5, topY + s * 0.5);
    puzzleCtx.closePath();
    puzzleCtx.fill();

    puzzleCtx.shadowColor = 'transparent';
}

function drawIsometricCell(x, y, size, cellValue, pieceIdx, gaps = {}) {
    const s = size;
    const gap = 2;
    
    // Color base
    let color = '#e0e0e0';
    if (cellValue === 0) {
        color = '#333333';
    } else if (cellValue === -1) {
        color = '#f0f0f0';
    } else if (pieceIdx >= 0) {
        color = PIECE_COLORS[pieceIdx % PIECE_COLORS.length];
    }

    // Aplicar separación solo en los bordes indicados
    const adjustedX = x + (gaps.gapLeft ? gap / 2 : 0);
    const adjustedY = y + (gaps.gapTop ? gap / 2 : 0);
    
    // Calcular tamaño ajustado según separaciones
    let adjustedS = s;
    if (gaps.gapLeft) adjustedS -= gap / 2;
    if (gaps.gapRight) adjustedS -= gap / 2;

    // Sombra suave
    puzzleCtx.shadowColor = 'rgba(0,0,0,0.25)';
    puzzleCtx.shadowBlur = 6;
    puzzleCtx.shadowOffsetX = 1;
    puzzleCtx.shadowOffsetY = 1;

    // Cara superior con gradiente
    const gradTop = puzzleCtx.createLinearGradient(
        adjustedX + adjustedS * 0.25, adjustedY,
        adjustedX + adjustedS * 0.25, adjustedY + adjustedS * 0.25
    );
    gradTop.addColorStop(0, color);
    gradTop.addColorStop(1, shadeColor(color, -15));
    puzzleCtx.fillStyle = gradTop;
    
    puzzleCtx.beginPath();
    puzzleCtx.moveTo(adjustedX + adjustedS * 0.5, adjustedY);
    puzzleCtx.lineTo(adjustedX + adjustedS, adjustedY + adjustedS * 0.25);
    puzzleCtx.lineTo(adjustedX + adjustedS * 0.5, adjustedY + adjustedS * 0.5);
    puzzleCtx.lineTo(adjustedX, adjustedY + adjustedS * 0.25);
    puzzleCtx.closePath();
    puzzleCtx.fill();
    
    // Borde sutil
    puzzleCtx.strokeStyle = 'rgba(255,255,255,0.3)';
    puzzleCtx.lineWidth = 1;
    puzzleCtx.stroke();

    // Lado derecho con gradiente
    const gradRight = puzzleCtx.createLinearGradient(
        adjustedX + adjustedS, adjustedY + adjustedS * 0.25,
        adjustedX + adjustedS * 0.5, adjustedY + adjustedS * 0.75
    );
    const rightColor = shadeColor(color, -25);
    gradRight.addColorStop(0, shadeColor(rightColor, 10));
    gradRight.addColorStop(1, rightColor);
    puzzleCtx.fillStyle = gradRight;
    
    puzzleCtx.beginPath();
    puzzleCtx.moveTo(adjustedX + adjustedS, adjustedY + adjustedS * 0.25);
    puzzleCtx.lineTo(adjustedX + adjustedS, adjustedY + adjustedS * 0.75);
    puzzleCtx.lineTo(adjustedX + adjustedS * 0.5, adjustedY + adjustedS);
    puzzleCtx.lineTo(adjustedX + adjustedS * 0.5, adjustedY + adjustedS * 0.5);
    puzzleCtx.closePath();
    puzzleCtx.fill();
    
    puzzleCtx.strokeStyle = 'rgba(0,0,0,0.15)';
    puzzleCtx.lineWidth = 0.8;
    puzzleCtx.stroke();

    // Lado izquierdo con gradiente
    const gradLeft = puzzleCtx.createLinearGradient(
        adjustedX, adjustedY + adjustedS * 0.25,
        adjustedX + adjustedS * 0.5, adjustedY + adjustedS * 0.75
    );
    const leftColor = shadeColor(color, -40);
    gradLeft.addColorStop(0, shadeColor(leftColor, 10));
    gradLeft.addColorStop(1, leftColor);
    puzzleCtx.fillStyle = gradLeft;
    
    puzzleCtx.beginPath();
    puzzleCtx.moveTo(adjustedX, adjustedY + adjustedS * 0.25);
    puzzleCtx.lineTo(adjustedX, adjustedY + adjustedS * 0.75);
    puzzleCtx.lineTo(adjustedX + adjustedS * 0.5, adjustedY + adjustedS);
    puzzleCtx.lineTo(adjustedX + adjustedS * 0.5, adjustedY + adjustedS * 0.5);
    puzzleCtx.closePath();
    puzzleCtx.fill();
    
    puzzleCtx.strokeStyle = 'rgba(0,0,0,0.2)';
    puzzleCtx.lineWidth = 0.8;
    puzzleCtx.stroke();

    puzzleCtx.shadowColor = 'transparent';
    puzzleCtx.shadowOffsetX = 0;
    puzzleCtx.shadowOffsetY = 0;

    // Número de pieza (solo si es válido)
    if (cellValue > 0 && pieceIdx >= 0) {
        puzzleCtx.fillStyle = 'white';
        puzzleCtx.font = 'bold 12px Arial';
        puzzleCtx.textAlign = 'center';
        puzzleCtx.textBaseline = 'middle';
        puzzleCtx.shadowColor = 'rgba(0,0,0,0.5)';
        puzzleCtx.shadowBlur = 3;
        puzzleCtx.fillText(String(pieceIdx + 1), adjustedX + adjustedS * 0.5, adjustedY + adjustedS * 0.25);
        puzzleCtx.shadowColor = 'transparent';
    }
}

function shadeColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

const GALLERY_COLS = 3;
const GALLERY_ROWS = 4;
const GALLERY_PER_PAGE = GALLERY_COLS * GALLERY_ROWS;

function galleryNextPage() {
    if (!puzzleData.pieces) return;
    const totalPages = Math.ceil(puzzleData.pieces.length / GALLERY_PER_PAGE);
    if (totalPages <= 1) return;
    puzzleData.galleryPage = (puzzleData.galleryPage + 1) % totalPages;
    drawGallery();
}

function galleryPrevPage() {
    if (!puzzleData.pieces) return;
    const totalPages = Math.ceil(puzzleData.pieces.length / GALLERY_PER_PAGE);
    if (totalPages <= 1) return;
    puzzleData.galleryPage = (puzzleData.galleryPage - 1 + totalPages) % totalPages;
    drawGallery();
}

function updateGalleryPageInfo() {
    const totalPages = puzzleData.pieces ? Math.ceil(puzzleData.pieces.length / GALLERY_PER_PAGE) : 1;
    const page = puzzleData.galleryPage + 1;
    const info = document.getElementById('gallery-page-info');
    if (info) info.textContent = `Página ${page} / ${totalPages}`;
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    if (prevBtn) prevBtn.style.visibility = totalPages > 1 ? 'visible' : 'hidden';
    if (nextBtn) nextBtn.style.visibility = totalPages > 1 ? 'visible' : 'hidden';
}

function drawGallery() {
    if (!puzzleData.pieces) return;
    // Sliding puzzle pieces are objects, not arrays — gallery doesn't apply
    if (puzzleData.puzzleType === 'sliding') return;

    const pieces = puzzleData.pieces;
    const isFractal = puzzleData.puzzleType === 'fractal' || puzzleData.puzzleType === 'jigsaw';
    const w = galleryCanvas.width;
    const h = galleryCanvas.height;

    // Fondo
    const gradientBg = galleryCtx.createLinearGradient(0, 0, w, h);
    gradientBg.addColorStop(0, '#f5f7fa');
    gradientBg.addColorStop(1, '#e9ecef');
    galleryCtx.fillStyle = gradientBg;
    galleryCtx.fillRect(0, 0, w, h);

    updateGalleryPageInfo();

    const padding = 10;
    const usableW = w - padding * 2;
    const usableH = h - padding * 2;
    const cellW = usableW / GALLERY_COLS;
    const cellH = usableH / GALLERY_ROWS;

    // Calculate global scale so all pieces are drawn at the same relative size
    // Find the largest piece bounding box across ALL pieces
    let globalMaxW = 0, globalMaxH = 0;

    if (isFractal && puzzleData.svgPaths) {
        for (const d of puzzleData.svgPaths) {
            if (!d) continue;
            const bbox = computeSvgPathBBox(d);
            if (bbox) {
                globalMaxW = Math.max(globalMaxW, bbox.width);
                globalMaxH = Math.max(globalMaxH, bbox.height);
            }
        }
    } else {
        for (const piece of pieces) {
            const minR = Math.min(...piece.map(c => c[0]));
            const maxR = Math.max(...piece.map(c => c[0]));
            const minC = Math.min(...piece.map(c => c[1]));
            const maxC = Math.max(...piece.map(c => c[1]));
            globalMaxW = Math.max(globalMaxW, maxC - minC + 1);
            globalMaxH = Math.max(globalMaxH, maxR - minR + 1);
        }
    }

    if (globalMaxW === 0 || globalMaxH === 0) return;

    // Uniform scale: fit the largest piece into a cell, all others use the same scale
    const innerPad = 8;
    const innerW = cellW - innerPad * 2;
    const innerH = cellH - innerPad * 2;

    // Page slice
    const startIdx = puzzleData.galleryPage * GALLERY_PER_PAGE;
    const endIdx = Math.min(startIdx + GALLERY_PER_PAGE, pieces.length);

    if (isFractal && puzzleData.svgPaths) {
        // Fractal gallery: draw SVG paths on canvas
        const scaleF = Math.min(innerW / globalMaxW, innerH / globalMaxH);

        for (let i = startIdx; i < endIdx; i++) {
            const d = puzzleData.svgPaths[i];
            if (!d) continue;
            const bbox = computeSvgPathBBox(d);
            if (!bbox) continue;

            const col = (i - startIdx) % GALLERY_COLS;
            const row = Math.floor((i - startIdx) / GALLERY_COLS);
            const cx = padding + col * cellW + cellW / 2;
            const cy = padding + row * cellH + cellH / 2;

            const pieceW = bbox.width * scaleF;
            const pieceH = bbox.height * scaleF;
            const ox = cx - pieceW / 2;
            const oy = cy - pieceH / 2;

            // Parse and draw the SVG path on canvas
            const color = PIECE_COLORS[i % PIECE_COLORS.length];
            drawSvgPathOnCanvas(galleryCtx, d, bbox, ox, oy, scaleF, color);
        }
    } else {
        // Normal gallery: draw grid-based pieces on canvas
        const cellScale = Math.min(innerW / globalMaxW, innerH / globalMaxH);

        for (let i = startIdx; i < endIdx; i++) {
            const piece = pieces[i];
            const color = PIECE_COLORS[i % PIECE_COLORS.length];

            const minR = Math.min(...piece.map(c => c[0]));
            const maxR = Math.max(...piece.map(c => c[0]));
            const minC = Math.min(...piece.map(c => c[1]));
            const maxC = Math.max(...piece.map(c => c[1]));
            const pw = (maxC - minC + 1) * cellScale;
            const ph = (maxR - minR + 1) * cellScale;

            const col = (i - startIdx) % GALLERY_COLS;
            const row = Math.floor((i - startIdx) / GALLERY_COLS);
            const cx = padding + col * cellW + cellW / 2;
            const cy = padding + row * cellH + cellH / 2;
            const ox = cx - pw / 2;
            const oy = cy - ph / 2;

            for (const cell of piece) {
                const r = cell[0] - minR;
                const c = cell[1] - minC;
                const x = ox + c * cellScale;
                const y = oy + r * cellScale;

                const gradient = galleryCtx.createLinearGradient(x, y, x, y + cellScale);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, shadeColor(color, -20));
                galleryCtx.fillStyle = gradient;
                drawRoundedRect(galleryCtx, x, y, cellScale, cellScale, 2, true);

                galleryCtx.strokeStyle = 'rgba(0,0,0,0.15)';
                galleryCtx.lineWidth = 0.8;
                drawRoundedRect(galleryCtx, x, y, cellScale, cellScale, 2, false, true);
            }
        }
    }
}

/**
 * Parse an SVG path 'd' string and draw it on a canvas context.
 * Translates/scales from the path's bbox to the target position.
 */
function drawSvgPathOnCanvas(ctx, d, bbox, ox, oy, scale, fillColor) {
    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);
    ctx.translate(-bbox.minX, -bbox.minY);

    // Build a Path2D from the SVG 'd' string
    const path = new Path2D(d);

    // First pass: thicker fill-color stroke to fatten narrow slivers
    // (octagonal shapes have thin wedge areas that look like stray lines at small scale)
    ctx.strokeStyle = fillColor;
    ctx.lineWidth = 0.12;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke(path);

    // Fill on top
    ctx.fillStyle = fillColor;
    ctx.fill(path);

    // Outline
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 0.05;
    ctx.lineJoin = 'round';
    ctx.stroke(path);

    ctx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, radius, fill = false, stroke = false) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    if (fill !== false) ctx.fill();
    if (stroke) ctx.stroke();
}

function drawFlatCellWithGaps(x, y, size, gaps) {
    const gap = 2;
    let x1 = x + (gaps.gapLeft ? gap : 0);
    let y1 = y + (gaps.gapTop ? gap : 0);
    let w = size - (gaps.gapLeft ? gap : 0) - (gaps.gapRight ? gap : 0);
    let h = size - (gaps.gapTop ? gap : 0) - (gaps.gapBottom ? gap : 0);
    
    drawRoundedRect(puzzleCtx, x1, y1, w, h, 3, true);
}

function drawFlatCellPiece(x, y, cellSize, color, r, c, M, N, cellPieceMap, pieceIdx) {
    // Sombra
    puzzleCtx.shadowColor = 'rgba(0,0,0,0.2)';
    puzzleCtx.shadowBlur = 5;
    puzzleCtx.shadowOffsetX = 1;
    puzzleCtx.shadowOffsetY = 1;

    // Gradiente
    const gradient = puzzleCtx.createLinearGradient(x, y, x, y + cellSize);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, shadeColor(color, -15));
    puzzleCtx.fillStyle = gradient;
    
    puzzleCtx.fillRect(x, y, cellSize, cellSize);

    puzzleCtx.shadowColor = 'transparent';
}

function drawFlatCellPlain(x, y, cellSize, color) {
    // Sombra
    puzzleCtx.shadowColor = 'rgba(0,0,0,0.2)';
    puzzleCtx.shadowBlur = 5;
    puzzleCtx.shadowOffsetX = 1;
    puzzleCtx.shadowOffsetY = 1;

    // Gradiente
    const gradient = puzzleCtx.createLinearGradient(x, y, x, y + cellSize);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, shadeColor(color, -15));
    puzzleCtx.fillStyle = gradient;
    
    puzzleCtx.fillRect(x, y, cellSize, cellSize);

    puzzleCtx.shadowColor = 'transparent';
}

function buildSTLPayload(modeOverride) {
    const isFractal = puzzleData && (puzzleData.puzzleType === 'fractal' || puzzleData.puzzleType === 'jigsaw');
    const isSliding = puzzleData && puzzleData.puzzleType === 'sliding';
    const arcShapeEl = document.getElementById('arc_shape');
    const arcShape = arcShapeEl ? arcShapeEl.value : '0';

    // Determine acabados mode (infill vs texture vs image)
    const acabadosMode = document.querySelector('input[name="acabados_mode"]:checked');
    const isTexture = acabadosMode && acabadosMode.value === 'texture';
    const isImage = acabadosMode && acabadosMode.value === 'image';

    // In texture or image mode, pieces are solid; infill is handled separately
    const infillType = (isTexture || isImage) ? 'solid' : document.getElementById('stl_infill_type').value;

    // Determine viewer mode: which checkbox is checked, or use override
    const mode = modeOverride || getViewerMode();
    const include_pieces = (mode === 'pieces' || mode === 'both');
    const include_base   = (mode === 'base'   || mode === 'both');

    const payload = {
        cube_size: parseFloat(document.getElementById('stl_cube_size').value),
        height: parseFloat(document.getElementById('stl_height').value),
        gap_mm: 1,  // hardcoded
        tolerance_mm: parseFloat(document.getElementById('stl_tolerance').value),
        border: parseFloat(document.getElementById('stl_border').value),
        base_thickness: parseFloat(document.getElementById('stl_base_thickness').value),
        wall_height: parseFloat(document.getElementById('stl_wall_height').value),
        assembled: document.getElementById('stl_assembled').checked,
        include_pieces,
        include_base,
        infill_type: infillType,
        puzzle_type: isSliding ? 'sliding' : (isFractal ? (puzzleData.puzzleType || 'fractal') : 'normal'),
        arc_shape: parseInt(arcShape),
        acabados_mode: isImage ? 'texture' : (isTexture ? 'texture' : 'infill')
    };

    // Sliding puzzle parameters
    if (isSliding) {
        payload.sliding_cell_size = parseFloat((document.getElementById('sliding_cell_size') || {}).value) || 20;
        payload.sliding_clearance = parseFloat((document.getElementById('sliding_clearance') || {}).value) || 0.3;
        payload.sliding_frame_border = parseFloat((document.getElementById('sliding_frame_border') || {}).value) || 4;
        payload.sliding_floor_height = parseFloat((document.getElementById('sliding_floor_height') || {}).value) || 1.0;
        payload.sliding_stem_height = parseFloat((document.getElementById('sliding_stem_height') || {}).value) || 2.0;
        payload.sliding_cap_height = parseFloat((document.getElementById('sliding_cap_height') || {}).value) || 2.0;
        payload.sliding_overhang = parseFloat((document.getElementById('sliding_overhang') || {}).value) || 1.5;
        payload.sliding_corner_style = (document.getElementById('sliding_corner_style') || {}).value || 'round';
        payload.sliding_corner_radius = parseFloat((document.getElementById('sliding_corner_radius') || {}).value) || 1.0;
        // For backwards compat, derive fillet from corner radius when style is round
        payload.sliding_fillet = payload.sliding_corner_style === 'round' ? payload.sliding_corner_radius : 0;
        payload.sliding_piece_height = parseFloat((document.getElementById('sliding_piece_height') || {}).value) || 8.0;
        payload.sliding_shift_direction = (document.getElementById('sliding_shift_direction') || {}).value || 'br';
        // Slider piece chamfer
        const sPChamfTopOn = document.getElementById('sliding_piece_chamfer_top_on');
        if (sPChamfTopOn && sPChamfTopOn.checked) {
            payload.piece_chamfer_top = parseFloat(document.getElementById('sliding_piece_chamfer_top').value) || 0.3;
        }
        const sPChamfBotOn = document.getElementById('sliding_piece_chamfer_bottom_on');
        if (sPChamfBotOn && sPChamfBotOn.checked) {
            payload.piece_chamfer_bottom = parseFloat(document.getElementById('sliding_piece_chamfer_bottom').value) || 0.3;
        }
        // Slider base chamfer — per-edge granularity
        const sBChamfTOOn = document.getElementById('sliding_base_chamfer_top_outer_on');
        if (sBChamfTOOn && sBChamfTOOn.checked) {
            payload.base_chamfer_top_outer = parseFloat(document.getElementById('sliding_base_chamfer_top_outer').value) || 0.3;
        }
        const sBChamfTIOn = document.getElementById('sliding_base_chamfer_top_inner_on');
        if (sBChamfTIOn && sBChamfTIOn.checked) {
            payload.base_chamfer_top_inner = parseFloat(document.getElementById('sliding_base_chamfer_top_inner').value) || 0.3;
        }
        const sBChamfBOOn = document.getElementById('sliding_base_chamfer_bottom_outer_on');
        if (sBChamfBOOn && sBChamfBOOn.checked) {
            payload.base_chamfer_bottom_outer = parseFloat(document.getElementById('sliding_base_chamfer_bottom_outer').value) || 0.3;
        }
        const sBChamfBIOn = document.getElementById('sliding_base_chamfer_bottom_inner_on');
        if (sBChamfBIOn && sBChamfBIOn.checked) {
            payload.base_chamfer_bottom_inner = parseFloat(document.getElementById('sliding_base_chamfer_bottom_inner').value) || 0.3;
        }
        // Slider base corner style
        payload.sliding_base_corner_style = (document.getElementById('sliding_base_corner_style') || {}).value || 'round';
        payload.sliding_base_corner_radius = parseFloat((document.getElementById('sliding_base_corner_radius') || {}).value) || 2.0;
        // Interior: "same as piece" checkbox overrides inner style/radius
        const sBaseInnerSame = document.getElementById('sliding_base_inner_same_as_piece');
        if (sBaseInnerSame && sBaseInnerSame.checked) {
            const sPieceStyle = (document.getElementById('sliding_corner_style') || {}).value || 'sharp';
            payload.sliding_base_corner_style_inner = sPieceStyle;
            if (sPieceStyle !== 'sharp') {
                payload.sliding_base_corner_radius_inner = parseFloat((document.getElementById('sliding_corner_radius') || {}).value) || 1.0;
            }
        } else {
            payload.sliding_base_corner_style_inner = (document.getElementById('sliding_base_corner_style_inner') || {}).value || 'round';
            payload.sliding_base_corner_radius_inner = parseFloat((document.getElementById('sliding_base_corner_radius_inner') || {}).value) || 1.0;
        }
    }

    // Pass contoured base flag for hex/circular jigsaw
    const contouredBaseEl = document.getElementById('jigsaw_contoured_base');
    if (contouredBaseEl) payload.contoured_base = contouredBaseEl.checked;

    // Pass truncate_edge flag for hex/circular jigsaw
    const truncateEdgeEl = document.getElementById('jigsaw_truncate_edge');
    if (truncateEdgeEl) payload.truncate_edge = truncateEdgeEl.checked;

    // Pattern offset from 2D viewer drag (convert screen pixels to model mm)
    const offsetScale = viewer2DScale > 0 ? viewer2DScale : 1;
    if (isTexture || isImage) {
        payload.texture_offset_x = patternOffsetX / offsetScale;
        payload.texture_offset_y = patternOffsetY / offsetScale;
    } else {
        payload.infill_offset_x = patternOffsetX / offsetScale;
        payload.infill_offset_y = patternOffsetY / offsetScale;
    }

    // Common infill params (all non-solid types)
    if (infillType !== 'solid') {
        payload.infill_wall = parseFloat(document.getElementById('stl_infill_wall').value);
    }

    // Per-type specific params (angle included per-type where applicable)
    if (infillType === 'grid') {
        payload.infill_fill_width = parseFloat(document.getElementById('stl_infill_fill_width').value);
        payload.infill_spacing = parseFloat(document.getElementById('stl_infill_spacing').value);
        payload.infill_angle = parseFloat(document.getElementById('stl_infill_angle_grid').value);
    } else if (infillType === 'stripes') {
        payload.infill_fill_width = parseFloat(document.getElementById('stl_infill_fill_width_s').value);
        payload.infill_spacing = parseFloat(document.getElementById('stl_infill_spacing_s').value);
        payload.infill_angle = parseFloat(document.getElementById('stl_infill_angle_stripes').value);
    } else if (infillType === 'zigzag') {
        payload.infill_fill_width = parseFloat(document.getElementById('stl_infill_fill_width_z').value);
        payload.infill_spacing = parseFloat(document.getElementById('stl_infill_spacing_z').value);
        payload.infill_amplitude = parseFloat(document.getElementById('stl_infill_amplitude').value);
        payload.infill_angle = parseFloat(document.getElementById('stl_infill_angle_zigzag').value);
    } else if (infillType === 'honeycomb') {
        payload.infill_fill_width = parseFloat(document.getElementById('stl_infill_fill_width_h').value);
        payload.infill_cell_size = parseFloat(document.getElementById('stl_infill_cell_size').value);
        payload.infill_angle = parseFloat(document.getElementById('stl_infill_angle_honeycomb').value);
    } else if (infillType === 'circles') {
        payload.infill_fill_width = parseFloat(document.getElementById('stl_infill_fill_width_c').value);
        payload.infill_fill_gaps = true; // always fill gaps for Lego pattern
        payload.infill_circle_radius = parseFloat((document.getElementById('stl_infill_circle_radius') || {}).value) || 40;
        payload.infill_circle_filled = (document.getElementById('stl_infill_circle_filled') || {}).checked !== false;
    }

    // Texture mode params
    if (isTexture || isImage) {
        if (isImage) {
            payload.texture_type = 'custom';
            payload.texture_direction = (document.getElementById('stl_image_direction') || {}).value || 'outward';
            payload.texture_height = parseFloat((document.getElementById('stl_image_height') || {}).value) || 0.6;
            payload.texture_wall = parseFloat((document.getElementById('stl_image_wall') || {}).value) || 1.5;
            payload.texture_no_border = (document.getElementById('stl_image_no_border') || {}).checked || false;
            payload.texture_line_thickness = parseInt((document.getElementById('stl_image_line_thickness') || {}).value) || 0;
            payload.texture_engrave_depth = parseFloat((document.getElementById('stl_image_engrave_depth') || {}).value) || 0.4;
            // Include the processed B/W image as raw pixel data for STL generation
            if (customTextureImage) {
                const zoom = parseFloat((document.getElementById('stl_texture_custom_zoom') || {}).value) || 100;
                payload.texture_zoom = zoom;
                const imgCtx = customTextureImage.getContext('2d');
                const imgData = imgCtx.getImageData(0, 0, customTextureImage.width, customTextureImage.height);
                const gray = new Uint8Array(customTextureImage.width * customTextureImage.height);
                for (let i = 0; i < gray.length; i++) gray[i] = imgData.data[i * 4];
                payload.texture_image_data = Array.from(gray);
                payload.texture_image_width = customTextureImage.width;
                payload.texture_image_height = customTextureImage.height;
            }
        } else {
        const textureType = document.getElementById('stl_texture_type').value;
        payload.texture_type = textureType;
        payload.texture_direction = document.getElementById('stl_texture_direction').value;
        payload.texture_height = parseFloat(document.getElementById('stl_texture_height').value);
        payload.texture_wall = parseFloat(document.getElementById('stl_texture_wall').value);
        payload.texture_no_border = document.getElementById('stl_texture_no_border').checked;
        payload.texture_invert = document.getElementById('stl_texture_invert').checked;
        payload.texture_engrave_depth = parseFloat((document.getElementById('stl_texture_engrave_depth') || {}).value) || 0.4;

        // Pattern-specific texture params
        if (textureType === 'grid') {
            payload.texture_fill_width = parseFloat(document.getElementById('stl_texture_fill_width_grid').value);
            payload.texture_spacing = parseFloat(document.getElementById('stl_texture_spacing_grid').value);
            payload.texture_angle = parseFloat(document.getElementById('stl_texture_angle_grid').value);
        } else if (textureType === 'stripes') {
            payload.texture_fill_width = parseFloat(document.getElementById('stl_texture_fill_width_stripes').value);
            payload.texture_spacing = parseFloat(document.getElementById('stl_texture_spacing_stripes').value);
            payload.texture_angle = parseFloat(document.getElementById('stl_texture_angle_stripes').value);
        } else if (textureType === 'zigzag') {
            payload.texture_fill_width = parseFloat(document.getElementById('stl_texture_fill_width_zigzag').value);
            payload.texture_spacing = parseFloat(document.getElementById('stl_texture_spacing_zigzag').value);
            payload.texture_amplitude = parseFloat(document.getElementById('stl_texture_amplitude').value);
            payload.texture_angle = parseFloat(document.getElementById('stl_texture_angle_zigzag').value);
        } else if (textureType === 'honeycomb') {
            payload.texture_fill_width = parseFloat(document.getElementById('stl_texture_fill_width_honeycomb').value);
            payload.texture_cell_size = parseFloat(document.getElementById('stl_texture_cell_size').value);
            payload.texture_angle = parseFloat(document.getElementById('stl_texture_angle_honeycomb').value);
        } else if (textureType === 'circles') {
            payload.texture_fill_width = parseFloat(document.getElementById('stl_texture_fill_width_circles').value);
            payload.texture_circle_radius = parseFloat((document.getElementById('stl_texture_circle_radius') || {}).value) || 40;
            payload.texture_circle_filled = (document.getElementById('stl_texture_circle_filled') || {}).checked !== false;
        }
        }
    }

    // Corner style (pieces)
    const cornerStyle = document.getElementById('stl_corner_style');
    if (cornerStyle) payload.corner_style = cornerStyle.value;
    const cornerRadius = document.getElementById('stl_corner_radius');
    if (cornerRadius && cornerStyle && cornerStyle.value !== 'sharp') {
        payload.corner_radius = parseFloat(cornerRadius.value);
    }
    const cornerInnerCheck = document.getElementById('stl_corner_inner');
    if (cornerInnerCheck && cornerInnerCheck.checked) {
        payload.corner_inner = true;
    }

    // Force sharp corners for jigsaw, fractal-circular, and fractal-octagonal (no piece corner adjustment)
    const isFracCircular = payload.puzzle_type === 'fractal' &&
        parseInt(payload.arc_shape) === 0;
    const isFracOctagonal = payload.puzzle_type === 'fractal' &&
        parseInt(payload.arc_shape) === 2;
    if (payload.puzzle_type === 'jigsaw' || isFracCircular || isFracOctagonal) {
        payload.corner_style = 'sharp';
        delete payload.corner_radius;
    }

    // Piece chamfer (Z-axis)
    const pChamfTopOn = document.getElementById('piece_chamfer_top_on');
    const pChamfBotOn = document.getElementById('piece_chamfer_bottom_on');
    if (pChamfTopOn && pChamfTopOn.checked) {
        payload.piece_chamfer_top = parseFloat(document.getElementById('piece_chamfer_top').value) || 0.5;
    }
    if (pChamfBotOn && pChamfBotOn.checked) {
        payload.piece_chamfer_bottom = parseFloat(document.getElementById('piece_chamfer_bottom').value) || 0.5;
    }

    // Base corner style
    const baseCornerStyle = document.getElementById('stl_base_corner_style');
    if (baseCornerStyle) payload.base_corner_style = baseCornerStyle.value;
    // Interior: "same as piece" checkbox overrides inner style/radius
    // Use payload.corner_style (already forced to sharp for jigsaw/fractal-circular/octagonal)
    const baseInnerSame = document.getElementById('base_inner_same_as_piece');
    if (baseInnerSame && baseInnerSame.checked) {
        payload.base_corner_style_inner = payload.corner_style || 'sharp';
        if (payload.corner_style !== 'sharp' && payload.corner_radius) {
            payload.base_corner_radius_inner = payload.corner_radius;
        }
    } else {
        const baseCornerStyleInner = document.getElementById('stl_base_corner_style_inner');
        if (baseCornerStyleInner) payload.base_corner_style_inner = baseCornerStyleInner.value;
        const baseCornerRadiusInner = document.getElementById('stl_base_corner_radius_inner');
        if (baseCornerRadiusInner && baseCornerStyleInner && baseCornerStyleInner.value !== 'sharp') {
            payload.base_corner_radius_inner = parseFloat(baseCornerRadiusInner.value);
        }
    }
    const baseCornerRadius = document.getElementById('stl_base_corner_radius');
    if (baseCornerRadius && baseCornerStyle && baseCornerStyle.value !== 'sharp') {
        payload.base_corner_radius = parseFloat(baseCornerRadius.value);
    }

    // Base chamfer (Z-axis) — per-edge granularity
    const bChamfTOOn = document.getElementById('base_chamfer_top_outer_on');
    const bChamfTIOn = document.getElementById('base_chamfer_top_inner_on');
    const bChamfBOOn = document.getElementById('base_chamfer_bottom_outer_on');
    if (bChamfTOOn && bChamfTOOn.checked) {
        payload.base_chamfer_top_outer = parseFloat(document.getElementById('base_chamfer_top_outer').value) || 0.5;
    }
    if (bChamfTIOn && bChamfTIOn.checked) {
        payload.base_chamfer_top_inner = parseFloat(document.getElementById('base_chamfer_top_inner').value) || 0.5;
    }
    if (bChamfBOOn && bChamfBOOn.checked) {
        payload.base_chamfer_bottom_outer = parseFloat(document.getElementById('base_chamfer_bottom_outer').value) || 0.5;
    }

    // Fill border gaps (fractal bases)
    const fillBorderGapsEl = document.getElementById('stl_fill_border_gaps');
    if (fillBorderGapsEl) payload.fill_border_gaps = fillBorderGapsEl.checked;

    return payload;
}

async function exportSTL(mode) {
    if (!puzzleData.grid || !puzzleData.pieces) {
        showDownloadStatus('⚠️ Primero genera un puzzle', 'error');
        return;
    }

    const payload = buildSTLPayload(mode);

    const fileNames = { pieces: 'puzzle_piezas.stl', base: 'puzzle_base.stl', both: 'puzzle_completo.stl' };
    const fileName = fileNames[mode] || 'puzzle_project.stl';

    try {
        showDownloadStatus('⏳ Generando STL...', 'info');

        const response = await fetch('/api/export_stl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showDownloadStatus('✅ STL descargado', 'success');
        } else {
            const errorData = await response.json();
            showDownloadStatus(`❌ Error: ${errorData.error}`, 'error');
        }
    } catch (error) {
        showDownloadStatus(`❌ Error: ${error.message}`, 'error');
    }
}

async function exportSTLSeparate() {
    if (!puzzleData.grid || !puzzleData.pieces) {
        showDownloadStatus('⚠️ Primero genera un puzzle', 'error');
        return;
    }

    try {
        showDownloadStatus('⏳ Generando piezas y base por separado...', 'info');

        // Export pieces
        await exportSTL('pieces');
        // Small delay before exporting base
        await new Promise(resolve => setTimeout(resolve, 500));
        // Export base
        await exportSTL('base');
    } catch (error) {
        showDownloadStatus(`❌ Error: ${error.message}`, 'error');
    }
}

async function export3MF() {
    if (!puzzleData.grid && !puzzleData.svg_paths) {
        showDownloadStatus('⚠️ Primero genera un puzzle', 'error');
        return;
    }

    const payload = buildSTLPayload('both');
    // Add color info
    const colors = getColorElements();
    const pieceColorEl = colors.pieces;
    const baseColorEl = colors.base;
    const reliefColorEl = colors.relief;
    payload.color_pieces = pieceColorEl ? pieceColorEl.value : '#6699CC';
    payload.color_base = baseColorEl ? baseColorEl.value : '#808080';
    payload.color_relief = reliefColorEl ? reliefColorEl.value : '#FF6633';

    try {
        showDownloadStatus('⏳ Generando 3MF multi-color...', 'info');

        const response = await fetch('/api/export_3mf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'puzzle_multicolor.3mf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showDownloadStatus('✅ 3MF multi-color descargado', 'success');
        } else {
            const errorData = await response.json();
            showDownloadStatus(`❌ Error: ${errorData.error}`, 'error');
        }
    } catch (error) {
        showDownloadStatus(`❌ Error: ${error.message}`, 'error');
    }
}

async function viewSTL() {
    try {
        const payload = buildSTLPayload();
        if (!payload.include_pieces && !payload.include_base) {
            // Nothing to show — clear the viewer
            if (threeGroup) {
                while (threeGroup.children.length) threeGroup.remove(threeGroup.children[0]);
                addPrinterBed(threeGroup);
            }
            showExportStatus('ℹ️ Nada que mostrar — selecciona piezas o base', 'info');
            return;
        }
        showExportStatus('⏳ Generando y cargando modelo...', 'info');

        // Fetch separate base/pieces STL data for multi-color viewing
        const response = await fetch('/api/export_stl_separate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            showExportStatus(`❌ Error: ${errorData.error}`, 'error');
            return;
        }

        const data = await response.json();
        if (!data.success) {
            showExportStatus(`❌ Error: ${data.error}`, 'error');
            return;
        }

        // Get colors from pickers
        const colors = getColorElements();
        const pieceColorEl = colors.pieces;
        const baseColorEl = colors.base;
        const reliefColorEl = colors.relief;
        const pieceColor = pieceColorEl ? pieceColorEl.value : '#6699CC';
        const baseColor = baseColorEl ? baseColorEl.value : '#808080';
        const reliefColor = reliefColorEl ? reliefColorEl.value : '#FF6633';

        // Load into Three.js with separate colors
        const threeOk = await loadThreeFromSeparate(data.base, data.pieces, baseColor, pieceColor, data.relief, reliefColor);

        if (threeOk) {
            showExportStatus('✅ Modelo cargado correctamente', 'success');
        } else {
            showExportStatus('❌ Error: no se pudo cargar el modelo', 'error');
        }
    } catch (error) {
        showExportStatus(`❌ Error: ${error.message}`, 'error');
    }
}

// Cambiar modo de visualización
function switchView(event, mode) {
    event.preventDefault();
    puzzleData.viewMode = mode;
    
    // Redibujar con la nueva vista
    if (puzzleData.puzzleType === 'sliding') {
        if (mode === 'flat') {
            drawPuzzleFlat();
        } else {
            setFractalVisibility(false);
            drawSlidingPuzzle();
        }
    } else if (puzzleData.puzzleType === 'fractal' || puzzleData.puzzleType === 'jigsaw') {
        drawPuzzleFractal();
    } else {
        if (mode === 'flat') {
            drawPuzzleFlat();
        } else {
            setFractalVisibility(false);
            drawPuzzle();
        }
    }
}

// Sliding puzzle preview (isometric 3D-like view)
function drawSlidingPuzzle() {
    if (!puzzleData.grid) return;

    const grid = puzzleData.grid;
    const M = grid.length;
    const N = grid[0].length;

    const w = puzzleCanvas.width;
    const h = puzzleCanvas.height;

    // Clear canvas
    const gradientBg = puzzleCtx.createLinearGradient(0, 0, w, h);
    gradientBg.addColorStop(0, '#f5f7fa');
    gradientBg.addColorStop(1, '#e9ecef');
    puzzleCtx.fillStyle = gradientBg;
    puzzleCtx.fillRect(0, 0, w, h);

    // Dimensions in model units (each cell = 1 unit)
    const border = 0.3;
    const extrudeH = 0.25;

    const baseShape = [
        [-border, -border],
        [N + border, -border],
        [N + border, M + border],
        [-border, M + border]
    ];

    // Isometric projection
    const projectTop = (x, y) => [(x - y) * ISO_COS30, (x + y) * ISO_SIN30];
    const projectBot = (x, y) => [(x - y) * ISO_COS30, (x + y) * ISO_SIN30 + extrudeH];

    // Bounding box
    let bMinX = Infinity, bMaxX = -Infinity, bMinY = Infinity, bMaxY = -Infinity;
    for (const [bx, by] of baseShape) {
        const [sx1, sy1] = projectTop(bx, by);
        const [sx2, sy2] = projectBot(bx, by);
        bMinX = Math.min(bMinX, sx1, sx2);
        bMaxX = Math.max(bMaxX, sx1, sx2);
        bMinY = Math.min(bMinY, sy1, sy2);
        bMaxY = Math.max(bMaxY, sy1, sy2);
    }
    const projW = bMaxX - bMinX;
    const projH = bMaxY - bMinY;
    const margin = 20;
    const fitScale = Math.min((w - margin * 2) / projW, (h - margin * 2) / projH);
    const offX = w / 2 - (bMinX + projW / 2) * fitScale;
    const offY = h / 2 - (bMinY + projH / 2) * fitScale;
    const toScreen = (px, py) => [px * fitScale + offX, py * fitScale + offY];

    // Draw frame base
    const baseColor = '#a0a8b8';
    const baseTopScreen = baseShape.map(([bx, by]) => toScreen(...projectTop(bx, by)));
    const baseBotScreen = baseShape.map(([bx, by]) => toScreen(...projectBot(bx, by)));

    // Draw front-facing side walls of base
    for (let j = 0; j < 4; j++) {
        const j2 = (j + 1) % 4;
        const mx = (baseShape[j][0] + baseShape[j2][0]) / 2;
        const my = (baseShape[j][1] + baseShape[j2][1]) / 2;
        const cx = (N) / 2, cy = (M) / 2;
        if ((mx - cx) + (my - cy) > 0) {
            puzzleCtx.fillStyle = '#8890a0';
            puzzleCtx.beginPath();
            puzzleCtx.moveTo(baseTopScreen[j][0], baseTopScreen[j][1]);
            puzzleCtx.lineTo(baseTopScreen[j2][0], baseTopScreen[j2][1]);
            puzzleCtx.lineTo(baseBotScreen[j2][0], baseBotScreen[j2][1]);
            puzzleCtx.lineTo(baseBotScreen[j][0], baseBotScreen[j][1]);
            puzzleCtx.closePath();
            puzzleCtx.fill();
        }
    }

    // Base top face
    puzzleCtx.fillStyle = baseColor;
    puzzleCtx.beginPath();
    puzzleCtx.moveTo(baseTopScreen[0][0], baseTopScreen[0][1]);
    for (let j = 1; j < 4; j++) puzzleCtx.lineTo(baseTopScreen[j][0], baseTopScreen[j][1]);
    puzzleCtx.closePath();
    puzzleCtx.fill();

    // Gap between tiles
    const gap = 0.06;
    const tileH = 0.15;
    const totalPieces = M * N - 1;

    // Draw tiles back-to-front (top-left last for correct overlap)
    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            const val = grid[r][c];
            if (val === 0) continue; // empty cell

            const x1 = c + gap, y1 = r + gap;
            const x2 = c + 1 - gap, y2 = r + 1 - gap;

            const colorIdx = (val - 1) % PIECE_COLORS.length;
            const tileColor = PIECE_COLORS[colorIdx];
            const tileShadow = SHADOW_COLORS[colorIdx];

            // Tile top corners
            const tTop = [
                toScreen(...projectTop(x1, y1)),
                toScreen(...projectTop(x2, y1)),
                toScreen(...projectTop(x2, y2)),
                toScreen(...projectTop(x1, y2))
            ];
            // Tile bottom corners (sits on base)
            const projectTileBot = (x, y) => {
                const [px, py] = projectTop(x, y);
                return [px, py + tileH];
            };
            const tBot = [
                toScreen(...projectTileBot(x1, y1)),
                toScreen(...projectTileBot(x2, y1)),
                toScreen(...projectTileBot(x2, y2)),
                toScreen(...projectTileBot(x1, y2))
            ];

            // Side walls (front-facing)
            const tileCx = (x1 + x2) / 2, tileCy = (y1 + y2) / 2;
            for (let j = 0; j < 4; j++) {
                const j2 = (j + 1) % 4;
                const corners = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
                const emx = (corners[j][0] + corners[j2][0]) / 2;
                const emy = (corners[j][1] + corners[j2][1]) / 2;
                if ((emx - tileCx) + (emy - tileCy) > 0) {
                    puzzleCtx.fillStyle = tileShadow;
                    puzzleCtx.beginPath();
                    puzzleCtx.moveTo(tTop[j][0], tTop[j][1]);
                    puzzleCtx.lineTo(tTop[j2][0], tTop[j2][1]);
                    puzzleCtx.lineTo(tBot[j2][0], tBot[j2][1]);
                    puzzleCtx.lineTo(tBot[j][0], tBot[j][1]);
                    puzzleCtx.closePath();
                    puzzleCtx.fill();
                }
            }

            // Tile top face
            puzzleCtx.fillStyle = tileColor;
            puzzleCtx.beginPath();
            puzzleCtx.moveTo(tTop[0][0], tTop[0][1]);
            for (let j = 1; j < 4; j++) puzzleCtx.lineTo(tTop[j][0], tTop[j][1]);
            puzzleCtx.closePath();
            puzzleCtx.fill();

            // Tile number
            const centerScreen = toScreen(...projectTop((x1 + x2) / 2, (y1 + y2) / 2));
            puzzleCtx.fillStyle = 'rgba(0,0,0,0.5)';
            puzzleCtx.font = `bold ${Math.round(fitScale * 0.35)}px sans-serif`;
            puzzleCtx.textAlign = 'center';
            puzzleCtx.textBaseline = 'middle';
            puzzleCtx.fillText(val, centerScreen[0], centerScreen[1]);
        }
    }

    // Draw empty cell marker
    const emptyR = puzzleData.slidingEmptyRow;
    const emptyC = puzzleData.slidingEmptyCol;
    if (emptyR !== undefined && emptyC !== undefined) {
        const ex = emptyC + 0.5, ey = emptyR + 0.5;
        const es = toScreen(...projectTop(ex, ey));
        puzzleCtx.fillStyle = 'rgba(0,0,0,0.15)';
        puzzleCtx.font = `bold ${Math.round(fitScale * 0.4)}px sans-serif`;
        puzzleCtx.textAlign = 'center';
        puzzleCtx.textBaseline = 'middle';
        puzzleCtx.fillText('×', es[0], es[1]);
    }
}

// Vista plana (original)
function drawPuzzleFlat() {
    if (!puzzleData.grid || !puzzleData.pieces) return;

    const grid = puzzleData.grid;
    const pieces = puzzleData.pieces;
    const M = grid.length;
    const N = grid[0].length;

    // Use SVG container (same aesthetic as fractal/jigsaw flat)
    setFractalVisibility(true);

    const baseBorder = Math.max(N, M) * VIEWER_PARAMS.flatBaseBorderFactor;
    const pad = Math.max(N, M) * VIEWER_PARAMS.flatPadFactor;
    const container = document.getElementById('fractal-puzzle-svg');
    container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `${-baseBorder - pad} ${-baseBorder - pad} ${N + (baseBorder + pad) * 2} ${M + (baseBorder + pad) * 2}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)';
    svg.style.borderRadius = '8px';

    // Background
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('x', -baseBorder - pad);
    bgRect.setAttribute('y', -baseBorder - pad);
    bgRect.setAttribute('width', N + (baseBorder + pad) * 2);
    bgRect.setAttribute('height', M + (baseBorder + pad) * 2);
    bgRect.setAttribute('fill', '#f5f7fa');
    svg.appendChild(bgRect);

    // Base rectangle with border margin
    const baseStrokeW = Math.max(N, M) * VIEWER_PARAMS.flatBaseStrokeFactor;
    const baseRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    baseRect.setAttribute('x', -baseBorder);
    baseRect.setAttribute('y', -baseBorder);
    baseRect.setAttribute('width', N + baseBorder * 2);
    baseRect.setAttribute('height', M + baseBorder * 2);
    baseRect.setAttribute('fill', '#e8ecf2');
    baseRect.setAttribute('stroke', '#b0b8c8');
    baseRect.setAttribute('stroke-width', baseStrokeW);
    baseRect.setAttribute('rx', '0.08');
    svg.appendChild(baseRect);

    // Build cell-to-piece map
    let cellPieceMap = {};
    const isSliding = puzzleData.puzzleType === 'sliding';
    for (let idx = 0; idx < pieces.length; idx++) {
        if (isSliding) {
            // Sliding pieces are {id, row, col}
            cellPieceMap[`${pieces[idx].row},${pieces[idx].col}`] = idx;
        } else {
            for (let cell of pieces[idx]) {
                cellPieceMap[`${cell[0]},${cell[1]}`] = idx;
            }
        }
    }

    const strokeW = Math.max(N, M) * 0.002;

    // Draw cells
    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            const val = grid[r][c];
            const pieceIdx = cellPieceMap[`${r},${c}`];

            let color;
            if (val === 0) color = '#555555';
            else if (val === -1) color = '#f0f0f0';
            else if (pieceIdx !== undefined && pieceIdx >= 0) {
                color = PIECE_COLORS[pieceIdx % PIECE_COLORS.length];
            } else {
                color = '#e0e0e0';
            }

            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', c);
            rect.setAttribute('y', r);
            rect.setAttribute('width', 1);
            rect.setAttribute('height', 1);
            rect.setAttribute('fill', color);
            svg.appendChild(rect);
        }
    }

    // Draw piece outlines (edges between different pieces)
    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            const pieceIdx = cellPieceMap[`${r},${c}`] ?? -1;
            // Right edge
            if (c + 1 < N) {
                const rightIdx = cellPieceMap[`${r},${c + 1}`] ?? -1;
                if (rightIdx !== pieceIdx) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', c + 1);
                    line.setAttribute('y1', r);
                    line.setAttribute('x2', c + 1);
                    line.setAttribute('y2', r + 1);
                    line.setAttribute('stroke', 'rgba(0,0,0,0.4)');
                    line.setAttribute('stroke-width', strokeW);
                    svg.appendChild(line);
                }
            }
            // Bottom edge
            if (r + 1 < M) {
                const bottomIdx = cellPieceMap[`${r + 1},${c}`] ?? -1;
                if (bottomIdx !== pieceIdx) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', c);
                    line.setAttribute('y1', r + 1);
                    line.setAttribute('x2', c + 1);
                    line.setAttribute('y2', r + 1);
                    line.setAttribute('stroke', 'rgba(0,0,0,0.4)');
                    line.setAttribute('stroke-width', strokeW);
                    svg.appendChild(line);
                }
            }
        }
    }

    // Border outline
    const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    border.setAttribute('x', 0);
    border.setAttribute('y', 0);
    border.setAttribute('width', N);
    border.setAttribute('height', M);
    border.setAttribute('fill', 'none');
    border.setAttribute('stroke', 'rgba(0,0,0,0.3)');
    border.setAttribute('stroke-width', strokeW);
    svg.appendChild(border);

    container.appendChild(svg);
}

// =====================================================
// FRACTAL JIGSAW: Renderizado SVG
// =====================================================

// Muestra/oculta los elementos canvas vs SVG según el tipo de puzzle
function setFractalVisibility(isFractal) {
    const puzzleSvg = document.getElementById('fractal-puzzle-svg');
    if (isFractal) {
        // For flat mode: show SVG, hide canvas. For isometric: show canvas, hide SVG.
        if (puzzleData.viewMode === 'flat') {
            puzzleCanvas.style.display = 'none';
            puzzleSvg.style.display = 'block';
        } else {
            puzzleCanvas.style.display = 'block';
            puzzleSvg.style.display = 'none';
        }
    } else {
        puzzleCanvas.style.display = 'block';
        puzzleSvg.style.display = 'none';
    }
    // Gallery always uses canvas now
    galleryCanvas.style.display = 'block';
}

// Dibuja el puzzle fractal: isométrico o plano (SVG)
function drawPuzzleFractal() {
    if (puzzleData.viewMode === 'isometric') {
        drawPuzzleFractalIsometric();
    } else {
        drawPuzzleFractalFlat();
    }
}

/**
 * Parse an SVG path 'd' string (M/A/L/C/Z commands) into polygon points.
 * Pure math — no DOM manipulation. arcSegs controls smoothness of arcs.
 */
function parseSvgPathToPoints(d, arcSegs) {
    if (!d) return [];
    const pts = [];
    let cx = 0, cy = 0;
    // Tokenize: split on command letters, keeping them
    const tokens = d.match(/[MALZCmalzc][^MALZCmalzc]*/g);
    if (!tokens) return [];

    for (const token of tokens) {
        const cmd = token[0];
        const nums = token.slice(1).trim().replace(/,/g, ' ').split(/\s+/).filter(s => s.length > 0).map(Number);

        if (cmd === 'M' || cmd === 'm') {
            cx = nums[0]; cy = nums[1];
            pts.push(cx, cy);
        } else if (cmd === 'L') {
            for (let k = 0; k < nums.length; k += 2) {
                cx = nums[k]; cy = nums[k + 1];
                pts.push(cx, cy);
            }
        } else if (cmd === 'l') {
            for (let k = 0; k < nums.length; k += 2) {
                cx += nums[k]; cy += nums[k + 1];
                pts.push(cx, cy);
            }
        } else if (cmd === 'A' || cmd === 'a') {
            // A rx ry x-rot large-arc sweep ex ey
            for (let k = 0; k + 6 < nums.length; k += 7) {
                const rx = nums[k];
                const largeArc = nums[k + 3];
                const sweepFlag = nums[k + 4];
                let ex = nums[k + 5], ey = nums[k + 6];
                if (cmd === 'a') { ex += cx; ey += cy; }

                // Compute arc center
                const dx = ex - cx, dy = ey - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 1e-9 || dist > 2 * rx) {
                    cx = ex; cy = ey;
                    pts.push(cx, cy);
                    continue;
                }
                const a = dist / 2;
                const h = Math.sqrt(Math.max(0, rx * rx - a * a));
                const mx = (cx + ex) / 2, my = (cy + ey) / 2;
                const px = -dy / dist, py = dx / dist;
                const acx = sweepFlag === 1 ? mx + h * px : mx - h * px;
                const acy = sweepFlag === 1 ? my + h * py : my - h * py;

                // Compute sweep angle
                let startA = Math.atan2(cy - acy, cx - acx);
                let endA = Math.atan2(ey - acy, ex - acx);
                let sweep = endA - startA;
                if (sweepFlag === 1) {
                    if (sweep > 0) sweep -= 2 * Math.PI;
                    if (largeArc === 0 && sweep < -Math.PI) sweep += 2 * Math.PI;
                } else {
                    if (sweep < 0) sweep += 2 * Math.PI;
                    if (largeArc === 0 && sweep > Math.PI) sweep -= 2 * Math.PI;
                }

                // Tessellate arc
                for (let s = 1; s <= arcSegs; s++) {
                    const t = s / arcSegs;
                    const angle = startA + t * sweep;
                    pts.push(acx + rx * Math.cos(angle), acy + rx * Math.sin(angle));
                }
                cx = ex; cy = ey;
            }
        } else if (cmd === 'C' || cmd === 'c') {
            // Cubic bezier: C x1 y1 x2 y2 ex ey (absolute) / c dx1 dy1 dx2 dy2 dex dey (relative)
            for (let k = 0; k + 5 < nums.length; k += 6) {
                let x1 = nums[k], y1 = nums[k+1];
                let x2 = nums[k+2], y2 = nums[k+3];
                let ex = nums[k+4], ey = nums[k+5];
                if (cmd === 'c') {
                    x1 += cx; y1 += cy;
                    x2 += cx; y2 += cy;
                    ex += cx; ey += cy;
                }
                const segs = arcSegs || 8;
                for (let s = 1; s <= segs; s++) {
                    const t = s / segs;
                    const mt = 1 - t;
                    const px = mt*mt*mt*cx + 3*mt*mt*t*x1 + 3*mt*t*t*x2 + t*t*t*ex;
                    const py = mt*mt*mt*cy + 3*mt*mt*t*y1 + 3*mt*t*t*y2 + t*t*t*ey;
                    pts.push(px, py);
                }
                cx = ex; cy = ey;
            }
        }
        // Z: ignore (polygon is implicitly closed)
    }
    return pts; // flat array [x0,y0, x1,y1, ...]
}

// Precomputed isometric constants
const ISO_COS30 = Math.cos(Math.PI / 6); // ≈ 0.866
const ISO_SIN30 = 0.5;

// Isometric view for fractal: extrude actual SVG path shapes in 3D
function drawPuzzleFractalIsometric() {
    const svgPaths = puzzleData.svgPaths;
    if (!svgPaths || !svgPaths.length) return;

    setFractalVisibility(true);

    const w = puzzleCanvas.width;
    const h = puzzleCanvas.height;

    // Clear canvas
    const gradientBg = puzzleCtx.createLinearGradient(0, 0, w, h);
    gradientBg.addColorStop(0, '#f5f7fa');
    gradientBg.addColorStop(1, '#e9ecef');
    puzzleCtx.fillStyle = gradientBg;
    puzzleCtx.fillRect(0, 0, w, h);

    const isJigsaw = puzzleData.puzzleType === 'jigsaw';
    const ncols = puzzleData.fractalNcols || 1;
    const nrows = puzzleData.fractalNrows || 1;
    const jt = puzzleData.jigsawType;
    const isHex = isJigsaw && (jt === 'hexagonal' || jt === 'circular');

    // Check contoured_base checkbox to decide base shape
    const contouredBaseEl = document.getElementById('jigsaw_contoured_base');
    const contouredBase = isHex && contouredBaseEl && contouredBaseEl.checked;

    // Check truncate_edge for piece clipping
    const truncateEdge = puzzleData.truncateEdge || false;

    // Coordinate range: fractal uses ncols*2, jigsaw uses ncols
    const coordW = isJigsaw ? ncols : ncols * 2;
    const coordH = isJigsaw ? nrows : nrows * 2;

    // Border margin around pieces
    const baseBorder = Math.max(coordW, coordH) * VIEWER_PARAMS.baseBorderFactor;

    // Base extrusion height in SVG-coordinate units
    const extrudeH = Math.max(coordW, coordH) * VIEWER_PARAMS.extrudeHeightFactor;

    // Build base shape points (in SVG coordinates)
    let baseShape;
    if (contouredBase) {
        // Hexagonal or circular base matching puzzle shape
        const cx = coordW / 2, cy = coordH / 2;
        const r = Math.min(coordW, coordH) / 2 + baseBorder;
        if (jt === 'circular') {
            // Smooth circle with many segments
            const nSegs = VIEWER_PARAMS.circleBaseSegments;
            baseShape = [];
            for (let i = 0; i < nSegs; i++) {
                const angle = i * 2 * Math.PI / nSegs;
                baseShape.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
            }
        } else {
            // Flat-top hexagon (matching Draradech orientation)
            baseShape = [];
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI - i * Math.PI / 3;
                baseShape.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
            }
        }
    } else {
        // Rectangle base with border
        baseShape = [
            [-baseBorder, -baseBorder],
            [coordW + baseBorder, -baseBorder],
            [coordW + baseBorder, coordH + baseBorder],
            [-baseBorder, coordH + baseBorder]
        ];
    }

    // Build clip boundary for truncate_edge (hex/circle outline for pieces)
    let clipShape = null;
    if (truncateEdge && isHex) {
        const cx = coordW / 2, cy = coordH / 2;
        const hexR = puzzleData.hexRadius || (Math.min(coordW, coordH) / 2 * 0.95);
        const hexOff = puzzleData.hexOffset || 0;
        // Clip radius in SVG coords: hexR is in normalized units, center is at hexR + hexOff
        if (jt === 'circular') {
            clipShape = { type: 'circle', cx, cy, r: hexR };
        } else {
            clipShape = { type: 'hex', cx, cy, r: hexR };
        }
    }

    // Parse all pieces
    const arcSegs = 8;
    const piecesFlat = [];
    for (let i = 0; i < svgPaths.length; i++) {
        const flat = parseSvgPathToPoints(svgPaths[i], arcSegs);
        if (flat.length < 6) continue;
        piecesFlat.push({ idx: i, flat, color: PIECE_COLORS[i % PIECE_COLORS.length] });
    }

    // Project functions
    const projectTop = (x, y) => [(x - y) * ISO_COS30, (x + y) * ISO_SIN30];
    const projectBot = (x, y) => [(x - y) * ISO_COS30, (x + y) * ISO_SIN30 + extrudeH];

    // Compute bounding box of projected base + extrusion
    let bMinX = Infinity, bMaxX = -Infinity;
    let bMinY = Infinity, bMaxY = -Infinity;
    for (const [bx, by] of baseShape) {
        const [sx1, sy1] = projectTop(bx, by);
        const [sx2, sy2] = projectBot(bx, by);
        bMinX = Math.min(bMinX, sx1, sx2);
        bMaxX = Math.max(bMaxX, sx1, sx2);
        bMinY = Math.min(bMinY, sy1, sy2);
        bMaxY = Math.max(bMaxY, sy1, sy2);
    }

    const projW = bMaxX - bMinX;
    const projH = bMaxY - bMinY;
    const margin = VIEWER_PARAMS.isoMarginPx;
    const fitScale = Math.min((w - margin * 2) / projW, (h - margin * 2) / projH);
    const offX = w / 2 - (bMinX + projW / 2) * fitScale;
    const offY = h / 2 - (bMinY + projH / 2) * fitScale;

    const toScreen = (px, py) => [px * fitScale + offX, py * fitScale + offY];

    // === Draw extruded base ===
    const baseColor = VIEWER_PARAMS.baseColor;
    const baseColorRight = shadeColor(baseColor, VIEWER_PARAMS.baseShadeRight);
    const baseColorLeft = shadeColor(baseColor, VIEWER_PARAMS.baseShadeLeft);

    // Project base top and bottom vertices
    const baseTopScreen = baseShape.map(([bx, by]) => {
        const [px, py] = projectTop(bx, by);
        return toScreen(px, py);
    });
    const baseBotScreen = baseShape.map(([bx, by]) => {
        const [px, py] = projectBot(bx, by);
        return toScreen(px, py);
    });

    // Compute base center for outward normal classification
    const nBase = baseShape.length;
    let baseCx = 0, baseCy = 0;
    for (const [bx, by] of baseShape) { baseCx += bx; baseCy += by; }
    baseCx /= nBase; baseCy /= nBase;

    // Classify edges as front-facing or back-facing
    // Front-facing: outward normal points toward viewer (positive x+y direction in world)
    const frontEdges = [];
    const backEdges = [];
    for (let j = 0; j < nBase; j++) {
        const j2 = (j + 1) % nBase;
        const mx = (baseShape[j][0] + baseShape[j2][0]) / 2;
        const my = (baseShape[j][1] + baseShape[j2][1]) / 2;
        const nx = mx - baseCx;  // outward normal direction
        const ny = my - baseCy;
        if (nx + ny > 0) {
            // Front-facing: visible side wall
            // Shade based on normal direction
            const shade = nx > ny ? baseColorRight : baseColorLeft;
            frontEdges.push({ j, j2, shade });
        } else {
            backEdges.push({ j, j2 });
        }
    }

    // Draw back-facing walls first (they'll be covered by top face)
    for (const { j, j2 } of backEdges) {
        puzzleCtx.fillStyle = shadeColor(baseColor, -5);
        puzzleCtx.beginPath();
        puzzleCtx.moveTo(baseTopScreen[j][0], baseTopScreen[j][1]);
        puzzleCtx.lineTo(baseTopScreen[j2][0], baseTopScreen[j2][1]);
        puzzleCtx.lineTo(baseBotScreen[j2][0], baseBotScreen[j2][1]);
        puzzleCtx.lineTo(baseBotScreen[j][0], baseBotScreen[j][1]);
        puzzleCtx.closePath();
        puzzleCtx.fill();
    }

    // Draw base top face
    puzzleCtx.beginPath();
    puzzleCtx.moveTo(baseTopScreen[0][0], baseTopScreen[0][1]);
    for (let j = 1; j < nBase; j++) {
        puzzleCtx.lineTo(baseTopScreen[j][0], baseTopScreen[j][1]);
    }
    puzzleCtx.closePath();
    const baseGrad = puzzleCtx.createLinearGradient(0, baseTopScreen[0][1], 0, baseTopScreen[nBase - 1][1]);
    baseGrad.addColorStop(0, VIEWER_PARAMS.baseTopGradient[0]);
    baseGrad.addColorStop(1, shadeColor(VIEWER_PARAMS.baseTopGradient[0], VIEWER_PARAMS.baseTopGradient[1]));
    puzzleCtx.fillStyle = baseGrad;
    puzzleCtx.fill();
    puzzleCtx.strokeStyle = 'rgba(0,0,0,0.15)';
    puzzleCtx.lineWidth = 1;
    puzzleCtx.stroke();

    // Draw front-facing walls (on top of top face, visible below it)
    for (const { j, j2, shade } of frontEdges) {
        puzzleCtx.fillStyle = shade;
        puzzleCtx.beginPath();
        puzzleCtx.moveTo(baseTopScreen[j][0], baseTopScreen[j][1]);
        puzzleCtx.lineTo(baseTopScreen[j2][0], baseTopScreen[j2][1]);
        puzzleCtx.lineTo(baseBotScreen[j2][0], baseBotScreen[j2][1]);
        puzzleCtx.lineTo(baseBotScreen[j][0], baseBotScreen[j][1]);
        puzzleCtx.closePath();
        puzzleCtx.fill();
        // Edge outline
        puzzleCtx.strokeStyle = 'rgba(0,0,0,0.1)';
        puzzleCtx.lineWidth = 1;
        puzzleCtx.stroke();
    }

    // === Draw piece top faces (flat, on the base top surface) ===
    // Sort pieces back-to-front for proper overlap of outlines
    const sortedPieces = piecesFlat.map(pc => {
        const f = pc.flat;
        let minD = Infinity;
        for (let k = 0; k < f.length; k += 2) {
            const d = f[k] + f[k + 1];
            if (d < minD) minD = d;
        }
        return { ...pc, depth: minD };
    });
    sortedPieces.sort((a, b) => a.depth - b.depth);

    const strokeW = Math.max(0.5, fitScale * Math.max(coordW, coordH) * VIEWER_PARAMS.pieceStrokeWidthFactor);

    // Apply clip path for truncate_edge if needed
    if (clipShape) {
        puzzleCtx.save();
        puzzleCtx.beginPath();
        if (clipShape.type === 'circle') {
            // Project circle boundary as an ellipse-like polygon
            const nPts = VIEWER_PARAMS.circleClipSegments;
            for (let k = 0; k < nPts; k++) {
                const angle = k * 2 * Math.PI / nPts;
                const cx = clipShape.cx + clipShape.r * Math.cos(angle);
                const cy = clipShape.cy + clipShape.r * Math.sin(angle);
                const [px, py] = projectTop(cx, cy);
                const [sx, sy] = toScreen(px, py);
                if (k === 0) puzzleCtx.moveTo(sx, sy);
                else puzzleCtx.lineTo(sx, sy);
            }
        } else {
            // Hex clip boundary
            for (let k = 0; k < 6; k++) {
                const angle = Math.PI - k * Math.PI / 3;
                const cx = clipShape.cx + clipShape.r * Math.cos(angle);
                const cy = clipShape.cy + clipShape.r * Math.sin(angle);
                const [px, py] = projectTop(cx, cy);
                const [sx, sy] = toScreen(px, py);
                if (k === 0) puzzleCtx.moveTo(sx, sy);
                else puzzleCtx.lineTo(sx, sy);
            }
        }
        puzzleCtx.closePath();
        puzzleCtx.clip();
    }

    for (const pc of sortedPieces) {
        const f = pc.flat;
        const nPts = f.length / 2;
        if (nPts < 3) continue;

        // Project each point to isometric top surface
        puzzleCtx.beginPath();
        for (let k = 0; k < nPts; k++) {
            const [px, py] = projectTop(f[k * 2], f[k * 2 + 1]);
            const [sx, sy] = toScreen(px, py);
            if (k === 0) puzzleCtx.moveTo(sx, sy);
            else puzzleCtx.lineTo(sx, sy);
        }
        puzzleCtx.closePath();

        // Gradient fill
        let yMin = Infinity, yMax = -Infinity;
        for (let k = 0; k < nPts; k++) {
            const [, py] = projectTop(f[k * 2], f[k * 2 + 1]);
            const [, sy] = toScreen(0, py);
            if (sy < yMin) yMin = sy;
            if (sy > yMax) yMax = sy;
        }
        const gradTop = puzzleCtx.createLinearGradient(0, yMin, 0, yMax);
        gradTop.addColorStop(0, pc.color);
        gradTop.addColorStop(1, shadeColor(pc.color, -10));
        puzzleCtx.fillStyle = gradTop;
        puzzleCtx.fill();

        // Outline
        puzzleCtx.strokeStyle = 'rgba(0,0,0,0.3)';
        puzzleCtx.lineWidth = strokeW;
        puzzleCtx.stroke();
    }

    // Restore clip if applied
    if (clipShape) {
        puzzleCtx.restore();
    }
}

// Flat SVG view for fractal (original)
function drawPuzzleFractalFlat() {
    const svgPaths = puzzleData.svgPaths;
    if (!svgPaths || !svgPaths.length) return;

    setFractalVisibility(true);

    const ncols = puzzleData.fractalNcols;
    const nrows = puzzleData.fractalNrows;
    const isJigsaw = puzzleData.puzzleType === 'jigsaw';
    const jt = puzzleData.jigsawType;
    const isHex = isJigsaw && (jt === 'hexagonal' || jt === 'circular');
    const vbW = isJigsaw ? ncols : ncols * 2;
    const vbH = isJigsaw ? nrows : nrows * 2;
    const pad = Math.max(vbW, vbH) * VIEWER_PARAMS.flatPadFactor;

    // Check contoured_base checkbox
    const contouredBaseEl = document.getElementById('jigsaw_contoured_base');
    const contouredBase = isHex && contouredBaseEl && contouredBaseEl.checked;

    // Check truncate_edge
    const truncateEdge = puzzleData.truncateEdge || false;

    const container = document.getElementById('fractal-puzzle-svg');
    container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `${-pad} ${-pad} ${vbW + pad * 2} ${vbH + pad * 2}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)';
    svg.style.borderRadius = '8px';

    const ns = 'http://www.w3.org/2000/svg';

    // Background
    const bgRect = document.createElementNS(ns, 'rect');
    bgRect.setAttribute('x', -pad);
    bgRect.setAttribute('y', -pad);
    bgRect.setAttribute('width', vbW + pad * 2);
    bgRect.setAttribute('height', vbH + pad * 2);
    bgRect.setAttribute('fill', '#f5f7fa');
    svg.appendChild(bgRect);

    // Base shape (visible behind pieces)
    const baseBorder = Math.max(vbW, vbH) * VIEWER_PARAMS.flatBaseBorderFactor;
    const baseStrokeW = Math.max(vbW, vbH) * VIEWER_PARAMS.flatBaseStrokeFactor;

    if (contouredBase) {
        const cx = vbW / 2, cy = vbH / 2;
        const r = Math.min(vbW, vbH) / 2 + baseBorder;
        if (jt === 'circular') {
            const baseCircle = document.createElementNS(ns, 'circle');
            baseCircle.setAttribute('cx', cx);
            baseCircle.setAttribute('cy', cy);
            baseCircle.setAttribute('r', r);
            baseCircle.setAttribute('fill', '#e8ecf2');
            baseCircle.setAttribute('stroke', '#b0b8c8');
            baseCircle.setAttribute('stroke-width', baseStrokeW);
            svg.appendChild(baseCircle);
        } else {
            // Flat-top hexagon
            let pts = [];
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI - i * Math.PI / 3;
                pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
            }
            const basePoly = document.createElementNS(ns, 'polygon');
            basePoly.setAttribute('points', pts.join(' '));
            basePoly.setAttribute('fill', '#e8ecf2');
            basePoly.setAttribute('stroke', '#b0b8c8');
            basePoly.setAttribute('stroke-width', baseStrokeW);
            svg.appendChild(basePoly);
        }
    } else {
        // Rectangular base with border
        const baseRect = document.createElementNS(ns, 'rect');
        baseRect.setAttribute('x', -baseBorder);
        baseRect.setAttribute('y', -baseBorder);
        baseRect.setAttribute('width', vbW + baseBorder * 2);
        baseRect.setAttribute('height', vbH + baseBorder * 2);
        baseRect.setAttribute('fill', '#e8ecf2');
        baseRect.setAttribute('stroke', '#b0b8c8');
        baseRect.setAttribute('stroke-width', baseStrokeW);
        baseRect.setAttribute('rx', '0.15');
        svg.appendChild(baseRect);
    }

    // SVG clipPath for truncate_edge (clips pieces to hex/circle boundary)
    let clipId = null;
    if (truncateEdge && isHex) {
        const cx = vbW / 2, cy = vbH / 2;
        const hexR = puzzleData.hexRadius || (Math.min(vbW, vbH) / 2 * 0.95);
        clipId = 'truncate-clip-' + Date.now();
        const defs = document.createElementNS(ns, 'defs');
        const clipPath = document.createElementNS(ns, 'clipPath');
        clipPath.setAttribute('id', clipId);
        if (jt === 'circular') {
            const clipCircle = document.createElementNS(ns, 'circle');
            clipCircle.setAttribute('cx', cx);
            clipCircle.setAttribute('cy', cy);
            clipCircle.setAttribute('r', hexR);
            clipPath.appendChild(clipCircle);
        } else {
            let pts = [];
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI - i * Math.PI / 3;
                pts.push(`${cx + hexR * Math.cos(angle)},${cy + hexR * Math.sin(angle)}`);
            }
            const clipPoly = document.createElementNS(ns, 'polygon');
            clipPoly.setAttribute('points', pts.join(' '));
            clipPath.appendChild(clipPoly);
        }
        defs.appendChild(clipPath);
        svg.appendChild(defs);
    }

    // Stroke width proportional to puzzle size
    const strokeW = Math.max(vbW, vbH) * VIEWER_PARAMS.flatStrokeFactor;

    // Group for pieces (optionally clipped)
    const piecesGroup = document.createElementNS(ns, 'g');
    if (clipId) {
        piecesGroup.setAttribute('clip-path', `url(#${clipId})`);
    }

    // Draw each piece
    for (let i = 0; i < svgPaths.length; i++) {
        const d = svgPaths[i];
        if (!d) continue;

        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', PIECE_COLORS[i % PIECE_COLORS.length]);
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', strokeW);
        path.setAttribute('stroke-linejoin', 'round');
        piecesGroup.appendChild(path);
    }

    svg.appendChild(piecesGroup);

    // Draw truncation boundary outline on top
    if (truncateEdge && isHex) {
        const cx = vbW / 2, cy = vbH / 2;
        const hexR = puzzleData.hexRadius || (Math.min(vbW, vbH) / 2 * 0.95);
        if (jt === 'circular') {
            const outline = document.createElementNS(ns, 'circle');
            outline.setAttribute('cx', cx);
            outline.setAttribute('cy', cy);
            outline.setAttribute('r', hexR);
            outline.setAttribute('fill', 'none');
            outline.setAttribute('stroke', 'black');
            outline.setAttribute('stroke-width', strokeW * 1.5);
            svg.appendChild(outline);
        } else {
            let pts = [];
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI - i * Math.PI / 3;
                pts.push(`${cx + hexR * Math.cos(angle)},${cy + hexR * Math.sin(angle)}`);
            }
            const outline = document.createElementNS(ns, 'polygon');
            outline.setAttribute('points', pts.join(' '));
            outline.setAttribute('fill', 'none');
            outline.setAttribute('stroke', 'black');
            outline.setAttribute('stroke-width', strokeW * 1.5);
            svg.appendChild(outline);
        }
    }

    container.appendChild(svg);
}

// Parsea un SVG path 'd' string para calcular su bounding box.
// Usa un enfoque simple: crea un SVG temporal, le añade el path y usa getBBox().
function computeSvgPathBBox(d) {
    const ns = 'http://www.w3.org/2000/svg';
    const tmpSvg = document.createElementNS(ns, 'svg');
    tmpSvg.style.position = 'absolute';
    tmpSvg.style.left = '-9999px';
    tmpSvg.style.top = '-9999px';
    tmpSvg.style.width = '0';
    tmpSvg.style.height = '0';
    document.body.appendChild(tmpSvg);

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    tmpSvg.appendChild(path);

    const bbox = path.getBBox();
    document.body.removeChild(tmpSvg);

    if (bbox.width <= 0 || bbox.height <= 0) return null;
    return {
        minX: bbox.x,
        minY: bbox.y,
        maxX: bbox.x + bbox.width,
        maxY: bbox.y + bbox.height,
        width: bbox.width,
        height: bbox.height
    };
}

// Initial state
updateSolutionInfo();

// -----------------------------
// 3D Viewer (Three.js)
// -----------------------------
let threeScene = null;
let threeRenderer = null;
let threeCamera = null;
let threeGroup = null;
let threeGrid = null;
let threeAmbientLight = null;
let threeDirLight = null;
let threeFillLight = null;
let viewerHasModel = false;
let stlUpdateTimer = null;

// (enhanceNumberInputs eliminado)

/**
 * Create a text label sprite for the 3D scene.
 */
function makeTextSprite(text, size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 32;
    ctx.fillStyle = '#aaaaaa';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 16);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(size, size * 0.5, 1);
    return sprite;
}

/**
 * Add 256×256mm printer bed with grid and cm ruler markings.
 */
function addPrinterBed(group) {
    const bedSize = 256;
    // Bed plane
    const bedGeom = new THREE.PlaneGeometry(bedSize, bedSize);
    const bedMat = new THREE.MeshStandardMaterial({
        color: 0x333333, metalness: 0.3, roughness: 0.8, side: THREE.DoubleSide
    });
    const bedMesh = new THREE.Mesh(bedGeom, bedMat);
    bedMesh.rotation.set(-Math.PI / 2, 0, 0);
    group.add(bedMesh);

    // Grid (every 10mm = 1cm → 25.6 divisions, use 25 for clean lines)
    const gridHelper = new THREE.GridHelper(bedSize, 25, 0x555555, 0x444444);
    gridHelper.position.set(0, 0.05, 0);
    group.add(gridHelper);

    // Ruler tick marks and labels every 2cm along X and Z edges
    const half = bedSize / 2;
    const tickLen = 4;
    const tickMat = new THREE.LineBasicMaterial({ color: 0x999999 });

    for (let cm = 0; cm <= 25; cm += 2) {
        const pos = -half + cm * 10; // mm position from center

        // X-axis ruler (along front edge, z = +half)
        const xPts = [
            new THREE.Vector3(pos, 0.1, half),
            new THREE.Vector3(pos, 0.1, half + tickLen)
        ];
        const xLine = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(xPts), tickMat
        );
        group.add(xLine);

        // Label
        if (cm > 0 && cm < 25) {
            const label = makeTextSprite(cm + '', 10);
            label.position.set(pos, 0.1, half + tickLen + 5);
            group.add(label);
        }

        // Z-axis ruler (along left edge, x = -half)
        const zPts = [
            new THREE.Vector3(-half, 0.1, pos),
            new THREE.Vector3(-half - tickLen, 0.1, pos)
        ];
        const zLine = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(zPts), tickMat
        );
        group.add(zLine);

        if (cm > 0 && cm < 25) {
            const label = makeTextSprite(cm + '', 10);
            label.position.set(-half - tickLen - 5, 0.1, pos);
            group.add(label);
        }
    }

    // "cm" label at the end of each ruler
    const cmLabelX = makeTextSprite('cm', 12);
    cmLabelX.position.set(half, 0.1, half + tickLen + 5);
    group.add(cmLabelX);

    const cmLabelZ = makeTextSprite('cm', 12);
    cmLabelZ.position.set(-half - tickLen - 5, 0.1, half);
    group.add(cmLabelZ);
}

function init3DViewer() {
    const container = document.getElementById('viewer-3d');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    threeRenderer = new THREE.WebGLRenderer({ antialias: true });
    threeRenderer.setSize(rect.width, rect.height);
    threeRenderer.setPixelRatio(window.devicePixelRatio || 1);
    threeRenderer.setClearColor(0xf5f7fa);
    container.innerHTML = '';
    container.appendChild(threeRenderer.domElement);

    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 10000);
    // Ángulo original sencillo
    threeCamera.position.set(200, 200, 400);
    threeCamera.lookAt(0, 0, 0);

    // Lighting defaults — edit MINI_VIEWER_DEFAULTS.advanced to change these.
    // The debug panel (Ctrl+Shift+F12) can update them live via the
    // "Visor 3D Avanzado (principal)" selector.
    threeAmbientLight = new THREE.AmbientLight(0xffffff, 0.4);
    threeScene.add(threeAmbientLight);
    threeDirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    threeDirLight.position.set(1, 2, 1);
    threeScene.add(threeDirLight);
    threeFillLight = new THREE.DirectionalLight(0xffffff, 0.2);
    threeFillLight.position.set(-1, -0.5, -0.5);
    threeFillLight.visible = false;
    threeScene.add(threeFillLight);

    threeGroup = new THREE.Group();
    threeScene.add(threeGroup);

    // Initial printer bed with rulers
    addPrinterBed(threeGroup);

    // Orbit controls for interaction
    try {
        const controls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 10;
        controls.maxDistance = 5000;
        window._threeControls = controls;
    } catch (e) {
        console.warn('OrbitControls no disponible:', e);
    }

    window.addEventListener('resize', () => {
        if (!threeRenderer) return;
        const r = container.getBoundingClientRect();
        threeRenderer.setSize(r.width, r.height);
        threeCamera.aspect = r.width / r.height;
        threeCamera.updateProjectionMatrix();
    });

    (function animate() {
        requestAnimationFrame(animate);
        if (window._threeControls) window._threeControls.update();
        threeRenderer.render(threeScene, threeCamera);
    })();

    showExportStatus('🎥 Visor 3D inicializado', 'info');
}

async function loadThreeFromSeparate(baseB64, piecesB64, baseColor, pieceColor, reliefB64, reliefColor) {
    /**
     * Load separate base, pieces, and relief STL data into Three.js with different colors.
     * baseB64/piecesB64/reliefB64: base64-encoded STL binary strings (may be null/undefined).
     */
    if (!baseB64 && !piecesB64) return false;
    if (!threeScene) init3DViewer();
    if (!threeGroup) return false;
    if (typeof THREE.STLLoader !== 'function') {
        console.error('STLLoader no disponible');
        return false;
    }

    const loader = new THREE.STLLoader();

    const prevCamPos = threeCamera ? threeCamera.position.clone() : null;
    const prevTarget = window._threeControls ? window._threeControls.target.clone() : null;

    while (threeGroup.children.length) threeGroup.remove(threeGroup.children[0]);
    addPrinterBed(threeGroup);

    // Compute combined bounding box for centering
    const allMeshes = [];

    async function addSTLMesh(b64Data, hexColor) {
        const bytes = Uint8Array.from(atob(b64Data), c => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: 'model/stl' });
        const url = window.URL.createObjectURL(blob);
        try {
            const geometry = await loader.loadAsync(url);
            try { geometry.computeVertexNormals(); } catch (e) {}
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(hexColor),
                metalness: 0.2,
                roughness: 0.7,
                side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            mesh.updateMatrixWorld(true);
            allMeshes.push(mesh);
        } finally {
            window.URL.revokeObjectURL(url);
        }
    }

    try {
        if (baseB64) await addSTLMesh(baseB64, baseColor);
        if (piecesB64) await addSTLMesh(piecesB64, pieceColor);
        if (reliefB64) await addSTLMesh(reliefB64, reliefColor || '#FF6633');

        // Center all meshes together
        const tempGroup = new THREE.Group();
        allMeshes.forEach(m => tempGroup.add(m));
        tempGroup.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(tempGroup);
        const center = box.getCenter(new THREE.Vector3());

        allMeshes.forEach(m => {
            tempGroup.remove(m);
            m.position.set(
                m.position.x - center.x,
                m.position.y - box.min.y,
                m.position.z - center.z
            );
            // Tag meshes for color updates
            m.userData.colorRole = allMeshes.indexOf(m) === 0 && baseB64 ? 'base' : 'pieces';
            threeGroup.add(m);
        });

        if (!viewerHasModel) {
            frameCameraTo(threeGroup);
            viewerHasModel = true;
        } else {
            if (prevCamPos) threeCamera.position.copy(prevCamPos);
            if (prevTarget && window._threeControls) window._threeControls.target.copy(prevTarget);
        }
        return true;
    } catch (err) {
        console.error('Error cargando STL separados en Three:', err);
        return false;
    }
}

// Update Three.js mesh colors without re-fetching geometry
function updateThreeColors() {
    if (!threeGroup) return;
    const colors = getColorElements();
    const pieceColorEl = colors.pieces;
    const baseColorEl = colors.base;
    const pieceColor = pieceColorEl ? pieceColorEl.value : '#6699CC';
    const baseColor = baseColorEl ? baseColorEl.value : '#808080';

    threeGroup.children.forEach(child => {
        if (!child.userData || !child.userData.colorRole) return;
        if (child.material) {
            if (child.userData.colorRole === 'base') {
                child.material.color.set(baseColor);
            } else if (child.userData.colorRole === 'pieces') {
                child.material.color.set(pieceColor);
            }
            child.material.needsUpdate = true;
        }
    });
}

async function loadThreeFromBlob(blob) {
    if (!blob) return false;
    if (!threeScene) init3DViewer();
    if (!threeGroup) return false;
    if (typeof THREE.STLLoader !== 'function') {
        console.error('STLLoader no disponible');
        return false;
    }

    const loader = new THREE.STLLoader();
    const url = window.URL.createObjectURL(blob);
    try {
        const geometry = await loader.loadAsync(url);
        try { geometry.computeVertexNormals(); } catch (e) {}

        const prevCamPos = threeCamera ? threeCamera.position.clone() : null;
        const prevTarget = window._threeControls ? window._threeControls.target.clone() : null;

        while (threeGroup.children.length) threeGroup.remove(threeGroup.children[0]);
        addPrinterBed(threeGroup);

        const material = new THREE.MeshStandardMaterial({ color: 0x6699cc, metalness: 0.2, roughness: 0.7 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        mesh.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        mesh.position.set(-center.x, -box.min.y, -center.z);
        threeGroup.add(mesh);

        if (!viewerHasModel) {
            frameCameraTo(threeGroup);
            viewerHasModel = true;
        } else {
            if (prevCamPos) threeCamera.position.copy(prevCamPos);
            if (prevTarget && window._threeControls) window._threeControls.target.copy(prevTarget);
        }
        return true;
    } catch (err) {
        console.error('Error cargando STL en Three:', err);
        return false;
    } finally {
        window.URL.revokeObjectURL(url);
    }
}

function addAxesHelper(size = 100) {
    if (!threeGroup) return;
    const axes = new THREE.AxesHelper(size);
    threeGroup.add(axes);
}

function addTestCube() {
    if (!threeGroup) return;
    const geom = new THREE.BoxGeometry(50, 20, 50);
    const mat = new THREE.MeshStandardMaterial({ color: 0x00aaee, metalness: 0.2, roughness: 0.7 });
    const cube = new THREE.Mesh(geom, mat);
    cube.position.set(0, -10, 0);
    threeGroup.add(cube);
}

function frameCameraTo(targetObject) {
    if (!targetObject || !threeCamera) return;
    const box = new THREE.Box3().setFromObject(targetObject);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim === 0 || !isFinite(maxDim)) return;
    const fov = threeCamera.fov * Math.PI / 180;
    let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
    cameraZ *= 1.02; // más ajustado para llenar visor
    // Mantener ángulo original: dirección (200,200,400) normalizada
    const dir = new THREE.Vector3(200, 300, -200).normalize();
    const pos = center.clone().add(dir.multiplyScalar(cameraZ));
    threeCamera.position.copy(pos);
    threeCamera.lookAt(center);
    if (window._threeControls) window._threeControls.target.copy(center);
}

// Actualizar visor automáticamente cuando cambian parámetros STL
function scheduleViewerUpdate() {
    // Only update the advanced viewer if it's visible
    const advContent = document.getElementById('advanced-viewer-content');
    if (!advContent || advContent.style.display === 'none') return;
    if (stlUpdateTimer) clearTimeout(stlUpdateTimer);
    stlUpdateTimer = setTimeout(() => {
        viewSTL();
    }, 300);
}

// Manual reload button
const viewerReloadBtn = document.getElementById('viewer-reload-btn');
if (viewerReloadBtn) {
    viewerReloadBtn.addEventListener('click', () => { viewSTL(); });
}

// Advanced viewer visibility is now controlled by wizard system
// (no longer need manual toggle handling)

const cubeInput = document.getElementById('stl_cube_size');
const heightInput = document.getElementById('stl_height');
const tolInput = document.getElementById('stl_tolerance');
const borderInput = document.getElementById('stl_border');
const baseThkInput = document.getElementById('stl_base_thickness');
const wallHInput = document.getElementById('stl_wall_height');

// Collect all infill sub-option inputs for auto-refresh
const allInfillInputs = document.querySelectorAll('.infill-opts input');

[cubeInput, heightInput, tolInput, borderInput, baseThkInput, wallHInput].forEach(inp => {
    if (inp) {
        inp.addEventListener('input', scheduleViewerUpdate);
        inp.addEventListener('change', () => { scheduleViewerUpdate(); scheduleInline3DUpdate(); });
    }
});

// Corner style inputs auto-refresh
const cornerRadiusInput = document.getElementById('stl_corner_radius');
const cornerStyleInput = document.getElementById('stl_corner_style');
const cornerRadiusGroup = document.getElementById('corner-radius-group');
const cornersOptsGroup = document.getElementById('piece-opts-corners');

// Base corner style inputs auto-refresh
const baseCornerRadiusInput = document.getElementById('stl_base_corner_radius');
const baseCornerRadiusInnerInput = document.getElementById('stl_base_corner_radius_inner');
const baseCornerStyleInput = document.getElementById('stl_base_corner_style');
const baseCornerStyleInnerInput = document.getElementById('stl_base_corner_style_inner');
const baseCornerRadiusGroup = document.getElementById('base-corner-radius-group');
const baseCornerRadiusInnerGroup = document.getElementById('base-corner-radius-inner-group');
const baseCornerOptsGroup = document.getElementById('base-opts-corners');
const cornerInnerInput = document.getElementById('stl_corner_inner');

[cornerStyleInput, cornerRadiusInput, cornerInnerInput, baseCornerStyleInput, baseCornerStyleInnerInput, baseCornerRadiusInput, baseCornerRadiusInnerInput].forEach(inp => {
    if (inp) {
        inp.addEventListener('input', scheduleViewerUpdate);
        inp.addEventListener('change', () => { scheduleViewerUpdate(); scheduleInline3DUpdate(); });
    }
});

allInfillInputs.forEach(inp => {
    inp.addEventListener('input', scheduleViewerUpdate);
    inp.addEventListener('change', () => { scheduleViewerUpdate(); scheduleInline3DUpdate(); });
});

// Wire sliding inputs to refresh inline 3D viewer
document.querySelectorAll('.sliding-only input[type="number"], .sliding-only select').forEach(inp => {
    inp.addEventListener('input', () => { scheduleViewerUpdate(); scheduleInline3DUpdate(); });
    inp.addEventListener('change', () => { scheduleViewerUpdate(); scheduleInline3DUpdate(); });
});

// Per-puzzle-type + arc-shape + infill-type defaults
// (values defined in INFILL_DEFAULTS at the top of this file)
const infillDefaults = INFILL_DEFAULTS;

function getInfillDefaults() {
    const pType = puzzleData && puzzleData.puzzleType;
    let key;
    if (pType === 'jigsaw') {
        key = 'jigsaw';
    } else if (pType === 'fractal') {
        const arcShape = document.getElementById('arc_shape') ? document.getElementById('arc_shape').value : '0';
        key = 'fractal_' + arcShape;
    } else {
        key = 'normal';
    }
    return infillDefaults[key] || infillDefaults['normal'];
}

function applyInfillDefaults() {
    const defs = getInfillDefaults();
    const infillType = infillSelect ? infillSelect.value : 'solid';

    // Apply common params
    const common = defs.common || {};
    const commonMap = {
        stl_infill_wall: 'infill_wall'
    };
    for (const [elId, key] of Object.entries(commonMap)) {
        const el = document.getElementById(elId);
        if (el && common[key] !== undefined) el.value = common[key];
    }

    // Apply infill-type-specific params (including per-type angle where applicable)
    const specific = defs[infillType] || {};
    const specificMap = {
        stl_infill_fill_width:        'infill_fill_width',
        stl_infill_spacing:           'infill_spacing',
        stl_infill_angle_grid:        'infill_angle',
        stl_infill_fill_width_s:      'infill_fill_width_s',
        stl_infill_spacing_s:         'infill_spacing_s',
        stl_infill_angle_stripes:     'infill_angle',
        stl_infill_fill_width_z:      'infill_fill_width_z',
        stl_infill_spacing_z:         'infill_spacing_z',
        stl_infill_amplitude:         'infill_amplitude',
        stl_infill_angle_zigzag:      'infill_angle',
        stl_infill_fill_width_h:      'infill_fill_width_h',
        stl_infill_cell_size:         'infill_cell_size',
        stl_infill_angle_honeycomb:   'infill_angle',
        stl_infill_fill_width_c:      'infill_fill_width_c'
    };
    for (const [elId, key] of Object.entries(specificMap)) {
        const el = document.getElementById(elId);
        if (el && specific[key] !== undefined) el.value = specific[key];
    }

    // Update corner style visibility when puzzle type changes
    if (typeof updateCornerStyleUI === 'function') updateCornerStyleUI();
}

// Infill type selector: show/hide sub-options
const infillSelect = document.getElementById('stl_infill_type');
// Infill types that have a type-specific params panel (col 1)
const INFILL_WITH_PARAMS = ['grid', 'stripes', 'zigzag', 'honeycomb', 'circles'];
// Infill types that have a common options panel (col 2)
const INFILL_WITH_COMMON = ['hollow', 'grid', 'stripes', 'zigzag', 'honeycomb', 'circles'];
function updateInfillOptions() {
    // Clear all active states first
    document.querySelectorAll('.infill-opts').forEach(el => el.classList.remove('active'));
    const sel = infillSelect ? infillSelect.value : 'solid';
    // Col 1: show type-specific panel or placeholder
    const paramsPanel = document.getElementById('infill-opts-' + sel);
    const noParamsEl  = document.getElementById('no-opts-params');
    if (INFILL_WITH_PARAMS.includes(sel) && paramsPanel) {
        paramsPanel.classList.add('active');
    } else if (noParamsEl) {
        noParamsEl.classList.add('active');
    }
    // Col 2: show common panel or placeholder
    const commonPanel = document.getElementById('infill-opts-common');
    const noCommonEl  = document.getElementById('no-opts-common');
    if (INFILL_WITH_COMMON.includes(sel) && commonPanel) {
        commonPanel.classList.add('active');
    } else if (noCommonEl) {
        noCommonEl.classList.add('active');
    }
    // Apply defaults for this infill type
    applyInfillDefaults();
    scheduleViewerUpdate();
}
if (infillSelect) {
    infillSelect.addEventListener('change', updateInfillOptions);
    updateInfillOptions(); // init
}

// --- Acabados mode switch (Relleno / Textura / Imagen) ---
function updateAcabadosMode() {
    const mode = document.querySelector('input[name="acabados_mode"]:checked');
    const val = mode ? mode.value : 'infill';
    const infillPanel = document.getElementById('acabados-infill-panel');
    const texturePanel = document.getElementById('acabados-texture-panel');
    const imagePanel = document.getElementById('acabados-image-panel');
    if (infillPanel) infillPanel.style.display = (val === 'infill') ? '' : 'none';
    if (texturePanel) texturePanel.style.display = (val === 'texture') ? '' : 'none';
    if (imagePanel) imagePanel.style.display = (val === 'image') ? '' : 'none';
    // All infill/texture opts live outside their panels — CSS .active handles per-type visibility
    document.querySelectorAll('.infill-opts').forEach(el => {
        el.style.display = (val === 'infill') ? '' : 'none';
    });
    document.querySelectorAll('.texture-opts').forEach(el => {
        el.style.display = (val === 'texture') ? '' : 'none';
    });
    document.querySelectorAll('.image-opts').forEach(el => {
        el.style.display = (val === 'image') ? 'flex' : 'none';
    });
    // Update active class on labels
    document.querySelectorAll('.acabados-mode-label').forEach(lbl => {
        const radio = lbl.querySelector('input[type="radio"]');
        lbl.classList.toggle('active', radio && radio.checked);
    });
    if (val === 'texture') updateTextureOptions();
    updateDragHints();
    scheduleViewerUpdate();
}
document.querySelectorAll('input[name="acabados_mode"]').forEach(r => {
    r.addEventListener('change', updateAcabadosMode);
});
updateAcabadosMode(); // init

// --- Texture type selector: show/hide per-pattern panels ---
function updateTextureOptions() {
    // Hide per-type panels, keep common always visible
    document.querySelectorAll('.texture-opts').forEach(el => {
        if (el.id !== 'texture-opts-common') el.classList.remove('active');
    });
    const commonPanel = document.getElementById('texture-opts-common');
    if (commonPanel) commonPanel.classList.add('active');
    const sel = document.getElementById('stl_texture_type');
    const textureType = sel ? sel.value : 'grid';
    const panel = document.getElementById('texture-opts-' + textureType);
    if (panel) panel.classList.add('active');
    scheduleViewerUpdate();
}
const textureSelect = document.getElementById('stl_texture_type');
if (textureSelect) {
    textureSelect.addEventListener('change', updateTextureOptions);
}

// Toggle margin input disabled state when "sin borde" checkbox is changed
function setupBorderToggle(checkboxId, wallInputId) {
    const checkbox = document.getElementById(checkboxId);
    if (!checkbox) return;
    
    const wallInput = document.getElementById(wallInputId);
    const wallRangeInput = wallInput ? wallInput.parentElement.querySelector('input[type="range"]') : null;
    
    // Set initial state
    if (wallRangeInput && wallInput) {
        wallRangeInput.disabled = checkbox.checked;
        wallInput.disabled = checkbox.checked;
    }
    
    // Listen for changes
    checkbox.addEventListener('change', () => {
        if (wallRangeInput && wallInput) {
            wallRangeInput.disabled = checkbox.checked;
            wallInput.disabled = checkbox.checked;
        }
    });
}

// Setup for both texture and image border toggles
setupBorderToggle('stl_texture_no_border', 'stl_texture_wall');
setupBorderToggle('stl_image_no_border', 'stl_image_wall');
// Setup for circle-filled toggles (disable circle border thickness inputs)
setupBorderToggle('stl_infill_circle_filled', 'stl_infill_fill_width_c');
setupBorderToggle('stl_texture_circle_filled', 'stl_texture_fill_width_circles');

// Auto-refresh bindings for all texture inputs
['stl_texture_direction', 'stl_texture_height', 'stl_texture_wall',
 'stl_texture_fill_width_grid', 'stl_texture_spacing_grid', 'stl_texture_angle_grid',
 'stl_texture_fill_width_stripes', 'stl_texture_spacing_stripes', 'stl_texture_angle_stripes',
 'stl_texture_fill_width_zigzag', 'stl_texture_spacing_zigzag', 'stl_texture_amplitude',
 'stl_texture_angle_zigzag',
 'stl_texture_fill_width_honeycomb', 'stl_texture_cell_size', 'stl_texture_angle_honeycomb',
 'stl_texture_fill_width_circles'
].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', scheduleViewerUpdate);
        // <select> elements fire 'change' not 'input', listen for both
        if (el.tagName === 'SELECT') el.addEventListener('change', () => { scheduleViewerUpdate(); scheduleInline3DUpdate(); });
    }
});
['stl_texture_no_border', 'stl_texture_invert'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', scheduleViewerUpdate);
});
// Ensure circle-filled toggles also refresh the viewer when changed
['stl_infill_circle_filled', 'stl_texture_circle_filled'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', scheduleViewerUpdate);
});

// Viewer mode: mutually exclusive checkboxes (like radio buttons)
// Returns 'pieces', 'base', or 'both'
function getViewerMode() {
    if (document.getElementById('viewer_mode_pieces')?.checked) return 'pieces';
    if (document.getElementById('viewer_mode_base')?.checked) return 'base';
    return 'both';
}

function setViewerMode(mode) {
    const ids = { pieces: 'viewer_mode_pieces', base: 'viewer_mode_base', both: 'viewer_mode_both' };
    // Uncheck all, check the selected one, update active class on labels
    Object.entries(ids).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (el) el.checked = (key === mode);
        const label = el ? el.closest('label') : null;
        if (label) label.classList.toggle('active', key === mode);
    });
    scheduleViewerUpdate();
}

['viewer_mode_pieces', 'viewer_mode_base', 'viewer_mode_both'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('change', () => {
            if (el.checked) {
                const mode = el.value;
                setViewerMode(mode);
            } else {
                // Prevent unchecking without selecting another — re-check this one
                el.checked = true;
            }
        });
    }
});

// assembled checkbox updates viewer
const assembledCheck = document.getElementById('stl_assembled');
if (assembledCheck) assembledCheck.addEventListener('change', () => { scheduleViewerUpdate(); scheduleInline3DUpdate(); });

// Fill gaps checkbox also updates viewer
const fillGapsCheck = document.getElementById('stl_infill_fill_gaps');
if (fillGapsCheck) fillGapsCheck.addEventListener('change', scheduleViewerUpdate);

// Fill border gaps checkbox also updates viewer
const fillBorderGapsCheck = document.getElementById('stl_fill_border_gaps');
if (fillBorderGapsCheck) fillBorderGapsCheck.addEventListener('change', scheduleViewerUpdate);

// Color pickers: update hex label and viewer colors (no geometry re-fetch needed)

// Helper function to get the correct color picker elements based on puzzle type
function getColorElements() {
    const isSliding = puzzleData && puzzleData.puzzleType === 'sliding';
    return {
        pieces: document.getElementById(isSliding ? 'sliding_color_pieces' : 'stl_color_pieces'),
        base: document.getElementById(isSliding ? 'sliding_color_base' : 'stl_color_base'),
        relief: document.getElementById(isSliding ? 'sliding_color_relief' : 'stl_color_relief'),
        piecesHex: document.getElementById(isSliding ? 'sliding_color_pieces_hex' : 'stl_color_pieces_hex'),
        baseHex: document.getElementById(isSliding ? 'sliding_color_base_hex' : 'stl_color_base_hex'),
        reliefHex: document.getElementById(isSliding ? 'sliding_color_relief_hex' : 'stl_color_relief_hex'),
    };
}

const colorPiecesInput = document.getElementById('stl_color_pieces');
const colorBaseInput = document.getElementById('stl_color_base');
const colorReliefInput = document.getElementById('stl_color_relief');
const colorPiecesHex = document.getElementById('stl_color_pieces_hex');
const colorBaseHex = document.getElementById('stl_color_base_hex');
const colorReliefHex = document.getElementById('stl_color_relief_hex');

function onColorPickerChange(inputEl, hexEl) {
    if (hexEl) hexEl.textContent = inputEl.value.toUpperCase();
    updateThreeColors();
    scheduleInline3DUpdate();
}

if (colorPiecesInput) {
    colorPiecesInput.addEventListener('input', () => onColorPickerChange(colorPiecesInput, colorPiecesHex));
}
if (colorBaseInput) {
    colorBaseInput.addEventListener('input', () => onColorPickerChange(colorBaseInput, colorBaseHex));
}
if (colorReliefInput) {
    colorReliefInput.addEventListener('input', () => onColorPickerChange(colorReliefInput, colorReliefHex));
}

// Color pickers for sliding puzzles
const slidingColorPiecesInput = document.getElementById('sliding_color_pieces');
const slidingColorBaseInput = document.getElementById('sliding_color_base');
const slidingColorReliefInput = document.getElementById('sliding_color_relief');
const slidingColorPiecesHex = document.getElementById('sliding_color_pieces_hex');
const slidingColorBaseHex = document.getElementById('sliding_color_base_hex');
const slidingColorReliefHex = document.getElementById('sliding_color_relief_hex');

if (slidingColorPiecesInput) {
    slidingColorPiecesInput.addEventListener('input', () => onColorPickerChange(slidingColorPiecesInput, slidingColorPiecesHex));
}
if (slidingColorBaseInput) {
    slidingColorBaseInput.addEventListener('input', () => onColorPickerChange(slidingColorBaseInput, slidingColorBaseHex));
}
if (slidingColorReliefInput) {
    slidingColorReliefInput.addEventListener('input', () => onColorPickerChange(slidingColorReliefInput, slidingColorReliefHex));
}

// Corner style selector: show/hide radius input & handle fractal circular / jigsaw
function updateCornerStyleUI() {
    const style = cornerStyleInput ? cornerStyleInput.value : 'sharp';
    const noAdjustMsg = document.getElementById('corner-no-adjust-msg');
    const controlsWrap = document.getElementById('corner-controls-wrap');
    const arcShapeEl = document.getElementById('arc_shape');
    const arcShape = arcShapeEl ? arcShapeEl.value : '1';
    const isFracCircular = puzzleData && puzzleData.puzzleType === 'fractal' && arcShape === '0';
    const isFracOctagonal = puzzleData && puzzleData.puzzleType === 'fractal' && arcShape === '2';
    const isJigsaw = puzzleData && puzzleData.puzzleType === 'jigsaw';
    const hideCornerControls = isFracCircular || isFracOctagonal || isJigsaw;

    // Show/hide the info message and controls
    if (noAdjustMsg) noAdjustMsg.style.display = hideCornerControls ? '' : 'none';
    if (controlsWrap) controlsWrap.style.display = hideCornerControls ? 'none' : '';

    // Show size input for all non-sharp styles
    if (cornerRadiusGroup && !hideCornerControls) {
        cornerRadiusGroup.style.display = (style !== 'sharp') ? '' : 'none';
        // Change label based on style
        const lbl = cornerRadiusGroup.querySelector('label');
        if (lbl) lbl.textContent = style === 'round' ? 'Radio (mm):' : 'Tamaño (mm):';
    }
    // Show "apply to inner corners" checkbox when corner style is not sharp
    const cornerInnerGroup = document.getElementById('corner-inner-group');
    if (cornerInnerGroup) {
        cornerInnerGroup.style.display = (!hideCornerControls && style !== 'sharp') ? '' : 'none';
    }
    // Base corners — exterior
    const baseStyle = baseCornerStyleInput ? baseCornerStyleInput.value : 'sharp';
    if (baseCornerRadiusGroup) {
        baseCornerRadiusGroup.style.display = (baseStyle !== 'sharp') ? '' : 'none';
        var blbl = baseCornerRadiusGroup.querySelector('label');
        if (blbl) blbl.textContent = baseStyle === 'round' ? 'Radio (mm):' : 'Tamaño (mm):';
    }
    // Base corners — interior (with "same as piece" checkbox)
    const baseInnerSameCheck = document.getElementById('base_inner_same_as_piece');
    const baseInnerOpts = document.getElementById('base-inner-corner-opts');
    const baseInnerCol = baseInnerSameCheck ? baseInnerSameCheck.closest('div') : null;
    const _cornerHiddenMsg = 'Las esquinas de pieza no están disponibles para este tipo de puzzle. Las esquinas interiores de la base se igualan automáticamente.';
    if (hideCornerControls) {
        // Piece corners hidden → force "same as piece" and disable the checkbox
        if (baseInnerSameCheck) {
            baseInnerSameCheck.checked = true;
            baseInnerSameCheck.disabled = true;
            const _fgCorner = baseInnerSameCheck.closest('.form-group') || baseInnerSameCheck.parentElement;
            if (_fgCorner) _fgCorner.setAttribute('data-tooltip', _cornerHiddenMsg);
        }
        if (baseInnerOpts) baseInnerOpts.style.display = 'none';
    } else {
        if (baseInnerSameCheck) {
            baseInnerSameCheck.disabled = false;
            const _fgCorner = baseInnerSameCheck.closest('.form-group') || baseInnerSameCheck.parentElement;
            if (_fgCorner) _fgCorner.removeAttribute('data-tooltip');
        }
        if (baseInnerSameCheck && baseInnerOpts) {
            // Keep visible but disable inputs when "same as piece" is checked
            const shouldDisable = baseInnerSameCheck.checked;
            baseInnerOpts.querySelectorAll('input, select').forEach(el => el.disabled = shouldDisable);
        }
        if (!baseInnerSameCheck || !baseInnerSameCheck.checked) {
            const baseStyleInner = baseCornerStyleInnerInput ? baseCornerStyleInnerInput.value : 'sharp';
            if (baseCornerRadiusInnerGroup) {
                baseCornerRadiusInnerGroup.style.display = (baseStyleInner !== 'sharp') ? '' : 'none';
                var blbl2 = baseCornerRadiusInnerGroup.querySelector('label');
                if (blbl2) blbl2.textContent = baseStyleInner === 'round' ? 'Radio (mm):' : 'Tamaño (mm):';
            }
        }
    }
    // Show fill border gaps checkbox only for fractal/jigsaw puzzles
    const fillGapsGroup = document.getElementById('base-fill-gaps-group');
    if (fillGapsGroup) {
        const isFrac = puzzleData && (puzzleData.puzzleType === 'fractal' || puzzleData.puzzleType === 'jigsaw');
        fillGapsGroup.style.display = isFrac ? '' : 'none';
    }
    scheduleViewerUpdate();
}
if (cornerStyleInput) {
    cornerStyleInput.addEventListener('change', updateCornerStyleUI);
    updateCornerStyleUI();
}
if (baseCornerStyleInput) {
    baseCornerStyleInput.addEventListener('change', updateCornerStyleUI);
}
if (baseCornerStyleInnerInput) {
    baseCornerStyleInnerInput.addEventListener('change', updateCornerStyleUI);
}
const baseInnerSameAsEl = document.getElementById('base_inner_same_as_piece');
if (baseInnerSameAsEl) {
    baseInnerSameAsEl.addEventListener('change', () => { updateCornerStyleUI(); scheduleViewerUpdate(); scheduleInline3DUpdate(); });
}

// Sliding corner style: show/hide radius inputs & change labels
function updateSlidingCornerStyleUI() {
    const sPieceStyle = document.getElementById('sliding_corner_style');
    const sPieceRadiusGroup = document.getElementById('sliding-corner-radius-group');
    if (sPieceStyle && sPieceRadiusGroup) {
        sPieceRadiusGroup.style.display = (sPieceStyle.value !== 'sharp') ? '' : 'none';
        var lbl = sPieceRadiusGroup.querySelector('label');
        if (lbl) lbl.textContent = sPieceStyle.value === 'round' ? 'Radio (mm):' : 'Tamaño (mm):';
    }
    const sBaseStyle = document.getElementById('sliding_base_corner_style');
    const sBaseRadiusGroup = document.getElementById('sliding-base-corner-radius-group');
    if (sBaseStyle && sBaseRadiusGroup) {
        var notSharp = sBaseStyle.value !== 'sharp';
        sBaseRadiusGroup.style.display = notSharp ? '' : 'none';
        var lbl2 = sBaseRadiusGroup.querySelector('label');
        if (lbl2) lbl2.textContent = sBaseStyle.value === 'round' ? 'Radio (mm):' : 'Tamaño (mm):';
    }
    // Slider base interior — "same as piece" checkbox
    const sBaseInnerSame = document.getElementById('sliding_base_inner_same_as_piece');
    const sBaseInnerOpts = document.getElementById('sliding-base-inner-corner-opts');
    if (sBaseInnerSame && sBaseInnerOpts) {
        // Keep visible but disable inputs when "same as piece" is checked
        const shouldDisable = sBaseInnerSame.checked;
        sBaseInnerOpts.querySelectorAll('input, select').forEach(el => el.disabled = shouldDisable);
    }
    if (!sBaseInnerSame || !sBaseInnerSame.checked) {
        const sBaseStyleInner = document.getElementById('sliding_base_corner_style_inner');
        const sBaseRadiusInnerGroup = document.getElementById('sliding-base-corner-radius-inner-group');
        if (sBaseStyleInner && sBaseRadiusInnerGroup) {
            var notSharpI = sBaseStyleInner.value !== 'sharp';
            sBaseRadiusInnerGroup.style.display = notSharpI ? '' : 'none';
            var lbl3 = sBaseRadiusInnerGroup.querySelector('label');
            if (lbl3) lbl3.textContent = sBaseStyleInner.value === 'round' ? 'Radio (mm):' : 'Tamaño (mm):';
        }
    }
}
const slidingCornerStyleEl = document.getElementById('sliding_corner_style');
const slidingBaseCornerStyleEl = document.getElementById('sliding_base_corner_style');
if (slidingCornerStyleEl) slidingCornerStyleEl.addEventListener('change', updateSlidingCornerStyleUI);
if (slidingBaseCornerStyleEl) slidingBaseCornerStyleEl.addEventListener('change', updateSlidingCornerStyleUI);
const slidingBaseCornerStyleInnerEl = document.getElementById('sliding_base_corner_style_inner');
if (slidingBaseCornerStyleInnerEl) slidingBaseCornerStyleInnerEl.addEventListener('change', updateSlidingCornerStyleUI);
const slidingBaseInnerSameEl = document.getElementById('sliding_base_inner_same_as_piece');
if (slidingBaseInnerSameEl) {
    slidingBaseInnerSameEl.addEventListener('change', () => { updateSlidingCornerStyleUI(); scheduleViewerUpdate(); scheduleInline3DUpdate(); });
}
updateSlidingCornerStyleUI();

// Chamfer checkbox wiring: enable/disable number inputs
['piece_chamfer_top', 'piece_chamfer_bottom'].forEach(id => {
    const cb = document.getElementById(id + '_on');
    const num = document.getElementById(id);
    if (cb && num) {
        cb.addEventListener('change', () => {
            num.disabled = !cb.checked;
            scheduleViewerUpdate(); scheduleInline3DUpdate();
            if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate();
        });
        num.addEventListener('change', () => {
            scheduleViewerUpdate(); scheduleInline3DUpdate();
            if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate();
        });
    }
});
// Base chamfer wiring: each checkbox controls its own input
['base_chamfer_top_outer', 'base_chamfer_top_inner', 'base_chamfer_bottom_outer'].forEach(id => {
    const cb = document.getElementById(id + '_on');
    const num = document.getElementById(id);
    if (cb && num) {
        cb.addEventListener('change', () => {
            num.disabled = !cb.checked;
            scheduleViewerUpdate(); scheduleInline3DUpdate();
            if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate();
        });
        num.addEventListener('change', () => {
            scheduleViewerUpdate(); scheduleInline3DUpdate();
            if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate();
        });
    }
});

// Sliding base chamfer wiring: each checkbox controls its own input
['sliding_base_chamfer_top_outer', 'sliding_base_chamfer_top_inner',
 'sliding_base_chamfer_bottom_outer', 'sliding_base_chamfer_bottom_inner'].forEach(id => {
    const cb = document.getElementById(id + '_on');
    const num = document.getElementById(id);
    if (cb && num) {
        cb.addEventListener('change', () => {
            num.disabled = !cb.checked;
            scheduleViewerUpdate(); scheduleInline3DUpdate();
            if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate();
        });
        num.addEventListener('change', () => {
            scheduleViewerUpdate(); scheduleInline3DUpdate();
            if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate();
        });
    }
});
['sliding_piece_chamfer_top', 'sliding_piece_chamfer_bottom'].forEach(id => {
    const cb = document.getElementById(id + '_on');
    const num = document.getElementById(id);
    if (cb && num) {
        cb.addEventListener('change', () => {
            num.disabled = !cb.checked;
            scheduleViewerUpdate(); scheduleInline3DUpdate();
            if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate();
        });
        num.addEventListener('change', () => {
            scheduleViewerUpdate(); scheduleInline3DUpdate();
            if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate();
        });
    }
});

// ── Dynamic chamfer ↔ wall-margin clamping ─────────────────────────
// Ensures piece chamfer values never exceed the wall margin set in the
// acabados panel (infill_wall or texture_wall depending on mode).
function getActiveChamferMax() {
    const mode = document.querySelector('input[name="acabados_mode"]:checked');
    const modeVal = mode ? mode.value : 'infill';
    let wallId = 'stl_infill_wall';
    if (modeVal === 'texture') wallId = 'stl_texture_wall';
    else if (modeVal === 'image') wallId = 'stl_image_wall';
    const wallEl = document.getElementById(wallId);
    return wallEl ? parseFloat(wallEl.value) || 5 : 5;
}
function clampChamferInputs() {
    const maxVal = getActiveChamferMax();
    ['piece_chamfer_top', 'piece_chamfer_bottom',
     'sliding_piece_chamfer_top', 'sliding_piece_chamfer_bottom'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.max = maxVal;
        if (parseFloat(el.value) > maxVal) el.value = maxVal;
    });
}
// Re-clamp when wall margin or acabados mode changes
['stl_infill_wall', 'stl_texture_wall', 'stl_image_wall'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', clampChamferInputs);
        el.addEventListener('change', clampChamferInputs);
    }
});
document.querySelectorAll('input[name="acabados_mode"]').forEach(r => {
    r.addEventListener('change', clampChamferInputs);
});
// Run once at init
clampChamferInputs();

// ── Chamfer-top compatibility: disable when acabado adds internal/surface geometry ─
// piece_chamfer_top is only usable when mode=infill AND infill_type=solid.
// For hollow/grid/etc., texture or image modes, the top edge is occupied by
// geometry that conflicts with the bevel — it must be locked out.
function isChamferTopCompatible() {
    const mode = (document.querySelector('input[name="acabados_mode"]:checked') || {}).value;
    if (mode === 'texture' || mode === 'image') return false;
    const infillType = (document.getElementById('stl_infill_type') || {}).value || 'solid';
    return infillType === 'solid';
}

const CHAMFER_TOP_INCOMPAT_MSG =
    'No compatible con rellenos interiores, relieves, grabados ni imagen. ' +
    'Solo disponible para piezas sólidas sin acabado de superficie.';

function updateChamferTopCompatibility() {
    const ok = isChamferTopCompatible();
    const tooltipMsg = ok ? '' : CHAMFER_TOP_INCOMPAT_MSG;
    ['piece_chamfer_top', 'sliding_piece_chamfer_top'].forEach(function(id) {
        const cb  = document.getElementById(id + '_on');
        const num = document.getElementById(id);
        if (cb) {
            cb.disabled = !ok;
            if (!ok && cb.checked) {
                cb.checked = false;
                if (num) { num.disabled = true; }
            }
        }
        // data-tooltip on the form-group so the custom tooltip can pick it up
        const fg = cb ? (cb.closest('.form-group') || cb.parentElement) : null;
        if (fg) {
            if (tooltipMsg) fg.setAttribute('data-tooltip', tooltipMsg);
            else fg.removeAttribute('data-tooltip');
        }
    });
    // (edge overlays are rebuilt via _edgeRebuildFn on next mini-viewer update)
}

// Wire to mode and infill-type changes
document.querySelectorAll('input[name="acabados_mode"]').forEach(function(r) {
    r.addEventListener('change', updateChamferTopCompatibility);
});
const _infillTypeEl = document.getElementById('stl_infill_type');
if (_infillTypeEl) _infillTypeEl.addEventListener('change', updateChamferTopCompatibility);
// Run once at init
updateChamferTopCompatibility();

// Update corner style when arc shape changes (fractal circular hides corners)
const arcShapeSelect = document.getElementById('arc_shape');
if (arcShapeSelect) {
    arcShapeSelect.addEventListener('change', () => {
        if (typeof applyInfillDefaults === 'function') applyInfillDefaults();
        if (typeof updateCornerStyleUI === 'function') updateCornerStyleUI();
    });
}

// ── Custom tooltip (replaces browser default `title` popups) ──────────────────
// Any element with [data-tooltip] gets an instant, well-styled floating tooltip.
(function () {
    const tip = document.createElement('div');
    tip.id = 'custom-tooltip';
    document.body.appendChild(tip);

    let _tipTarget = null;

    document.addEventListener('mouseover', function (e) {
        const el = e.target.closest('[data-tooltip]');
        if (el && el.dataset.tooltip) {
            _tipTarget = el;
            tip.textContent = el.dataset.tooltip;
            tip.style.display = 'block';
        } else {
            _tipTarget = null;
            tip.style.display = 'none';
        }
    }, true);

    document.addEventListener('mousemove', function (e) {
        if (tip.style.display !== 'block') return;
        const x = e.clientX + 14;
        const y = e.clientY - 10;
        const tw = tip.offsetWidth, th = tip.offsetHeight;
        tip.style.left = Math.min(x, window.innerWidth  - tw - 8) + 'px';
        tip.style.top  = (y - th < 4 ? e.clientY + 18 : Math.min(y, window.innerHeight - th - 8)) + 'px';
    }, true);

    document.addEventListener('mouseout', function (e) {
        const el = e.target.closest('[data-tooltip]');
        if (el) tip.style.display = 'none';
    }, true);
})();

// Inicializar al cargar
window.addEventListener('load', () => {
    setTimeout(() => {
        if (document.getElementById('viewer-3d')) init3DViewer();
        if (document.getElementById('viewer-3d-babylon')) initBabylonViewer();
        initCollapsibles();
        initDirectionSwitches();
        init2DViewer();
    }, 200);
});

// Actualización automática tras generación de puzzle
const generateBtn = document.getElementById('generate-btn');
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        // Programar refresco del visor tras generar el puzzle
        setTimeout(scheduleViewerUpdate, 500);
        setTimeout(render2DViewer, 600);
    });
}

// ============================================================
// Collapsible sections
// ============================================================

function initDirectionSwitches() {
    document.querySelectorAll('.direction-switch-3').forEach(group => {
        group.querySelectorAll('.dir-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                group.querySelectorAll('.dir-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const target = btn.getAttribute('data-target');
                const hidden = document.getElementById(target);
                if (hidden) {
                    hidden.value = btn.getAttribute('data-value');
                    hidden.dispatchEvent(new Event('change', { bubbles: true }));
                }
                updateEngraveDepthVisibility();
                if (typeof render2DViewer === 'function') render2DViewer();
                if (typeof scheduleInline3DUpdate === 'function') scheduleInline3DUpdate();
                if (typeof scheduleViewerUpdate === 'function') scheduleViewerUpdate();
            });
        });
    });
    // Set initial visibility
    updateEngraveDepthVisibility();
}

function updateEngraveDepthVisibility() {
    const texDir = (document.getElementById('stl_texture_direction') || {}).value;
    const imgDir = (document.getElementById('stl_image_direction') || {}).value;
    const texGroup = document.getElementById('texture-engrave-depth-group');
    const imgGroup = document.getElementById('image-engrave-depth-group');
    if (texGroup) texGroup.style.display = texDir === 'inward' ? '' : 'none';
    if (imgGroup) imgGroup.style.display = imgDir === 'inward' ? '' : 'none';
}

function initCollapsibles() {
    document.querySelectorAll('.collapsible-header').forEach(header => {
        // Sync initial header state with body's initial collapsed state
        const initTargetId = header.getAttribute('data-target');
        const initBody = initTargetId && document.getElementById(initTargetId);
        if (initBody && initBody.classList.contains('collapsed')) {
            header.classList.add('collapsed');
            const initArrow = header.querySelector('.collapse-arrow');
            if (initArrow) initArrow.textContent = '▸';
        }

        header.addEventListener('click', (e) => {
            // Ignore clicks on the reset button
            if (e.target.classList.contains('section-reset-btn')) return;
            const targetId = header.getAttribute('data-target');
            const body = document.getElementById(targetId);
            if (!body) return;
            const isCollapsed = body.classList.toggle('collapsed');
            // Update arrow
            const arrow = header.querySelector('.collapse-arrow');
            if (arrow) {
                if (header.classList.contains('collapsible-sub')) {
                    arrow.textContent = isCollapsed ? '▸' : '▾';
                } else {
                    arrow.textContent = isCollapsed ? '▸' : '▾';
                }
            }
            header.classList.toggle('collapsed', isCollapsed);
        });

        // Add reset button to each collapsible sub-section header
        if (header.classList.contains('collapsible-sub')) {
            const resetBtn = document.createElement('span');
            resetBtn.className = 'section-reset-btn';
            resetBtn.textContent = '↺';
            resetBtn.title = 'Restablecer valores por defecto';
            resetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetId = header.getAttribute('data-target');
                resetSectionDefaults(targetId);
            });
            header.appendChild(resetBtn);
        }
    });
}

function resetSectionDefaults(bodyId) {
    const body = document.getElementById(bodyId);
    if (!body) return;
    body.querySelectorAll('input, select').forEach(el => {
        if (el.type === 'checkbox') {
            el.checked = el.defaultChecked;
        } else if (el.tagName === 'SELECT') {
            // Use DEFAULTS as source of truth for select values
            const defaultVal = DEFAULTS[el.id];
            if (defaultVal !== undefined) {
                el.value = defaultVal;
            } else {
                el.selectedIndex = 0;
            }
        } else {
            el.value = el.defaultValue;
        }
        // Sync linked slider/number pairs
        const linked = el.getAttribute('data-link');
        if (linked) {
            const partner = document.getElementById(linked);
            if (partner) partner.value = el.value;
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    // Trigger viewer updates
    if (typeof render2DViewer === 'function') render2DViewer();
    if (typeof scheduleInline3DUpdate === 'function') scheduleInline3DUpdate();
}

// ============================================================
// 2D Acabados Viewer
// ============================================================
let viewer2DCanvas = null;
let viewer2DCtx = null;
let patternOffsetX = 0;
let patternOffsetY = 0;
let isDragging2D = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartOffsetX = 0;
let dragStartOffsetY = 0;
let viewer2DScale = 1; // Current view scale (pixels per model unit)

function init2DViewer() {
    viewer2DCanvas = document.getElementById('acabados-2d-canvas');
    if (!viewer2DCanvas) return;
    viewer2DCtx = viewer2DCanvas.getContext('2d');

    // Mouse drag for pattern offset
    viewer2DCanvas.addEventListener('mousedown', (e) => {
        if (!isDraggablePattern()) return;
        isDragging2D = true;
        const rect = viewer2DCanvas.getBoundingClientRect();
        dragStartX = e.clientX - rect.left;
        dragStartY = e.clientY - rect.top;
        dragStartOffsetX = patternOffsetX;
        dragStartOffsetY = patternOffsetY;
        viewer2DCanvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging2D) return;
        const rect = viewer2DCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const scaleX = viewer2DCanvas.width / rect.width;
        const scaleY = viewer2DCanvas.height / rect.height;
        patternOffsetX = dragStartOffsetX + (x - dragStartX) * scaleX;
        patternOffsetY = dragStartOffsetY + (y - dragStartY) * scaleY;
        render2DViewer();
    });

    window.addEventListener('mouseup', () => {
        if (isDragging2D) {
            isDragging2D = false;
            if (viewer2DCanvas) viewer2DCanvas.style.cursor = isDraggablePattern() ? 'grab' : 'default';
            scheduleInline3DUpdate();
        }
    });

    // Touch drag support
    viewer2DCanvas.addEventListener('touchstart', (e) => {
        if (!isDraggablePattern()) return;
        if (e.touches.length === 1) {
            isDragging2D = true;
            const rect = viewer2DCanvas.getBoundingClientRect();
            const touch = e.touches[0];
            dragStartX = touch.clientX - rect.left;
            dragStartY = touch.clientY - rect.top;
            dragStartOffsetX = patternOffsetX;
            dragStartOffsetY = patternOffsetY;
            e.preventDefault();
        }
    }, { passive: false });

    viewer2DCanvas.addEventListener('touchmove', (e) => {
        if (!isDragging2D || e.touches.length !== 1) return;
        const rect = viewer2DCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const scaleX = viewer2DCanvas.width / rect.width;
        const scaleY = viewer2DCanvas.height / rect.height;
        patternOffsetX = dragStartOffsetX + (x - dragStartX) * scaleX;
        patternOffsetY = dragStartOffsetY + (y - dragStartY) * scaleY;
        render2DViewer();
        e.preventDefault();
    }, { passive: false });

    viewer2DCanvas.addEventListener('touchend', () => {
        if (isDragging2D) scheduleInline3DUpdate();
        isDragging2D = false;
    });
}

// Check if the current pattern allows dragging
function hasDrawablePattern() {
    const acabadosMode = document.querySelector('input[name="acabados_mode"]:checked');
    const val = acabadosMode ? acabadosMode.value : 'infill';
    if (val === 'image') return false; // image drawn separately
    if (val === 'texture') return true;
    const it = (document.getElementById('stl_infill_type') || {}).value || 'solid';
    return it !== 'solid' && it !== 'hollow' && it !== 'remix';
}

function isDraggablePattern() {
    const acabadosMode = document.querySelector('input[name="acabados_mode"]:checked');
    const val = acabadosMode ? acabadosMode.value : 'infill';
    if (val === 'image') return true; // image can be dragged
    if (val === 'texture') {
        const tt = (document.getElementById('stl_texture_type') || {}).value || 'grid';
        return tt !== 'circles' && tt !== 'solid'; // circles (lego) and solid not draggable
    }
    // infill
    const it = (document.getElementById('stl_infill_type') || {}).value || 'solid';
    return it !== 'solid' && it !== 'hollow' && it !== 'circles' && it !== 'remix';
}

// Update drag hint text
function updateDragHints() {
    const hintDrag = document.getElementById('acabados-hint-drag');
    const hintNoDrag = document.getElementById('acabados-hint-nodrag');
    const hintNoPuzzle = document.getElementById('acabados-hint-nopuzzle');
    if (!hintDrag || !hintNoDrag || !hintNoPuzzle) return;
    const draggable = isDraggablePattern();
    const hasPuzzle = puzzleData && puzzleData.grid;
    // If there is no puzzle, show the 'generate puzzle' overlay and hide other hints
    hintNoPuzzle.style.display = hasPuzzle ? 'none' : '';
    // Only show the drag hint when a puzzle exists
    // hintDrag.style.display = hasPuzzle ? '' : 'none';
    // Show 'no-drag' only when puzzle exists and pattern is not draggable
    hintNoDrag.style.display = (hasPuzzle && !draggable) ? '' : 'none';
    const canvasEl = document.getElementById('acabados-2d-canvas');
    if (canvasEl) canvasEl.style.cursor = (hasPuzzle && draggable) ? 'grab' : 'default';
}

// Build piece polygons from puzzleData (normal puzzles) - no tolerance applied
function buildPiecePolygons(cubeSize) {
    if (!puzzleData || !puzzleData.grid || !puzzleData.pieces) return [];
    const grid = puzzleData.grid;
    const pieces = puzzleData.pieces;
    const isSliding = puzzleData.puzzleType === 'sliding';
    const result = [];

    for (let pIdx = 0; pIdx < pieces.length; pIdx++) {
        // Sliding pieces are {id, row, col}; normalize to [[row, col]]
        const cells = isSliding ? [[pieces[pIdx].row, pieces[pIdx].col]] : pieces[pIdx];
        const edgeSet = new Map();
        for (const [r, c] of cells) {
            const x0 = c * cubeSize;
            const y0 = r * cubeSize;
            const x1 = x0 + cubeSize;
            const y1 = y0 + cubeSize;
            const edges = [
                [x0, y0, x1, y0],
                [x1, y0, x1, y1],
                [x1, y1, x0, y1],
                [x0, y1, x0, y0],
            ];
            for (const edge of edges) {
                const fwd = edge.join(',');
                const rev = [edge[2], edge[3], edge[0], edge[1]].join(',');
                if (edgeSet.has(rev)) {
                    edgeSet.delete(rev);
                } else {
                    edgeSet.set(fwd, edge);
                }
            }
        }
        const edgeList = Array.from(edgeSet.values());
        if (edgeList.length === 0) continue;

        const polygon = [];
        const used = new Array(edgeList.length).fill(false);
        used[0] = true;
        polygon.push([edgeList[0][0], edgeList[0][1]]);
        let cx = edgeList[0][2];
        let cy = edgeList[0][3];
        polygon.push([cx, cy]);

        for (let iter = 1; iter < edgeList.length; iter++) {
            let found = false;
            for (let i = 0; i < edgeList.length; i++) {
                if (used[i]) continue;
                if (Math.abs(edgeList[i][0] - cx) < 0.001 && Math.abs(edgeList[i][1] - cy) < 0.001) {
                    used[i] = true;
                    cx = edgeList[i][2];
                    cy = edgeList[i][3];
                    polygon.push([cx, cy]);
                    found = true;
                    break;
                }
            }
            if (!found) break;
        }

        result.push({ polygon, pieceIndex: pIdx, cells });
    }
    return result;
}

// Build base outline (outer rectangle including border)
function buildBaseOutline(cubeSize, border, numCols, numRows) {
    const totalW = numCols * cubeSize + 2 * border;
    const totalH = numRows * cubeSize + 2 * border;
    return {
        x: -border,
        y: -border,
        width: totalW,
        height: totalH
    };
}

// Distinct colors for pieces
// const PIECE_COLORS = [
//     '#667eea', '#e6735a', '#52c0a8', '#f5b73d', '#9b6fcf',
//     '#3db8e8', '#e8607a', '#7bc85e', '#e49c44', '#5a8fd4',
//     '#c45fb0', '#45bfa8', '#d97c4a', '#6a9ee6', '#d65d8c'
// ];

function render2DViewer() {
    if (!viewer2DCtx || !viewer2DCanvas) return;
    const ctx = viewer2DCtx;
    const W = viewer2DCanvas.width;
    const H = viewer2DCanvas.height;
    ctx.clearRect(0, 0, W, H);

    if (!puzzleData || !puzzleData.grid) {
        const info = document.getElementById('acabados-viewer-info');
        if (info) info.style.display = '';
        return;
    }
    const info = document.getElementById('acabados-viewer-info');
    if (info) info.style.display = 'none';

    const grid = puzzleData.grid;
    const numRows = grid.length;
    const numCols = grid[0].length;
    const isSliding = puzzleData.puzzleType === 'sliding';
    const cubeSize = isSliding
        ? (parseFloat((document.getElementById('sliding_cell_size') || {}).value) || 20)
        : (parseFloat(document.getElementById('stl_cube_size').value) || 20);
    const border = isSliding
        ? (parseFloat((document.getElementById('sliding_frame_border') || {}).value) || 4)
        : (parseFloat(document.getElementById('stl_border').value) || 3);
    const isFractal = puzzleData.puzzleType === 'fractal' || puzzleData.puzzleType === 'jigsaw';

    // Determine acabados mode
    const acabadosMode = document.querySelector('input[name="acabados_mode"]:checked');
    const mode = acabadosMode ? acabadosMode.value : 'infill';
    const isTexture = mode === 'texture';
    const isImage = mode === 'image';

    // Check if pattern is draggable — if not, skip pattern drawing
    const draggable = isDraggablePattern();

    if (isFractal && puzzleData.svgPaths && puzzleData.svgPaths.length > 0) {
        // Fractal puzzle: render using SVG paths
        const ncols = puzzleData.fractalNcols;
        const nrows = puzzleData.fractalNrows;
        const isJigsawType = puzzleData.puzzleType === 'jigsaw';
        let svgW = isJigsawType ? ncols : ncols * 2;
        let svgH = isJigsawType ? nrows : nrows * 2;

        // For hex/circular jigsaw, compute actual bounding box of all piece paths
        // to prevent overflow beyond the assumed rectangular viewport
        const jt = puzzleData.jigsawType;
        const isHexType = isJigsawType && (jt === 'hexagonal' || jt === 'circular');
        let svgOX = 0, svgOY = 0;
        if (isHexType) {
            let bMinX = Infinity, bMinY = Infinity, bMaxX = -Infinity, bMaxY = -Infinity;
            for (const d of puzzleData.svgPaths) {
                if (!d) continue;
                const flat = parseSvgPathToPoints(d, 4);
                for (let k = 0; k < flat.length; k += 2) {
                    if (flat[k] < bMinX) bMinX = flat[k];
                    if (flat[k] > bMaxX) bMaxX = flat[k];
                    if (flat[k+1] < bMinY) bMinY = flat[k+1];
                    if (flat[k+1] > bMaxY) bMaxY = flat[k+1];
                }
            }
            if (isFinite(bMinX)) {
                svgOX = bMinX;
                svgOY = bMinY;
                svgW = bMaxX - bMinX;
                svgH = bMaxY - bMinY;
            }
        }

        const pad = VIEWER_PARAMS.viewer2DPadPx;
        const scaleX = (W - 2 * pad) / svgW;
        const scaleY = (H - 2 * pad) / svgH;
        const scale = Math.min(scaleX, scaleY);
        // viewer2DScale: pixels-per-model-unit (SVG units)
        viewer2DScale = scale;

        const drawW = svgW * scale;
        const drawH = svgH * scale;
        const ox = (W - drawW) / 2;
        const oy = (H - drawH) / 2;

        ctx.save();
        ctx.translate(ox - svgOX * scale, oy - svgOY * scale);
        ctx.scale(scale, scale);

        // Draw background
        ctx.fillStyle = '#e8e8e8';
        ctx.fillRect(svgOX, svgOY, svgW, svgH);

        // Convert mm parameters to SVG units: fractal: 1 mm = 2/cubeSize, jigsaw: 1 mm = 1/cubeSize
        const mmToSvg = (isJigsawType ? 1 : 2) / cubeSize;

        // Build combined clip path for all pieces
        const allPiecesPath = new Path2D();
        const piecePaths = [];
        for (let i = 0; i < puzzleData.svgPaths.length; i++) {
            const d = puzzleData.svgPaths[i];
            if (!d) { piecePaths.push(null); continue; }
            const path = new Path2D(d);
            piecePaths.push(path);
            allPiecesPath.addPath(path);
        }

        // Draw all piece fills
        for (let i = 0; i < piecePaths.length; i++) {
            if (!piecePaths[i]) continue;
            ctx.fillStyle = PIECE_COLORS[i % PIECE_COLORS.length] + '55';
            ctx.fill(piecePaths[i]);
        }

        // Draw pattern/image ONCE, clipped to all pieces combined
        if (hasDrawablePattern() || isImage) {
            ctx.save();
            ctx.clip(allPiecesPath);
            const invertTex = isTexture && (document.getElementById('stl_texture_invert') || {}).checked;
            if (invertTex) {
                ctx.fillStyle = '#555';
                ctx.fillRect(-10000, -10000, 20000, 20000);
                ctx.globalCompositeOperation = 'destination-out';
            }
            if (isImage) {
                drawCustomImage(ctx, svgW, svgH, scale, mmToSvg);
            } else {
                drawPattern(ctx, svgW, svgH, scale, isTexture, null, mmToSvg, cubeSize);
            }
            if (invertTex) ctx.globalCompositeOperation = 'source-over';
            ctx.restore();
        }

        // Draw piece outlines
        for (let i = 0; i < piecePaths.length; i++) {
            if (!piecePaths[i]) continue;
            ctx.strokeStyle = PIECE_COLORS[i % PIECE_COLORS.length];
            ctx.lineWidth = 0.03;
            ctx.stroke(piecePaths[i]);
        }

        ctx.restore();
    } else {
        // Normal puzzle
        const base = buildBaseOutline(cubeSize, border, numCols, numRows);
        const pad = 20;
        const scaleX = (W - 2 * pad) / base.width;
        const scaleY = (H - 2 * pad) / base.height;
        const scale = Math.min(scaleX, scaleY);
        viewer2DScale = scale;

        const drawW = base.width * scale;
        const drawH = base.height * scale;
        const ox = (W - drawW) / 2 - base.x * scale;
        const oy = (H - drawH) / 2 - base.y * scale;

        ctx.save();
        ctx.translate(ox, oy);
        ctx.scale(scale, scale);

        // Draw base rectangle
        ctx.fillStyle = '#e8e8e8';
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1 / scale;
        ctx.fillRect(base.x, base.y, base.width, base.height);
        ctx.strokeRect(base.x, base.y, base.width, base.height);

        // Build piece polygons (no tolerance)
        const pieces = buildPiecePolygons(cubeSize);

        // Build combined clip path and individual paths
        const allPiecesPath = new Path2D();
        const piecePaths = [];
        for (let i = 0; i < pieces.length; i++) {
            const poly = pieces[i].polygon;
            if (poly.length < 3) { piecePaths.push(null); continue; }
            const path = new Path2D();
            path.moveTo(poly[0][0], poly[0][1]);
            for (let j = 1; j < poly.length; j++) path.lineTo(poly[j][0], poly[j][1]);
            path.closePath();
            piecePaths.push(path);
            allPiecesPath.addPath(path);
        }

        // Draw all piece fills
        for (let i = 0; i < piecePaths.length; i++) {
            if (!piecePaths[i]) continue;
            ctx.fillStyle = PIECE_COLORS[i % PIECE_COLORS.length] + '33';
            ctx.fill(piecePaths[i]);
        }

        // Draw pattern/image ONCE, clipped to all pieces combined (continuous across pieces)
        if (hasDrawablePattern() || isImage) {
            ctx.save();
            ctx.clip(allPiecesPath);
            const invertTex = isTexture && (document.getElementById('stl_texture_invert') || {}).checked;
            if (invertTex) {
                ctx.fillStyle = '#555';
                ctx.fillRect(-10000, -10000, 20000, 20000);
                ctx.globalCompositeOperation = 'destination-out';
            }
            if (isImage) {
                drawCustomImage(ctx, numCols * cubeSize, numRows * cubeSize, scale, 1);
            } else {
                drawPattern(ctx, numCols * cubeSize, numRows * cubeSize, scale, isTexture, null, 1, cubeSize);
            }
            if (invertTex) ctx.globalCompositeOperation = 'source-over';
            ctx.restore();
        }

        // Draw piece outlines
        for (let i = 0; i < piecePaths.length; i++) {
            if (!piecePaths[i]) continue;
            ctx.strokeStyle = PIECE_COLORS[i % PIECE_COLORS.length];
            ctx.lineWidth = 1.5 / scale;
            ctx.stroke(piecePaths[i]);
        }

        ctx.restore();
    }

    // Update drag hints
    updateDragHints();
}

// Draw the custom image into the 2D viewer
// totalW/totalH: model-space dimensions; viewScale: pixels per model unit; paramScale: mm→model
function drawCustomImage(ctx, totalW, totalH, viewScale, paramScale) {
    if (!customTextureImage) return;
    const zoom = parseFloat((document.getElementById('stl_texture_custom_zoom') || {}).value) || 100;
    const zoomFactor = zoom / 100;
    const lineThickness = parseInt((document.getElementById('stl_image_line_thickness') || {}).value) || 0;

    const imgW = totalW * zoomFactor;
    const imgH = totalH * zoomFactor;

    // Convert pixel offset to model-space offset
    const offX = patternOffsetX / viewScale;
    const offY = patternOffsetY / viewScale;
    const drawX = (totalW - imgW) / 2 + offX;
    const drawY = (totalH - imgH) / 2 + offY;

    // Build a version of the image with transparent whites
    // Use an offscreen canvas to convert white→transparent, black→semi-opaque
    const off = document.createElement('canvas');
    off.width = customTextureImage.width;
    off.height = customTextureImage.height;
    const offCtx = off.getContext('2d');
    offCtx.drawImage(customTextureImage, 0, 0);
    const imgData = offCtx.getImageData(0, 0, off.width, off.height);
    const d = imgData.data;
    const w = off.width, h = off.height;

    // Build binary mask: 1 = visible pixel (dark pixels)
    const mask = new Uint8Array(w * h);
    for (let i = 0; i < d.length; i += 4) {
        const gray = d[i];
        mask[i / 4] = gray < 128 ? 1 : 0;
    }

    // Apply dilation (MaxFilter equivalent) if line thickness > 0
    let finalMask = mask;
    if (lineThickness > 0) {
        finalMask = new Uint8Array(w * h);
        const r = lineThickness;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let found = false;
                for (let dy = -r; dy <= r && !found; dy++) {
                    for (let dx = -r; dx <= r && !found; dx++) {
                        if (dx * dx + dy * dy > r * r) continue;
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < w && ny >= 0 && ny < h && mask[ny * w + nx]) {
                            found = true;
                        }
                    }
                }
                finalMask[y * w + x] = found ? 1 : 0;
            }
        }
    }

    // Apply mask to image data
    for (let i = 0; i < finalMask.length; i++) {
        const pi = i * 4;
        if (finalMask[i]) {
            d[pi] = d[pi + 1] = d[pi + 2] = 40;
            d[pi + 3] = 200;
        } else {
            d[pi + 3] = 0;
        }
    }
    offCtx.putImageData(imgData, 0, 0);

    ctx.drawImage(off, drawX, drawY, imgW, imgH);
}

// Draw pattern overlay; totalW/totalH in model units; paramScale converts mm→model units
// cubeSize_mm is the cube size in mm (used for Lego to calculate cell positions)
function drawPattern(ctx, totalW, totalH, viewScale, isTexture, pieceCells, paramScale, cubeSize_mm) {
    let patternType, fillWidth, spacing, angle, amplitude, cellSize;

    if (isTexture) {
        patternType = (document.getElementById('stl_texture_type') || {}).value || 'grid';
        const prefix = 'stl_texture_';
        fillWidth = parseFloat((document.getElementById(prefix + 'fill_width_' + patternType) || {}).value) || 1;
        spacing = parseFloat((document.getElementById(prefix + 'spacing_' + patternType) || {}).value) || 4;
        angle = parseFloat((document.getElementById(prefix + 'angle_' + patternType) || {}).value) || 0;
        amplitude = parseFloat((document.getElementById('stl_texture_amplitude') || {}).value) || 2;
        cellSize = parseFloat((document.getElementById('stl_texture_cell_size') || {}).value) || 5;
    } else {
        patternType = (document.getElementById('stl_infill_type') || {}).value || 'solid';
        if (patternType === 'solid' || patternType === 'hollow' || patternType === 'remix') return;
        const suffixMap = { grid: '', stripes: '_s', zigzag: '_z', honeycomb: '_h', circles: '_c' };
        const suffix = suffixMap[patternType] || '';
        fillWidth = parseFloat((document.getElementById('stl_infill_fill_width' + suffix) || {}).value) || 1;
        const spacingIdMap = { grid: 'stl_infill_spacing', stripes: 'stl_infill_spacing_s', zigzag: 'stl_infill_spacing_z' };
        spacing = parseFloat((document.getElementById(spacingIdMap[patternType] || 'stl_infill_spacing') || {}).value) || 4;
        angle = parseFloat((document.getElementById('stl_infill_angle_' + patternType) || {}).value) || 0;
        amplitude = parseFloat((document.getElementById('stl_infill_amplitude') || {}).value) || 2;
        cellSize = parseFloat((document.getElementById('stl_infill_cell_size') || {}).value) || 5;
    }

    // Scale mm-based params to model units (paramScale=1 for normal, 2/cubeSize for fractal)
    fillWidth *= paramScale;
    spacing *= paramScale;
    amplitude *= paramScale;
    cellSize *= paramScale;

    const patternColor = isTexture ? '#555' : '#888';
    ctx.strokeStyle = patternColor;
    ctx.fillStyle = patternColor;

    // Compute offset: convert screen pixels to model units, counter-rotate for natural drag
    const rad = (angle * Math.PI) / 180;
    const rawOffX = patternOffsetX / viewScale;
    const rawOffY = patternOffsetY / viewScale;
    const cosA = Math.cos(-rad);
    const sinA = Math.sin(-rad);
    const offX = rawOffX * cosA - rawOffY * sinA;
    const offY = rawOffX * sinA + rawOffY * cosA;

    // Apply rotation around center of puzzle area
    const cx = totalW / 2;
    const cy = totalH / 2;
    const ext = Math.max(totalW, totalH) * 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rad);
    ctx.translate(-cx, -cy);
    // Apply drag offset as a canvas translation (smooth movement for all patterns)
    ctx.translate(offX, offY);

    switch (patternType) {
        case 'solid': {
            ctx.fillStyle = patternColor;
            ctx.fillRect(-ext, -ext, totalW + 2 * ext, totalH + 2 * ext);
            break;
        }
        case 'grid': {
            ctx.lineWidth = fillWidth;
            ctx.beginPath();
            for (let x = -ext; x <= totalW + ext; x += spacing) {
                ctx.moveTo(x, -ext);
                ctx.lineTo(x, totalH + ext);
            }
            for (let y = -ext; y <= totalH + ext; y += spacing) {
                ctx.moveTo(-ext, y);
                ctx.lineTo(totalW + ext, y);
            }
            ctx.stroke();
            break;
        }
        case 'stripes': {
            const step = spacing + fillWidth;
            ctx.lineWidth = fillWidth;
            ctx.beginPath();
            for (let y = -ext; y <= totalH + ext; y += step) {
                ctx.moveTo(-ext, y);
                ctx.lineTo(totalW + ext, y);
            }
            ctx.stroke();
            break;
        }
        case 'zigzag': {
            const yStep = spacing * 2 + fillWidth;
            const segLen = spacing;
            ctx.lineWidth = fillWidth;
            ctx.beginPath();
            for (let y = -ext; y <= totalH + ext; y += yStep) {
                let first = true;
                let i = 0;
                for (let x = -ext; x <= totalW + ext; x += segLen) {
                    const dy = (i % 2 === 0) ? amplitude : -amplitude;
                    if (first) { ctx.moveTo(x, y + dy); first = false; }
                    else ctx.lineTo(x, y + dy);
                    i++;
                }
            }
            ctx.stroke();
            break;
        }
        case 'honeycomb': {
            // Continuous honeycomb matching backend: fill walls between hexagonal cells
            // cellSize = center-to-center distance; fillWidth = wall thickness between cells
            const hexPitch = cellSize;
            const hexR = (cellSize - fillWidth) / Math.sqrt(3);
            const rowH = cellSize * Math.sqrt(3) / 2;
            // Use reduced extent for performance (canvas is clipped anyway)
            const hExt = Math.max(totalW, totalH) * 0.6;
            ctx.fillStyle = patternColor;
            // Build path: outer rectangle + hex holes (evenodd → walls only)
            ctx.beginPath();
            ctx.rect(-hExt, -hExt, totalW + 2 * hExt, totalH + 2 * hExt);
            const startRow = Math.floor(-hExt / rowH) - 1;
            const endRow = Math.ceil((totalH + hExt) / rowH) + 1;
            const startCol = Math.floor(-hExt / hexPitch) - 1;
            const endCol = Math.ceil((totalW + hExt) / hexPitch) + 1;
            for (let row = startRow; row <= endRow; row++) {
                const xShift = (row % 2 !== 0) ? (hexPitch / 2) : 0;
                for (let col = startCol; col <= endCol; col++) {
                    const hx = col * hexPitch + xShift;
                    const hy = row * rowH;
                    const x0 = hx + hexR * Math.cos(Math.PI / 6);
                    const y0 = hy + hexR * Math.sin(Math.PI / 6);
                    ctx.moveTo(x0, y0);
                    for (let k = 1; k <= 6; k++) {
                        const a = Math.PI / 6 + (Math.PI / 3) * k;
                        ctx.lineTo(hx + hexR * Math.cos(a), hy + hexR * Math.sin(a));
                    }
                    ctx.closePath();
                }
            }
            ctx.fill('evenodd');
            break;
        }
        case 'circles': {
            // Lego pattern: one circle per grid cell
            // Undo the offset translation (circles are tied to cell positions)
            ctx.translate(-offX, -offY);
            // Undo rotation
            ctx.translate(cx, cy);
            ctx.rotate(-rad);
            ctx.translate(-cx, -cy);

            // Determine the cell size in model units
            const csModel = cubeSize_mm * paramScale;
            const gridCols = Math.round(totalW / csModel);
            const gridRows = Math.round(totalH / csModel);

            // Read circle radius (% of cell) and filled option
            const radiusPrefix = isTexture ? 'stl_texture_circle_radius' : 'stl_infill_circle_radius';
            const filledPrefix = isTexture ? 'stl_texture_circle_filled' : 'stl_infill_circle_filled';
            const radiusPct = parseFloat((document.getElementById(radiusPrefix) || {}).value) || 40;
            const isFilled = (document.getElementById(filledPrefix) || {}).checked !== false;
            const radius = csModel * (radiusPct / 100);

            if (isFilled) {
                ctx.fillStyle = patternColor;
                ctx.beginPath();
                for (let r = 0; r < gridRows; r++) {
                    for (let c = 0; c < gridCols; c++) {
                        const ccx = c * csModel + csModel / 2;
                        const ccy = r * csModel + csModel / 2;
                        ctx.moveTo(ccx + radius, ccy);
                        ctx.arc(ccx, ccy, radius, 0, Math.PI * 2);
                    }
                }
                ctx.fill();
            } else {
                ctx.strokeStyle = patternColor;
                ctx.lineWidth = fillWidth;
                ctx.beginPath();
                for (let r = 0; r < gridRows; r++) {
                    for (let c = 0; c < gridCols; c++) {
                        const ccx = c * csModel + csModel / 2;
                        const ccy = r * csModel + csModel / 2;
                        ctx.moveTo(ccx + radius, ccy);
                        ctx.arc(ccx, ccy, radius, 0, Math.PI * 2);
                    }
                }
                ctx.stroke();
            }
            break;
        }
    }

    ctx.restore();
}

function drawHexagon(ctx, cx, cy, r, fill) {
    ctx.moveTo(cx + r, cy);
    for (let i = 1; i <= 6; i++) {
        const angle = (Math.PI / 3) * i;
        ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    }
    if (fill) ctx.fill();
}

// ============================================================
// Custom image texture
// ============================================================
let customTextureImage = null; // Processed B/W image data
let customTextureOriginal = null; // Original uploaded image

function initCustomTextureHandlers() {
    const fileInput = document.getElementById('stl_texture_custom_file');
    const thresholdInput = document.getElementById('stl_texture_custom_threshold');
    const blurCheck = document.getElementById('stl_texture_custom_blur');
    const zoomInput = document.getElementById('stl_texture_custom_zoom');
    const editBtn = document.getElementById('texture-custom-edit-btn');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    customTextureOriginal = img;
                    processCustomTexture();
                    if (editBtn) editBtn.style.display = '';
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
            // update custom file button label
            const fileBtn = document.getElementById('texture-custom-file-btn');
            if (fileBtn) fileBtn.textContent = 'Reemplazar imagen';
        });
        // if we have a custom button, open file selector when clicked
        const fileBtn = document.getElementById('texture-custom-file-btn');
        if (fileBtn) {
            fileBtn.addEventListener('click', () => {
                fileInput.click();
            });
        }
    }

    if (thresholdInput) {
        thresholdInput.addEventListener('input', () => {
            if (customTextureOriginal) processCustomTexture();
        });
    }

    if (zoomInput) {
        zoomInput.addEventListener('input', () => {
            render2DViewer();
        });
    }

    if (blurCheck) {
        blurCheck.addEventListener('change', () => {
            if (customTextureOriginal) processCustomTexture();
        });
    }

    // Line thickness triggers 2D re-render
    const lineThicknessInput = document.getElementById('stl_image_line_thickness');
    if (lineThicknessInput) {
        lineThicknessInput.addEventListener('input', () => render2DViewer());
    }

    // "Already B&W" checkbox: disable threshold + blur when checked
    const alreadyBWCheck = document.getElementById('stl_image_already_bw');
    if (alreadyBWCheck) {
        alreadyBWCheck.addEventListener('change', () => {
            const thresholdGroup = document.getElementById('image-threshold-group');
            const blurCheck = document.getElementById('stl_texture_custom_blur');
            if (thresholdGroup) thresholdGroup.style.opacity = alreadyBWCheck.checked ? '0.4' : '';
            if (thresholdGroup) thresholdGroup.style.pointerEvents = alreadyBWCheck.checked ? 'none' : '';
            if (blurCheck) blurCheck.disabled = alreadyBWCheck.checked;
            if (blurCheck && blurCheck.closest) {
                const lbl = blurCheck.closest('.form-group');
                if (lbl) { lbl.style.opacity = alreadyBWCheck.checked ? '0.4' : ''; lbl.style.pointerEvents = alreadyBWCheck.checked ? 'none' : ''; }
            }
            if (customTextureOriginal) processCustomTexture();
        });
    }

    if (editBtn) {
        editBtn.addEventListener('click', openTextureEditor);
    }
}

function processCustomTexture() {
    if (!customTextureOriginal) return;
    const alreadyBW = (document.getElementById('stl_image_already_bw') || {}).checked;
    const threshold = parseInt((document.getElementById('stl_texture_custom_threshold') || {}).value) || 128;
    const doBlur = !alreadyBW && (document.getElementById('stl_texture_custom_blur') || {}).checked;

    // Create offscreen canvas
    const offCanvas = document.createElement('canvas');
    const size = 512;
    offCanvas.width = size;
    offCanvas.height = size;
    const offCtx = offCanvas.getContext('2d');

    // Draw image scaled to fit
    const img = customTextureOriginal;
    const scale = Math.min(size / img.width, size / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    offCtx.fillStyle = '#fff';
    offCtx.fillRect(0, 0, size, size);
    offCtx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

    // Get image data
    const imageData = offCtx.getImageData(0, 0, size, size);
    const data = imageData.data;

    if (alreadyBW) {
        // Use image as-is: just convert to strict B&W from existing pixel values
        for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const val = gray > 128 ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = val;
            data[i + 3] = 255;
        }
    } else {
        // Optional blur (simple box blur)
        if (doBlur) {
            const tmp = new Uint8ClampedArray(data);
            const radius = 2;
            for (let y = radius; y < size - radius; y++) {
                for (let x = radius; x < size - radius; x++) {
                    let sum = 0, count = 0;
                    for (let dy = -radius; dy <= radius; dy++) {
                        for (let dx = -radius; dx <= radius; dx++) {
                            const idx = ((y + dy) * size + (x + dx)) * 4;
                            sum += (tmp[idx] + tmp[idx + 1] + tmp[idx + 2]) / 3;
                            count++;
                        }
                    }
                    const avg = sum / count;
                    const idx = (y * size + x) * 4;
                    data[idx] = data[idx + 1] = data[idx + 2] = avg;
                }
            }
        }

        // Threshold to B/W
        for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const val = gray > threshold ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = val;
            data[i + 3] = 255;
        }
    }

    offCtx.putImageData(imageData, 0, 0);
    customTextureImage = offCanvas;
    render2DViewer();
    scheduleInline3DUpdate();
    if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate();
}

// ============================================================
// Texture Editor (Paint Modal)
// ============================================================
let editorCanvas = null;
let editorCtx = null;
let editorPaintColor = 'black';
let editorBrushSize = 10;
let isEditorPainting = false;

function openTextureEditor() {
    if (!customTextureImage) return;
    const modal = document.getElementById('texture-editor-modal');
    if (!modal) return;
    modal.style.display = 'flex';

    editorCanvas = document.getElementById('texture-editor-canvas');
    editorCtx = editorCanvas.getContext('2d');
    // Copy current processed image to editor
    editorCtx.drawImage(customTextureImage, 0, 0, 512, 512);

    // Paint handlers
    const handlePaint = (e) => {
        if (!isEditorPainting) return;
        const rect = editorCanvas.getBoundingClientRect();
        const scaleX = 512 / rect.width;
        const scaleY = 512 / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        editorCtx.fillStyle = editorPaintColor;
        editorCtx.beginPath();
        editorCtx.arc(x, y, editorBrushSize, 0, Math.PI * 2);
        editorCtx.fill();
    };

    editorCanvas.onmousedown = (e) => { isEditorPainting = true; handlePaint(e); };
    editorCanvas.onmousemove = handlePaint;
    editorCanvas.onmouseup = () => { isEditorPainting = false; };
    editorCanvas.onmouseleave = () => { isEditorPainting = false; };

    // Toolbar
    document.getElementById('tex-paint-black').onclick = () => {
        editorPaintColor = 'black';
        document.getElementById('tex-paint-black').classList.add('active');
        document.getElementById('tex-paint-white').classList.remove('active');
    };
    document.getElementById('tex-paint-white').onclick = () => {
        editorPaintColor = 'white';
        document.getElementById('tex-paint-white').classList.add('active');
        document.getElementById('tex-paint-black').classList.remove('active');
    };
    document.getElementById('tex-brush-size').oninput = (e) => {
        editorBrushSize = parseInt(e.target.value);
    };
    document.getElementById('tex-editor-reset').onclick = () => {
        if (customTextureImage) {
            editorCtx.drawImage(customTextureImage, 0, 0, 512, 512);
        }
    };
    document.getElementById('tex-editor-cancel').onclick = closeTextureEditor;
    document.getElementById('texture-editor-close').onclick = closeTextureEditor;
    document.getElementById('tex-editor-apply').onclick = () => {
        // Copy editor canvas to customTextureImage
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 512;
        offCanvas.height = 512;
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(editorCanvas, 0, 0);
        customTextureImage = offCanvas;
        closeTextureEditor();
        render2DViewer();
    };
}

function closeTextureEditor() {
    const modal = document.getElementById('texture-editor-modal');
    if (modal) modal.style.display = 'none';
    isEditorPainting = false;
}

// Initialize custom texture handlers
initCustomTextureHandlers();

// Generic slider ↔ number sync for all slider-number-group pairs
document.querySelectorAll('.slider-number-group').forEach(group => {
    const range = group.querySelector('input[type="range"]');
    const num = group.querySelector('input[type="number"]');
    if (!range || !num) return;
    range.addEventListener('input', () => { num.value = range.value; render2DViewer(); scheduleInline3DUpdate(); });
    num.addEventListener('input', () => { range.value = num.value; render2DViewer(); scheduleInline3DUpdate(); });
});

// Threshold range slider needs to reprocess the image (generic sync only calls render2DViewer)
const thresholdRange = document.querySelector('input[type="range"][data-link="stl_texture_custom_threshold"]');
if (thresholdRange) {
    thresholdRange.addEventListener('input', () => {
        if (customTextureOriginal) processCustomTexture();
    });
}

// ============================================================
// Inline 3D Viewer (acabados panel)
// ============================================================
let inline3DRenderer = null;
let inline3DScene = null;
let inline3DCamera = null;
let inline3DGroup = null;
let inline3DTimer = null;
let inline3DAnimId = null;
let inline3DAmbientLight = null;
let inline3DDirLight = null;
let inline3DFillLight = null;
// Vertical offset (pixels) applied to the inline 3D canvas via CSS transform.
// Positive values move the canvas down, negative values move it up.
// Adjust this value to vertically center the model inside the fixed-height viewer
// without changing the Three.js scene or camera.
// Adjusted for VIEWER_HEIGHT=380 to avoid canvas being clipped at bottom
// Vertical offset (pixels) applied visually to the inline 3D view.
// Previously this was applied as a CSS transform on the canvas which also
// moved the canvas background. Convert the desired pixel offset to a
// world-space offset applied to the camera target so only the model moves
// inside the canvas (background stays put).
let inline3DVerticalOffset = -70;
// Fixed inline viewer height (pixels). Use this single value everywhere so
// we can convert pixel offsets into world units consistently.
let INLINE_VIEWER_HEIGHT = 399;
// Inline view camera angle defaults (degrees).
// `azimuth`: rotation around Y (0 = +X front, negative = rotate towards -X).
// `elevation`: angle above the horizontal (higher = more top-down).
let inline3DAzimuthDeg = -90;
let inline3DElevationDeg = 60;
let inline3DControls = null;
let inline3DSavedCamPos = null;
let inline3DSavedCamTarget = null;
let inline3DHasModel = false;

function initInline3D() {
    const container = document.getElementById('acabados-3d-inline');
    if (!container || !window.THREE) return;

    inline3DScene = new THREE.Scene();
    inline3DScene.background = new THREE.Color(0xf9fafb);

    const VIEWER_HEIGHT = INLINE_VIEWER_HEIGHT;
    inline3DCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);

    inline3DRenderer = new THREE.WebGLRenderer({ antialias: true });
    inline3DRenderer.setPixelRatio(window.devicePixelRatio);
    const w = container.clientWidth || 800;
    inline3DRenderer.setSize(w, VIEWER_HEIGHT);
    inline3DCamera.aspect = w / VIEWER_HEIGHT;
    inline3DCamera.updateProjectionMatrix();
    container.appendChild(inline3DRenderer.domElement);
    // Note: we intentionally do NOT apply a CSS transform here. Vertical
    // adjustments are converted to a camera/look-at offset in
    // `frameInline3DCamera()` so the canvas background doesn't move.

    // Lights — defaults match MINI_VIEWER_DEFAULTS.inline3d.
    // Edit those values to change defaults, or use the debug panel
    // (Ctrl+Shift+F12) → "Visor Inline (acabados)" to adjust live.
    inline3DAmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
    inline3DScene.add(inline3DAmbientLight);
    inline3DDirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    inline3DDirLight.position.set(1, 2, 0.5);
    inline3DScene.add(inline3DDirLight);
    inline3DFillLight = new THREE.DirectionalLight(0xffffff, 0.25);
    inline3DFillLight.position.set(-1, -0.5, -0.5);
    inline3DFillLight.visible = false;
    inline3DScene.add(inline3DFillLight);

    inline3DGroup = new THREE.Group();
    inline3DScene.add(inline3DGroup);

    // OrbitControls (disabled by default)
    try {
        inline3DControls = new THREE.OrbitControls(inline3DCamera, inline3DRenderer.domElement);
        inline3DControls.enabled = false;
        inline3DControls.enableDamping = true;
        inline3DControls.dampingFactor = 0.1;
        inline3DControls.addEventListener('change', () => {
            renderInline3D();
            // Persist camera state so content updates preserve the user's view
            if (inline3DCamera) inline3DSavedCamPos = inline3DCamera.position.clone();
            if (inline3DControls) inline3DSavedCamTarget = inline3DControls.target.clone();
        });
    } catch(e) { console.warn('OrbitControls not available for inline 3D'); }

    // Render once
    renderInline3D();

    // Observe size changes
    if (window.ResizeObserver) {
        new ResizeObserver(() => {
            const newW = container.clientWidth;
            if (newW > 0 && inline3DRenderer) {
                inline3DRenderer.setSize(newW, VIEWER_HEIGHT);
                inline3DCamera.aspect = newW / VIEWER_HEIGHT;
                inline3DCamera.updateProjectionMatrix();
                renderInline3D();
                // No CSS transform applied — vertical offset handled in camera framing.
            }
        }).observe(container);
    }
}

function renderInline3D() {
    if (inline3DRenderer && inline3DScene && inline3DCamera) {
        inline3DRenderer.render(inline3DScene, inline3DCamera);
    }
}

function frameInline3DCamera() {
    if (!inline3DGroup || !inline3DCamera) return;

    // Reset any previous Y offset on the group temporarily so bounding box
    // calculations reflect the raw geometry positions.
    const prevGroupY = inline3DGroup.position.y || 0;
    inline3DGroup.position.y = 0;

    const box = new THREE.Box3().setFromObject(inline3DGroup);
    if (box.isEmpty()) {
        inline3DGroup.position.y = prevGroupY;
        return;
    }
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // Raise the look-at point slightly
    center.y += size.y * 0.1;
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim === 0 || !isFinite(maxDim)) {
        inline3DGroup.position.y = prevGroupY;
        return;
    }
    const fov = inline3DCamera.fov * Math.PI / 180;
    // Distance multiplier controls how 'zoomed' the model appears.
    // Increase multiplier to move camera farther away (less zoom).
    let dist = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.2;

    // Compute world-space vertical offset corresponding to the desired
    // pixel offset `inline3DVerticalOffset`. We'll APPLY this offset to
    // inline3DGroup.position.y so only the model moves inside the canvas
    // while the camera and background remain fixed.
    const worldHeightAtDist = 2 * dist * Math.tan(fov / 2);
    const pixelToWorld = worldHeightAtDist / INLINE_VIEWER_HEIGHT;
    const worldOffset = -inline3DVerticalOffset * pixelToWorld;

    // Compute view direction from azimuth/elevation (degrees -> radians)
    const az = (inline3DAzimuthDeg || -45) * Math.PI / 180;
    const el = (inline3DElevationDeg || 30) * Math.PI / 180;
    // Spherical to Cartesian: x = cos(el)*cos(az), y = sin(el), z = cos(el)*sin(az)
    const dir = new THREE.Vector3(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az)).normalize();
    const pos = center.clone().add(dir.multiplyScalar(dist));
    inline3DCamera.position.copy(pos);
    inline3DCamera.lookAt(center);
    if (inline3DControls) {
        inline3DControls.target.copy(center);
        // Disable damping during framing update to prevent drift
        var prevDamping = inline3DControls.enableDamping;
        inline3DControls.enableDamping = false;
        inline3DControls.update();
        inline3DControls.enableDamping = prevDamping;
    }
    // Save camera state AFTER controls.update() so the saved values
    // exactly match what the controls computed (no damping drift)
    inline3DSavedCamPos = inline3DCamera.position.clone();
    inline3DSavedCamTarget = center.clone();

    // Apply the computed world offset to the group so the model is visually
    // shifted inside the fixed canvas. This keeps the background/static
    // canvas positioning unaffected.
    inline3DGroup.position.y = worldOffset;
}

async function updateInline3D() {
    if (!inline3DGroup) return;
    // Build payload: assembled, pieces + optionally base
    const showBase = (document.getElementById('inline3d_show_base') || {}).checked || false;
    const mode = showBase ? 'both' : 'pieces';
    const payload = buildSTLPayload(mode);
    if (!payload) return;
    payload.assembled = true; // Inline viewer always shows assembled preview

    try {
        const response = await fetch('/api/export_stl_separate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!data.success) return;

        // Clear existing
        while (inline3DGroup.children.length) inline3DGroup.remove(inline3DGroup.children[0]);

        const loader = new THREE.STLLoader();
        const colors = getColorElements();
        const pieceColorEl = colors.pieces;
        const baseColorEl = colors.base;
        const reliefColorEl = colors.relief;
        const pieceColor = pieceColorEl ? pieceColorEl.value : '#6699CC';
        const baseColor = baseColorEl ? baseColorEl.value : '#808080';
        const reliefColor = reliefColorEl ? reliefColorEl.value : '#FF6633';

        const allMeshes = [];

        if (data.pieces) {
            const buf = Uint8Array.from(atob(data.pieces), c => c.charCodeAt(0)).buffer;
            const geom = loader.parse(buf);
            geom.computeVertexNormals();
            const mat = new THREE.MeshStandardMaterial({ color: pieceColor, roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            mesh.userData.role = 'pieces';
            allMeshes.push(mesh);
        }
        if (data.relief) {
            const buf = Uint8Array.from(atob(data.relief), c => c.charCodeAt(0)).buffer;
            const geom = loader.parse(buf);
            geom.computeVertexNormals();
            const mat = new THREE.MeshStandardMaterial({ color: reliefColor, roughness: 0.4, metalness: 0.15, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            mesh.userData.role = 'relief';
            allMeshes.push(mesh);
        }
        if (data.base) {
            const buf = Uint8Array.from(atob(data.base), c => c.charCodeAt(0)).buffer;
            const geom = loader.parse(buf);
            geom.computeVertexNormals();
            const mat = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            mesh.userData.role = 'base';
            allMeshes.push(mesh);
        }

        // If both pieces and base are present, translate pieces (and relief) to overlap base
        const baseMesh = allMeshes.find(m => m.userData.role === 'base');
        const pieceMesh = allMeshes.find(m => m.userData.role === 'pieces');
        const reliefMesh = allMeshes.find(m => m.userData.role === 'relief');

        if (pieceMesh && baseMesh) {
            const tempGrp = new THREE.Group();
            allMeshes.forEach(m => tempGrp.add(m));
            tempGrp.updateMatrixWorld(true);

            const isSlidingType = puzzleData && puzzleData.puzzleType === 'sliding';
            let dx = 0, dz = 0, pieceRaise = 0;

            if (!isSlidingType) {
                // For non-sliding: pieces are placed beside the base (galX offset),
                // so we need to align their XZ centers and raise them above the base plate.
                const pBox = new THREE.Box3().setFromObject(pieceMesh);
                const bBox = new THREE.Box3().setFromObject(baseMesh);
                const pCenter = pBox.getCenter(new THREE.Vector3());
                const bCenter = bBox.getCenter(new THREE.Vector3());

                dx = bCenter.x - pCenter.x;
                dz = bCenter.z - pCenter.z;
                pieceMesh.position.x += dx;
                pieceMesh.position.z += dz;

                const baseThickness = parseFloat((document.getElementById('stl_base_thickness') || {}).value || 1);
                const piecesBottom = pBox.min.y;
                pieceRaise = bBox.min.y + baseThickness - piecesBottom;
                pieceMesh.position.y += pieceRaise;
            }
            // For sliding puzzles: pieces are already inside the frame — no alignment needed.

            if (reliefMesh) {
                reliefMesh.position.x += dx;
                reliefMesh.position.z += dz;
                reliefMesh.position.y += pieceRaise;
            }

            allMeshes.forEach(m => { tempGrp.remove(m); inline3DGroup.add(m); });
        } else {
            allMeshes.forEach(m => inline3DGroup.add(m));
        }

        // Preserve camera on subsequent updates; only frame on first load
        if (!inline3DHasModel) {
            frameInline3DCamera();
            inline3DHasModel = true;
        } else {
            if (inline3DSavedCamPos && inline3DCamera) inline3DCamera.position.copy(inline3DSavedCamPos);
            if (inline3DSavedCamTarget && inline3DControls) {
                inline3DControls.target.copy(inline3DSavedCamTarget);
                // Disable damping for this update to prevent drift
                var prevDamping = inline3DControls.enableDamping;
                inline3DControls.enableDamping = false;
                inline3DControls.update();
                inline3DControls.enableDamping = prevDamping;
            }
        }
        renderInline3D();
    } catch (e) {
        console.warn('Inline 3D update failed:', e);
    }
}

function scheduleInline3DUpdate() {
    if (inline3DTimer) clearTimeout(inline3DTimer);
    inline3DTimer = setTimeout(updateInline3D, 400);
}

// Initialize inline 3D viewer
initInline3D();

// Wire inline3d_show_base toggle
const inline3dBaseCheck = document.getElementById('inline3d_show_base');
if (inline3dBaseCheck) {
    inline3dBaseCheck.addEventListener('change', scheduleInline3DUpdate);
}

// Wire refresh button — re-frame camera on manual refresh
const inline3dRefreshBtn = document.getElementById('inline3d_refresh');
if (inline3dRefreshBtn) {
    inline3dRefreshBtn.addEventListener('click', () => {
        inline3DHasModel = false; // force camera re-frame
        updateInline3D();
    });
}

// Wire inline3d_free_camera toggle
const inline3dFreeCam = document.getElementById('inline3d_free_camera');
if (inline3dFreeCam) {
    inline3dFreeCam.addEventListener('change', () => {
        if (!inline3DControls) return;
        if (inline3dFreeCam.checked) {
            inline3DControls.enabled = true;
        } else {
            inline3DControls.enabled = false;
            // Reset camera to saved position
            if (inline3DSavedCamPos && inline3DSavedCamTarget) {
                inline3DCamera.position.copy(inline3DSavedCamPos);
                inline3DCamera.lookAt(inline3DSavedCamTarget);
                inline3DControls.target.copy(inline3DSavedCamTarget);
                inline3DControls.update();
                renderInline3D();
            }
        }
    });
}

// ============================================================
// Wire up acabados inputs to re-render 2D viewer + inline 3D
// ============================================================
const acabadosInputsForViewer = [
    'stl_infill_type', 'stl_texture_type',
    'stl_cube_size', 'stl_border',
    'stl_image_direction', 'stl_texture_direction'
];
acabadosInputsForViewer.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('change', () => { render2DViewer(); updateDragHints(); scheduleInline3DUpdate(); });
    }
});

// All number/range inputs inside acabados
document.querySelectorAll('.acabados-sub-panel input[type="number"], .acabados-sub-panel input[type="range"]').forEach(el => {
    el.addEventListener('input', () => { render2DViewer(); scheduleInline3DUpdate(); scheduleViewerUpdate(); if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate(); });
    el.addEventListener('change', () => { scheduleInline3DUpdate(); scheduleViewerUpdate(); if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate(); });
});
document.querySelectorAll('.acabados-sub-panel input[type="checkbox"]').forEach(el => {
    el.addEventListener('change', () => { render2DViewer(); scheduleInline3DUpdate(); if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate(); });
});
// Infill/texture/image opts are outside .acabados-sub-panel — bind them separately
document.querySelectorAll('.infill-opts input, .texture-opts input, .image-opts input').forEach(el => {
    if (el.type === 'number' || el.type === 'range') {
        el.addEventListener('input', () => { render2DViewer(); scheduleInline3DUpdate(); scheduleViewerUpdate(); if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate(); });
        el.addEventListener('change', () => { scheduleInline3DUpdate(); scheduleViewerUpdate(); if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate(); });
    } else if (el.type === 'checkbox') {
        el.addEventListener('change', () => { render2DViewer(); scheduleInline3DUpdate(); if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate(); });
    }
});
// Also bind <select> elements in infill/texture/image opts
document.querySelectorAll('.infill-opts select, .texture-opts select, .image-opts select, .acabados-sub-panel select').forEach(el => {
    el.addEventListener('change', () => { render2DViewer(); scheduleInline3DUpdate(); scheduleViewerUpdate(); if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate(); });
});
// Re-render when mode changes
document.querySelectorAll('input[name="acabados_mode"]').forEach(r => {
    r.addEventListener('change', () => { render2DViewer(); scheduleInline3DUpdate(); if (typeof scheduleMiniViewerUpdate === 'function') scheduleMiniViewerUpdate(); });
});

// Gallery toggle — shows/hides entire puzzle + gallery + solutions section
const galleryToggle = document.getElementById('gallery_toggle');
if (galleryToggle) {
    galleryToggle.addEventListener('change', () => {
        const content = document.getElementById('puzzle-gallery-content');
        if (content) content.style.display = galleryToggle.checked ? '' : 'none';
    });
}

// ══════════════════════════════════════════════════════════════════════
// ██  Advanced 3D Configuration — Mini Viewers (stock puzzle preview)
// ══════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // Late-bound edge-overlay rebuild hook (set by the edge-highlight system below)
    let _edgeRebuildFn = null;
    // Debounce timer for edge rebuild triggered from Promise callbacks
    let _edgeRebuildTimer = null;

    // ╔══════════════════════════════════════════════════════════════╗
    // ║  MINI-VIEWER DEFAULTS — edit these to change default values  ║
    // ╚══════════════════════════════════════════════════════════════╝
    const MINI_VIEWER_DEFAULTS = {
        // Viewer container height (px). CSS min-height / max-height.
        viewerMinHeight: 180,
        viewerMaxHeight: 320,

        // ── Mini-viewer lighting (global fallback) ────────────────────────────
        // Main directional light — tilted from upper-right-front so side walls
        // at different heights catch different amounts of light, making Z-depth
        // clearly visible.
        ambientIntensity: 0.35,
        directionalIntensity: 1.1,
        lightPosX: 1,
        lightPosY: 2,
        lightPosZ: 0.5,
        // Fill light — secondary directional from lower-left-back, provides
        // soft counter-lighting so dark areas don't become pure black.
        fillLightIntensity: 0.2,
        fillLightPosX: -1,
        fillLightPosY: -0.5,
        fillLightPosZ: -0.5,

        // ── Per-section defaults ──────────────────────────────────────────────
        // Every property can differ per section:
        //   az, el, cornerFocus, distMultiplier,
        //   ambientIntensity, directionalIntensity, lightPosX/Y/Z,
        //   fillLightIntensity, fillLightPosX/Y/Z
        camera: {
            'piece-general': { az: -90, el: 60, cornerFocus: false, distMultiplier: 0.9,  ambientIntensity: 0.35, directionalIntensity: 1.1, lightPosX:  1, lightPosY: 2,    lightPosZ: 0.5,  fillLightIntensity: 0.2,  fillLightPosX: -1, fillLightPosY: -0.5, fillLightPosZ: -0.5 },
            'piece-edges':   { az: -37, el:  9, cornerFocus: true,  distMultiplier: 0.7,  ambientIntensity: 0.35, directionalIntensity: 1.1, lightPosX:  3, lightPosY: 2,    lightPosZ: 1,    fillLightIntensity: 0.2,  fillLightPosX: -1, fillLightPosY: -0.5, fillLightPosZ: -0.5 },
            'base-general':  { az: -90, el: 60, cornerFocus: false, distMultiplier: 0.9,  ambientIntensity: 0.35, directionalIntensity: 1.1, lightPosX:  1, lightPosY: 2,    lightPosZ: 0.5,  fillLightIntensity: 0.2,  fillLightPosX: -1, fillLightPosY: -0.5, fillLightPosZ: -0.5 },
            'base-edges':    { az: -39, el:  9, cornerFocus: true,  distMultiplier: 0.7,  ambientIntensity: 0.35, directionalIntensity: 1.1, lightPosX:  3, lightPosY: 2,    lightPosZ: 1,    fillLightIntensity: 0.2,  fillLightPosX: -1, fillLightPosY: -0.5, fillLightPosZ: -0.5 },

            // ── Per puzzle-type overrides ─────────────────────────────────────
            // Format: 'puzzleType:section', e.g. 'fractal:piece-general'
            // Only list properties that differ from the section default above.
            // 'normal:piece-general':  {},
            // 'fractal:piece-general': { az: -30, distMultiplier: 1.5 },
            // 'jigsaw:piece-edges':    { el: 12 },
            // 'sliding:base-edges':    { az: 20, el: 25 },

            'fractal:piece-general': { az: -90, el: 45, distMultiplier: 0.9 },
            'fractal:piece-edges':   { az: -90, el: 45, distMultiplier: 0.9, cornerFocus: false },
            'fractal:base-edges':    { az: -40, el: 7, distMultiplier: 0.7 },

            'sliding:piece-general': { distMultiplier: 1.2 },
            'sliding:piece-edges':   { az: -45, el: 11, distMultiplier: 0.8 },
            'sliding:base-general':  { az: -90, el: 18, distMultiplier: 0.9 },
            'sliding:base-edges':    { az: -45, el: 10, distMultiplier: 0.8 },

        },
        cameraDistMultiplier: 1.25, // global fallback (used if a camera entry omits distMultiplier)

        // ── Inline 3D viewer (acabados panel, top) ────────────────────────────
        // *** Easily configurable — change these to adjust lighting of the
        //     assembled preview shown in the acabados panel. ***
        inline3d: {
            ambientIntensity:    0.5,
            directionalIntensity: 1.0,
            lightPosX:  1,
            lightPosY:  2,
            lightPosZ:  0.5,
            fillLightIntensity: 0.25,
            fillLightPosX: -1,
            fillLightPosY: -0.5,
            fillLightPosZ: -0.5,
        },

        // ── Advanced / threeScene viewer (Puzzle y Piezas panel) ─────────────
        // *** Change these to adjust the main 3D STL preview viewer. ***
        advanced: {
            ambientIntensity:    0.4,
            directionalIntensity: 0.9,
            lightPosX:  1,
            lightPosY:  2,
            lightPosZ:  1,
            fillLightIntensity: 0.2,
            fillLightPosX: -1,
            fillLightPosY: -0.5,
            fillLightPosZ: -0.5,
        },

        // true = always use stock puzzle; false = use real generated puzzle
        useStockPuzzle: true,
    };

    // Live copy that debug panel modifies (starts as clone of defaults)
    const MVConfig = JSON.parse(JSON.stringify(MINI_VIEWER_DEFAULTS));

    // ─── Per-type defaults merge ──────────────────────────────────────
    // Returns merged config for a given section focus + current puzzle type.
    // Type-specific keys (e.g. 'fractal:piece-general') override section defaults.
    function mergedCamDefaults(focus, type) {
        const sectionCfg = MVConfig.camera[focus] || MVConfig.camera['piece-general'] || {};
        const typeCfg    = MVConfig.camera[(type || 'normal') + ':' + focus] || {};
        return Object.assign({}, sectionCfg, typeCfg);
    }

    // Re-applies per-type defaults to all live viewers when puzzle type changes.
    function applyPuzzleTypeDefaults(type) {
        for (const v of Object.values(viewers)) {
            const m = mergedCamDefaults(v.focus, type);
            v.viewerCfg.camAz                = m.az;
            v.viewerCfg.camEl                = m.el;
            v.viewerCfg.camFocusCorner       = m.cornerFocus || false;
            v.viewerCfg.camDistMultiplier    = m.distMultiplier          ?? MVConfig.cameraDistMultiplier;
            v.viewerCfg.ambientIntensity     = m.ambientIntensity        ?? MVConfig.ambientIntensity;
            v.viewerCfg.directionalIntensity = m.directionalIntensity    ?? MVConfig.directionalIntensity;
            v.viewerCfg.lightPosX            = m.lightPosX               ?? MVConfig.lightPosX;
            v.viewerCfg.lightPosY            = m.lightPosY               ?? MVConfig.lightPosY;
            v.viewerCfg.lightPosZ            = m.lightPosZ               ?? MVConfig.lightPosZ;
            v.viewerCfg.fillLightIntensity   = m.fillLightIntensity      ?? MVConfig.fillLightIntensity;
            v.viewerCfg.fillLightPosX        = m.fillLightPosX           ?? MVConfig.fillLightPosX;
            v.viewerCfg.fillLightPosY        = m.fillLightPosY           ?? MVConfig.fillLightPosY;
            v.viewerCfg.fillLightPosZ        = m.fillLightPosZ           ?? MVConfig.fillLightPosZ;
            if (v.ambientLight) v.ambientLight.intensity = v.viewerCfg.ambientIntensity;
            if (v.dirLight) {
                v.dirLight.intensity = v.viewerCfg.directionalIntensity;
                v.dirLight.position.set(v.viewerCfg.lightPosX, v.viewerCfg.lightPosY, v.viewerCfg.lightPosZ);
            }
            if (v.fillLight) {
                v.fillLight.intensity = v.viewerCfg.fillLightIntensity;
                v.fillLight.position.set(v.viewerCfg.fillLightPosX, v.viewerCfg.fillLightPosY, v.viewerCfg.fillLightPosZ);
            }
        }
    }

    // ─── Stock puzzle defaults per type ──────────────────────────────
    // *** EASILY CONFIGURABLE — change these to adjust the default
    //     preview geometry shown in the mini-viewers ***
    const STOCK_PUZZLES = {
        normal: {
            generator: () => fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ M: 2, N: 3, min_size: 2, max_size: 3 }) }).then(r => r.json()),
            puzzleType: 'normal',
        },
        fractal: {
            generator: () => fetch('/api/generate_fractal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ M: 3, N: 4, min_size: 2, max_size: 2 }) }).then(r => r.json()),
            puzzleType: 'fractal',
        },
        jigsaw: {
            generator: () => fetch('/api/generate_jigsaw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jigsaw_type: 'rectangular', rows: 2, cols: 3, tab_size: 20, jitter: 4 }) }).then(r => r.json()),
            puzzleType: 'jigsaw',
        },
        sliding: {
            generator: () => fetch('/api/generate_sliding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rows: 2, cols: 2, empty_corner: 'br' }) }).then(r => r.json()),
            puzzleType: 'sliding',
        },
    };

    // State
    const viewers = {};
    let stockState = null;   // { grid, pieces, puzzle_type, ... }
    let currentStockType = null;
    let miniViewerInited = false;
    let miniViewerTimer = null;

    // ─── Stock puzzle generation ─────────────────────────────────────

    function detectPuzzleType() {
        const slidingBtn = document.getElementById('btn-type-sliding');
        if (slidingBtn && slidingBtn.classList.contains('active')) return 'sliding';
        const jigsawBtn = document.getElementById('btn-type-jigsaw');
        if (jigsawBtn && jigsawBtn.classList.contains('active')) return 'jigsaw';
        const fractalBtn = document.getElementById('btn-type-fractal');
        if (fractalBtn && fractalBtn.classList.contains('active')) return 'fractal';
        return 'normal';
    }

    async function generateStockPuzzle(type) {
        type = type || detectPuzzleType();
        const cfg = STOCK_PUZZLES[type] || STOCK_PUZZLES.normal;
        try {
            const result = await cfg.generator();
            if (!result || !result.success) return null;
            const state = {
                grid: result.grid,
                pieces: result.pieces,
                puzzle_type: cfg.puzzleType,
                svg_paths: result.svg_paths || null,
                arcs_data: result.arcs_data || null,
                ncols: result.ncols || 0,
                nrows: result.nrows || 0,
                jigsaw_type: result.jigsaw_type || null,
                hex_radius: result.hex_radius || 0,
                hex_offset: result.hex_offset || 0,
                truncate_edge: result.truncate_edge || false,
                // Sliding-specific
                sliding_rows: result.rows || 0,
                sliding_cols: result.cols || 0,
                sliding_empty_row: result.empty_row,
                sliding_empty_col: result.empty_col,
            };
            currentStockType = type;
            stockState = state;
            return state;
        } catch (e) {
            console.warn('Stock puzzle generation failed:', e);
            return null;
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────

    function viewerMode(focus) {
        return focus.startsWith('base-') ? 'base' : 'pieces';
    }

    function getSceneBgColor() {
        const theme = document.documentElement.dataset.theme;
        return theme === 'light' ? 0xf0f0f0 : 0x181c24;
    }

    function isViewerVisible(id) {
        const el = document.getElementById(id);
        if (!el) return false;
        // Check if the viewer's section is visible (not hidden by sliding-only/non-sliding)
        const section = el.closest('.adv3d-section');
        if (section && section.style.display === 'none') return false;
        return true;
    }

    // ─── Three.js mini-viewer creation ───────────────────────────────

    function initMiniViewer(container) {
        if (!container || !window.THREE) return null;
        const id = container.id;
        const focus = container.dataset.focus || 'piece-general';

        // Per-viewer config — starts as a copy of the global defaults for this type
        const defaultCam = mergedCamDefaults(focus, detectPuzzleType());
        const viewerCfg = {
            ambientIntensity:      defaultCam.ambientIntensity      ?? MVConfig.ambientIntensity,
            directionalIntensity:  defaultCam.directionalIntensity  ?? MVConfig.directionalIntensity,
            lightPosX:             defaultCam.lightPosX             ?? MVConfig.lightPosX,
            lightPosY:             defaultCam.lightPosY             ?? MVConfig.lightPosY,
            lightPosZ:             defaultCam.lightPosZ             ?? MVConfig.lightPosZ,
            fillLightIntensity:    defaultCam.fillLightIntensity     ?? MVConfig.fillLightIntensity,
            fillLightPosX:         defaultCam.fillLightPosX          ?? MVConfig.fillLightPosX,
            fillLightPosY:         defaultCam.fillLightPosY          ?? MVConfig.fillLightPosY,
            fillLightPosZ:         defaultCam.fillLightPosZ          ?? MVConfig.fillLightPosZ,
            camAz:                 defaultCam.az,
            camEl:                 defaultCam.el,
            camDistMultiplier:     defaultCam.distMultiplier        ?? MVConfig.cameraDistMultiplier,
            camFocusCorner:        defaultCam.cornerFocus || false,
        };

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(getSceneBgColor());

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        const w = container.clientWidth || 300;
        const h = container.clientHeight || 225;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        // Make canvas absolutely positioned so its pixel dimensions don't
        // influence the container's layout height (avoids flex/grid conflicts)
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.inset = '0';
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, viewerCfg.ambientIntensity);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, viewerCfg.directionalIntensity);
        dirLight.position.set(viewerCfg.lightPosX, viewerCfg.lightPosY, viewerCfg.lightPosZ);
        scene.add(dirLight);
        const fillLight = new THREE.DirectionalLight(0xffffff, viewerCfg.fillLightIntensity);
        fillLight.position.set(viewerCfg.fillLightPosX, viewerCfg.fillLightPosY, viewerCfg.fillLightPosZ);
        fillLight.visible = false;
        scene.add(fillLight);

        const group = new THREE.Group();
        scene.add(group);

        let controls = null;
        try {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.1;
            // Mini-viewers are display-only — no mouse interaction
            controls.enableRotate = false;
            controls.enableZoom   = false;
            controls.enablePan    = false;
            controls.addEventListener('change', () => {
                renderer.render(scene, camera);
                const v = viewers[id];
                if (v) {
                    v.savedCamPos = camera.position.clone();
                    v.savedCamTarget = controls.target.clone();
                }
            });
        } catch(e) { /* OrbitControls unavailable */ }

        renderer.render(scene, camera);

        if (window.ResizeObserver) {
            new ResizeObserver(() => {
                const nw = container.clientWidth;
                const nh = container.clientHeight;
                if (nw > 0 && nh > 0 && renderer) {
                    renderer.setSize(nw, nh);
                    camera.aspect = nw / nh;
                    camera.updateProjectionMatrix();
                    renderer.render(scene, camera);
                }
            }).observe(container);
        }

        const viewer = {
            scene, camera, renderer, group, controls,
            focus, viewerCfg,
            ambientLight, dirLight, fillLight,
            hasModel: false,
            savedCamPos: null,
            savedCamTarget: null,
        };
        viewers[id] = viewer;
        return viewer;
    }

    function frameMiniCamera(v) {
        if (!v || !v.group || !v.camera) return;
        const box = new THREE.Box3().setFromObject(v.group);
        if (box.isEmpty()) return;
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        center.y += size.y * 0.05;
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim === 0 || !isFinite(maxDim)) return;
        const fov = v.camera.fov * Math.PI / 180;
        const vcfg = v.viewerCfg || {};
        let dist = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * (vcfg.camDistMultiplier || MVConfig.cameraDistMultiplier);

        const az = ((vcfg.camAz !== undefined ? vcfg.camAz : -45)) * Math.PI / 180;
        const el = ((vcfg.camEl !== undefined ? vcfg.camEl : 30)) * Math.PI / 180;
        const dir = new THREE.Vector3(
            Math.cos(el) * Math.cos(az),
            Math.sin(el),
            Math.cos(el) * Math.sin(az)
        ).normalize();
        const pos = center.clone().add(dir.multiplyScalar(dist));
        v.camera.position.copy(pos);

        // Choose look target: bounding-box center or nearest corner to camera
        let lookTarget = center;
        if (vcfg.camFocusCorner) {
            const b = box;
            const corners = [
                new THREE.Vector3(b.min.x, b.min.y, b.min.z),
                new THREE.Vector3(b.max.x, b.min.y, b.min.z),
                new THREE.Vector3(b.min.x, b.max.y, b.min.z),
                new THREE.Vector3(b.max.x, b.max.y, b.min.z),
                new THREE.Vector3(b.min.x, b.min.y, b.max.z),
                new THREE.Vector3(b.max.x, b.min.y, b.max.z),
                new THREE.Vector3(b.min.x, b.max.y, b.max.z),
                new THREE.Vector3(b.max.x, b.max.y, b.max.z),
            ];
            let bestCorner = center, bestDot = -Infinity;
            for (const c of corners) {
                const d = c.clone().sub(center).dot(dir);
                if (d > bestDot) { bestDot = d; bestCorner = c; }
            }
            lookTarget = bestCorner;
        }

        v.camera.lookAt(lookTarget);
        if (v.controls) {
            v.controls.target.copy(lookTarget);
            const prevD = v.controls.enableDamping;
            v.controls.enableDamping = false;
            v.controls.update();
            v.controls.enableDamping = prevD;
        }
        v.savedCamPos = v.camera.position.clone();
        v.savedCamTarget = lookTarget.clone();
    }

    // ─── Build opts from DOM (reads current settings) ────────────────

    function buildMiniOpts(mode) {
        // We call buildSTLPayload which reads all DOM inputs,
        // then override to use the stock puzzle type
        const payload = buildSTLPayload(mode);
        if (!payload) return null;
        payload.assembled = true;
        // Mini-viewers always show solid pieces — infill patterns, relief, texture
        // and image modes are only relevant for the final STL export, not the preview.
        payload.infill_type   = 'solid';
        payload.acabados_mode = 'infill';
        for (const key of Object.keys(payload)) {
            if (key.startsWith('texture_')) delete payload[key];
        }
        // For sliding stock puzzle, inject sliding-specific params from DOM
        if (stockState && stockState.puzzle_type === 'sliding') {
            payload.puzzle_type = 'sliding';
            payload.sliding_cell_size = parseFloat((document.getElementById('sliding_cell_size') || {}).value) || 20;
            payload.sliding_clearance = parseFloat((document.getElementById('sliding_clearance') || {}).value) || 0.3;
            payload.sliding_frame_border = parseFloat((document.getElementById('sliding_frame_border') || {}).value) || 4;
            payload.sliding_floor_height = parseFloat((document.getElementById('sliding_floor_height') || {}).value) || 1.0;
            payload.sliding_stem_height = parseFloat((document.getElementById('sliding_stem_height') || {}).value) || 2.0;
            payload.sliding_cap_height = parseFloat((document.getElementById('sliding_cap_height') || {}).value) || 2.0;
            payload.sliding_overhang = parseFloat((document.getElementById('sliding_overhang') || {}).value) || 1.5;
            payload.sliding_piece_height = parseFloat((document.getElementById('sliding_piece_height') || {}).value) || 8.0;
            payload.sliding_corner_style = (document.getElementById('sliding_corner_style') || {}).value || 'round';
            payload.sliding_corner_radius = parseFloat((document.getElementById('sliding_corner_radius') || {}).value) || 1.0;
            payload.sliding_shift_direction = (document.getElementById('sliding_shift_direction') || {}).value || 'br';
            payload.sliding_base_corner_style = (document.getElementById('sliding_base_corner_style') || {}).value || 'round';
            payload.sliding_base_corner_radius = parseFloat((document.getElementById('sliding_base_corner_radius') || {}).value) || 2.0;
            // Interior: "same as piece" checkbox
            const sBaseInnerSame = document.getElementById('sliding_base_inner_same_as_piece');
            if (sBaseInnerSame && sBaseInnerSame.checked) {
                payload.sliding_base_corner_style_inner = payload.sliding_corner_style;
                if (payload.sliding_corner_style !== 'sharp') {
                    payload.sliding_base_corner_radius_inner = payload.sliding_corner_radius;
                }
            } else {
                payload.sliding_base_corner_style_inner = (document.getElementById('sliding_base_corner_style_inner') || {}).value || 'round';
                payload.sliding_base_corner_radius_inner = parseFloat((document.getElementById('sliding_base_corner_radius_inner') || {}).value) || 1.0;
            }
            // Piece chamfer
            const sPChamfTopOn = document.getElementById('sliding_piece_chamfer_top_on');
            if (sPChamfTopOn && sPChamfTopOn.checked) {
                payload.piece_chamfer_top = parseFloat(document.getElementById('sliding_piece_chamfer_top').value) || 0.3;
            }
            const sPChamfBotOn = document.getElementById('sliding_piece_chamfer_bottom_on');
            if (sPChamfBotOn && sPChamfBotOn.checked) {
                payload.piece_chamfer_bottom = parseFloat(document.getElementById('sliding_piece_chamfer_bottom').value) || 0.3;
            }
            // Base chamfer
            const sBCTOOn = document.getElementById('sliding_base_chamfer_top_outer_on');
            if (sBCTOOn && sBCTOOn.checked) payload.base_chamfer_top_outer = parseFloat(document.getElementById('sliding_base_chamfer_top_outer').value) || 0.3;
            const sBCTIOn = document.getElementById('sliding_base_chamfer_top_inner_on');
            if (sBCTIOn && sBCTIOn.checked) payload.base_chamfer_top_inner = parseFloat(document.getElementById('sliding_base_chamfer_top_inner').value) || 0.3;
            const sBCBOOn = document.getElementById('sliding_base_chamfer_bottom_outer_on');
            if (sBCBOOn && sBCBOOn.checked) payload.base_chamfer_bottom_outer = parseFloat(document.getElementById('sliding_base_chamfer_bottom_outer').value) || 0.3;
            const sBCBIOn = document.getElementById('sliding_base_chamfer_bottom_inner_on');
            if (sBCBIOn && sBCBIOn.checked) payload.base_chamfer_bottom_inner = parseFloat(document.getElementById('sliding_base_chamfer_bottom_inner').value) || 0.3;
        }
        // Ensure puzzle_type matches the stock puzzle state (buildSTLPayload reads from
        // puzzleData which may be a different type than the stock puzzle being previewed)
        if (stockState) {
            payload.puzzle_type = stockState.puzzle_type;
        }
        return payload;
    }

    // ─── Render a single mini viewer ─────────────────────────────────

    async function getPuzzleStateForViewer() {
        // If using real puzzle and it exists, use it; otherwise fall back to stock
        if (!MVConfig.useStockPuzzle && window.puzzleData && window.puzzleData.grid) {
            return window.puzzleData;
        }
        // Ensure stock puzzle is generated for current type
        const pType = detectPuzzleType();
        if (!stockState || currentStockType !== pType) {
            await generateStockPuzzle(pType);
        }
        return stockState;
    }

    async function updateMiniViewer(id) {
        const v = viewers[id];
        if (!v) return;
        if (!isViewerVisible(id)) return;

        const puzzState = await getPuzzleStateForViewer();
        if (!puzzState) return;

        const mode = viewerMode(v.focus);
        const opts = buildMiniOpts(mode);
        if (!opts) return;

        try {
            // Call the Worker API with the stock puzzle state explicitly
            const response = await fetch('/api/export_stl_separate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.assign({}, opts, { puzzle_state: puzzState })),
            });
            const result = await response.json();
            if (!result.success) { console.warn('Mini viewer STL failed:', id, result.error); return; }

            // Clear existing meshes
            while (v.group.children.length) v.group.remove(v.group.children[0]);

            const loader = new THREE.STLLoader();
            const colors = getColorElements();
            const pieceColor = (colors.pieces || {}).value || '#00998A';
            const baseColor = (colors.base || {}).value || '#808080';
            const reliefColor = (colors.relief || {}).value || '#C1B399';

            function loadBase64(b64, color, role) {
                const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
                const geom = loader.parse(bytes.buffer);
                geom.computeVertexNormals();
                const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide });
                const mesh = new THREE.Mesh(geom, mat);
                mesh.rotation.set(-Math.PI / 2, 0, 0);
                mesh.userData.role = role;
                return mesh;
            }

            if (result.pieces) v.group.add(loadBase64(result.pieces, pieceColor, 'pieces'));
            if (result.relief) v.group.add(loadBase64(result.relief, reliefColor, 'relief'));
            if (result.base) v.group.add(loadBase64(result.base, baseColor, 'base'));

            if (!v.hasModel) {
                frameMiniCamera(v);
                v.hasModel = true;
            } else {
                if (v.savedCamPos) v.camera.position.copy(v.savedCamPos);
                if (v.savedCamTarget && v.controls) {
                    v.controls.target.copy(v.savedCamTarget);
                    const prevD = v.controls.enableDamping;
                    v.controls.enableDamping = false;
                    v.controls.update();
                    v.controls.enableDamping = prevD;
                }
            }
            v.renderer.render(v.scene, v.camera);
            if (_edgeRebuildFn) {
                if (_edgeRebuildTimer) clearTimeout(_edgeRebuildTimer);
                _edgeRebuildTimer = setTimeout(_edgeRebuildFn, 80);
            }
        } catch (e) {
            console.warn('Mini viewer update failed:', id, e);
        }
    }

    function updateAllMiniViewers() {
        const promises = [];
        for (const id of Object.keys(viewers)) {
            promises.push(updateMiniViewer(id));
        }
        return Promise.all(promises);
    }

    function scheduleMiniViewerUpdate() {
        const content = document.getElementById('adv3d-config-content');
        if (!content || content.style.display === 'none') return;
        if (miniViewerTimer) clearTimeout(miniViewerTimer);
        miniViewerTimer = setTimeout(async () => {
            await updateAllMiniViewers();
            // Resize viewers after they've been updated
            recalcMiniViewerSizes();
        }, 500);
    }

    async function initAllMiniViewers() {
        if (miniViewerInited) return;
        document.querySelectorAll('.mini-viewer-3d').forEach(container => {
            initMiniViewer(container);
        });
        miniViewerInited = true;
        // Generate initial stock puzzle and update
        await generateStockPuzzle();
        updateAllMiniViewers();
    }

    // Advanced 3D panel visibility is now controlled by wizard system
    // Mini-viewers are initialized when the wizard activates this step

    // Theme change → update scene backgrounds
    const themeBtn = document.querySelector('[data-theme-toggle]');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            setTimeout(() => {
                const bg = getSceneBgColor();
                for (const v of Object.values(viewers)) {
                    v.scene.background = new THREE.Color(bg);
                    v.renderer.render(v.scene, v.camera);
                }
            }, 50);
        });
    }

    // ─── Event wiring ────────────────────────────────────────────────

    const adv3dPanel = document.getElementById('advanced-3d-config-panel');
    if (adv3dPanel) {
        adv3dPanel.querySelectorAll('input[type="number"], input[type="range"]').forEach(el => {
            el.addEventListener('input', scheduleMiniViewerUpdate);
            el.addEventListener('change', scheduleMiniViewerUpdate);
        });
        adv3dPanel.querySelectorAll('input[type="checkbox"]').forEach(el => {
            el.addEventListener('change', scheduleMiniViewerUpdate);
        });
        adv3dPanel.querySelectorAll('select').forEach(el => {
            el.addEventListener('change', scheduleMiniViewerUpdate);
        });
        adv3dPanel.querySelectorAll('input[type="color"]').forEach(el => {
            el.addEventListener('input', scheduleMiniViewerUpdate);
            el.addEventListener('change', scheduleMiniViewerUpdate);
        });
    }

    // Force recalc of all mini-viewer canvas sizes (used when layout changes)
    function recalcMiniViewerSizes() {
        const doResize = () => {
            // Force a synchronous layout flush so clientWidth/clientHeight
            // reflect the current visibility state of all sections
            void document.body.offsetHeight;
            for (const [id, v] of Object.entries(viewers)) {
                if (!v || !v.renderer || !v.camera) continue;
                const container = document.getElementById(id);
                if (!container) continue;
                const w = container.clientWidth;
                const h = container.clientHeight;
                if (w > 0 && h > 0) {
                    v.renderer.setSize(w, h);
                    v.camera.aspect = w / h;
                    v.camera.updateProjectionMatrix();
                    v.renderer.render(v.scene, v.camera);
                }
            }
        };
        // Run immediately (display changes are already applied synchronously)
        doResize();
        // Follow-up to catch any remaining layout/transition settling
        setTimeout(doResize, 60);
    }

    // Puzzle type change → regenerate stock puzzle + update mini-viewers
    window.onPuzzleTypeChangeMiniViewers = async function (type) {
        if (currentStockType !== type) {
            await generateStockPuzzle(type);
            applyPuzzleTypeDefaults(type);
            // Reset hasModel so cameras re-frame for the new geometry
            for (const v of Object.values(viewers)) v.hasModel = false;
        }
        // scheduleMiniViewerUpdate() will handle both updating and resizing
        scheduleMiniViewerUpdate();
    };

    // Global hooks
    window.scheduleMiniViewerUpdate = scheduleMiniViewerUpdate;
    window.initAllMiniViewers = initAllMiniViewers;
    window.recalcMiniViewerSizes = recalcMiniViewerSizes;

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  DEBUG PANEL — Ctrl+Shift+F12 to toggle                     ║
    // ╚═══════════════════════════════════════════════════════════════╝

    function buildDebugPanel() {
        if (document.getElementById('mv-debug-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'mv-debug-panel';
        panel.innerHTML = `
<style>
#mv-debug-panel {
    position: fixed; top: 10px; right: 10px; z-index: 99999;
    width: 350px; max-height: 92vh; overflow-y: auto;
    background: #1a1d24; color: #d4d4d4; border: 1px solid #7cf2c9;
    border-radius: 10px; font-family: 'Space Grotesk', monospace; font-size: 12px;
    padding: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    display: none;
}
#mv-debug-panel.open { display: block; }
#mv-debug-panel .dbg-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 14px; border-bottom: 1px solid rgba(124,242,201,0.2);
    font-weight: 700; font-size: 13px; color: #7cf2c9;
    cursor: move; user-select: none; position: sticky; top: 0;
    background: #1a1d24; z-index: 1;
}
#mv-debug-panel .dbg-header button {
    background: none; border: none; color: #888; cursor: pointer; font-size: 16px; line-height: 1;
}
#mv-debug-panel .dbg-header button:hover { color: #fff; }
#mv-debug-panel .dbg-body { padding: 10px 14px 14px; }
#mv-debug-panel .dbg-section {
    margin-bottom: 12px; padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
}
#mv-debug-panel .dbg-section:last-child { border-bottom: none; margin-bottom: 0; }
#mv-debug-panel .dbg-section h4 {
    margin: 8px 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px;
    color: #7cf2c9; font-weight: 600;
}
#mv-debug-panel .dbg-section h4:first-child { margin-top: 0; }
#mv-debug-panel label {
    display: flex; align-items: center; gap: 8px; margin-bottom: 5px; font-size: 11px;
}
#mv-debug-panel label span.lbl { min-width: 110px; color: #aaa; }
#mv-debug-panel label span.val { min-width: 36px; text-align: right; color: #7cf2c9; font-weight: 600; }
#mv-debug-panel input[type="range"] { flex: 1; accent-color: #7cf2c9; height: 4px; }
#mv-debug-panel input[type="number"] {
    width: 56px; background: #12141a; border: 1px solid #333; color: #d4d4d4;
    border-radius: 4px; padding: 2px 4px; font-size: 11px; text-align: right;
}
#mv-debug-panel .dbg-toggle {
    display: flex; align-items: center; gap: 8px; margin-bottom: 5px;
}
#mv-debug-panel .dbg-toggle input[type="checkbox"] { accent-color: #7cf2c9; }
#mv-debug-panel select {
    background: #12141a; border: 1px solid #333; color: #d4d4d4;
    border-radius: 4px; padding: 2px 4px; font-size: 11px; flex: 1;
}
#mv-debug-panel .dbg-btn {
    display: inline-block; padding: 4px 10px; margin: 2px;
    background: rgba(124,242,201,0.1); border: 1px solid rgba(124,242,201,0.3);
    color: #7cf2c9; border-radius: 4px; cursor: pointer; font-size: 11px;
}
#mv-debug-panel .dbg-btn:hover { background: rgba(124,242,201,0.2); }
#mv-debug-panel .dbg-code {
    background: #12141a; border: 1px solid #333; border-radius: 4px;
    padding: 6px 8px; font-family: monospace; font-size: 10px;
    color: #aaa; white-space: pre-wrap; word-break: break-all;
    max-height: 140px; overflow-y: auto; margin-top: 6px;
}
#mv-debug-panel .dbg-viewer-badge {
    display: inline-block; background: rgba(124,242,201,0.12);
    border: 1px solid rgba(124,242,201,0.25); border-radius: 4px;
    padding: 2px 7px; font-size: 10px; color: #7cf2c9; margin-bottom: 8px;
}
</style>
<div class="dbg-header">
    <span>Mini-Viewer Debug</span>
    <button id="mv-dbg-close" title="Close">&times;</button>
</div>
<div class="dbg-body">
    <!-- GLOBAL -->
    <div class="dbg-section">
        <h4>Global</h4>
        <label><span class="lbl">Min Height (px)</span>
            <input type="range" id="mvd-minH" min="80" max="400" step="10" value="${MVConfig.viewerMinHeight}">
            <span class="val" id="mvd-minH-val">${MVConfig.viewerMinHeight}</span>
        </label>
        <label><span class="lbl">Max Height (px)</span>
            <input type="range" id="mvd-maxH" min="100" max="600" step="10" value="${MVConfig.viewerMaxHeight}">
            <span class="val" id="mvd-maxH-val">${MVConfig.viewerMaxHeight}</span>
        </label>
        <div class="dbg-toggle">
            <input type="checkbox" id="mvd-useStock" ${MVConfig.useStockPuzzle ? 'checked' : ''}>
            <span>Usar puzle stock (deseleccionar = usar el real generado)</span>
        </div>
    </div>
    <!-- PER-VIEWER -->
    <div class="dbg-section">
        <h4>Visor</h4>
        <label><span class="lbl">Seleccionar</span>
            <select id="mvd-viewer-sel">
                <option value="mini-viewer-piece-general">Mini – Piezas General</option>
                <option value="mini-viewer-piece-edges">Mini – Piezas Esquinas</option>
                <option value="mini-viewer-base-general">Mini – Base General</option>
                <option value="mini-viewer-base-edges">Mini – Base Esquinas</option>
                <option value="mini-viewer-sliding-piece-general">Mini – Sliding Piezas General</option>
                <option value="mini-viewer-sliding-piece-edges">Mini – Sliding Piezas Esquinas</option>
                <option value="mini-viewer-sliding-base-general">Mini – Sliding Base General</option>
                <option value="mini-viewer-sliding-base-edges">Mini – Sliding Base Esquinas</option>
                <option value="__inline3d">Visor Inline (acabados)</option>
                <option value="__advanced">Visor 3D Avanzado (principal)</option>
            </select>
        </label>
        <div id="mvd-viewer-status" class="dbg-viewer-badge">no inicializado</div>
        <h4>Cámara</h4>
        <label><span class="lbl">Azimuth (°)</span>
            <input type="range" id="mvd-camAz" min="-180" max="180" step="1" value="-45">
            <span class="val" id="mvd-camAz-val">-45</span>
        </label>
        <label><span class="lbl">Elevación (°)</span>
            <input type="range" id="mvd-camEl" min="-90" max="90" step="1" value="35">
            <span class="val" id="mvd-camEl-val">35</span>
        </label>
        <label><span class="lbl">Dist. multiplier</span>
            <input type="range" id="mvd-camDist" min="0.5" max="3" step="0.05" value="${MVConfig.cameraDistMultiplier}">
            <span class="val" id="mvd-camDist-val">${MVConfig.cameraDistMultiplier}</span>
        </label>
        <label style="display:flex;align-items:center;gap:6px;">
            <span class="lbl">Enfocar esquina</span>
            <input type="checkbox" id="mvd-cornerFocus">
        </label>
        <h4>Iluminación</h4>
        <label><span class="lbl">Ambient</span>
            <input type="range" id="mvd-ambInt" min="0" max="2" step="0.05" value="${MVConfig.ambientIntensity}">
            <span class="val" id="mvd-ambInt-val">${MVConfig.ambientIntensity}</span>
        </label>
        <label><span class="lbl">Directional</span>
            <input type="range" id="mvd-dirInt" min="0" max="3" step="0.05" value="${MVConfig.directionalIntensity}">
            <span class="val" id="mvd-dirInt-val">${MVConfig.directionalIntensity}</span>
        </label>
        <label><span class="lbl">Luz pos X</span>
            <input type="range" id="mvd-lpX" min="-3" max="3" step="0.1" value="${MVConfig.lightPosX}">
            <span class="val" id="mvd-lpX-val">${MVConfig.lightPosX}</span>
        </label>
        <label><span class="lbl">Luz pos Y</span>
            <input type="range" id="mvd-lpY" min="-3" max="3" step="0.1" value="${MVConfig.lightPosY}">
            <span class="val" id="mvd-lpY-val">${MVConfig.lightPosY}</span>
        </label>
        <label><span class="lbl">Luz pos Z</span>
            <input type="range" id="mvd-lpZ" min="-3" max="3" step="0.1" value="${MVConfig.lightPosZ}">
            <span class="val" id="mvd-lpZ-val">${MVConfig.lightPosZ}</span>
        </label>
        <h4>Luz Relleno (Fill)</h4>
        <div class="dbg-toggle">
            <input type="checkbox" id="mvd-fillOn">
            <span>Activar luz de relleno</span>
        </div>
        <label><span class="lbl">Fill intensidad</span>
            <input type="range" id="mvd-fillInt" min="0" max="2" step="0.05" value="${MVConfig.fillLightIntensity}">
            <span class="val" id="mvd-fillInt-val">${MVConfig.fillLightIntensity}</span>
        </label>
        <label><span class="lbl">Fill pos X</span>
            <input type="range" id="mvd-flX" min="-3" max="3" step="0.1" value="${MVConfig.fillLightPosX}">
            <span class="val" id="mvd-flX-val">${MVConfig.fillLightPosX}</span>
        </label>
        <label><span class="lbl">Fill pos Y</span>
            <input type="range" id="mvd-flY" min="-3" max="3" step="0.1" value="${MVConfig.fillLightPosY}">
            <span class="val" id="mvd-flY-val">${MVConfig.fillLightPosY}</span>
        </label>
        <label><span class="lbl">Fill pos Z</span>
            <input type="range" id="mvd-flZ" min="-3" max="3" step="0.1" value="${MVConfig.fillLightPosZ}">
            <span class="val" id="mvd-flZ-val">${MVConfig.fillLightPosZ}</span>
        </label>
        <h4>Edge Highlight (cantos)</h4>
        <div class="dbg-toggle">
            <input type="checkbox" id="mvd-edgeOn">
            <span>Activar highlight de bordes</span>
        </div>
        <div class="dbg-toggle">
            <input type="checkbox" id="mvd-edgeAutoColor">
            <span>Auto color (invertir color pieza)</span>
        </div>
        <label><span class="lbl">Color manual</span>
            <input type="color" id="mvd-edgeColor" value="#00ffcc" style="width:32px;height:20px;border:none;padding:0;background:none;">
        </label>
        <label><span class="lbl">Vel. pulso</span>
            <input type="range" id="mvd-edgeSpeed" min="0.5" max="8" step="0.5" value="2">
            <span class="val" id="mvd-edgeSpeed-val">2</span>
        </label>
        <label><span class="lbl">Opacidad mín</span>
            <input type="range" id="mvd-edgeMin" min="0" max="1" step="0.05" value="0.15">
            <span class="val" id="mvd-edgeMin-val">0.15</span>
        </label>
        <label><span class="lbl">Opacidad máx</span>
            <input type="range" id="mvd-edgeMax" min="0" max="1" step="0.05" value="0.85">
            <span class="val" id="mvd-edgeMax-val">0.85</span>
        </label>
        <label><span class="lbl">Grosor px</span>
            <input type="range" id="mvd-edgeWidth" min="1" max="10" step="0.5" value="1.5">
            <span class="val" id="mvd-edgeWidth-val">1.5</span>
        </label>
        <label><span class="lbl">Ángulo umbral (°)</span>
            <input type="range" id="mvd-edgeThresh" min="1" max="60" step="1" value="15">
            <span class="val" id="mvd-edgeThresh-val">15</span>
        </label>
        <div style="margin-top:4px;">
            <button class="dbg-btn" id="mvd-edgeLogCounts">Log edge counts</button>
        </div>
        <div style="margin-top:6px;">
            <button class="dbg-btn" id="mvd-reframe-one">Re-encuadrar este</button>
            <button class="dbg-btn" id="mvd-copy-all">Copiar a todos</button>
        </div>
    </div>
    <!-- ACCIONES -->
    <div class="dbg-section">
        <h4>Acciones</h4>
        <button class="dbg-btn" id="mvd-refresh-all">Regenerar todos</button>
        <button class="dbg-btn" id="mvd-reframe-all">Re-encuadrar todos</button>
        <button class="dbg-btn" id="mvd-dump">Dump config</button>
        <div class="dbg-code" id="mvd-dump-out" style="display:none;"></div>
    </div>
</div>`;
        document.body.appendChild(panel);

        // ─── Draggable header ────────────────────────────────────────
        const header = panel.querySelector('.dbg-header');
        let dragging = false, dx = 0, dy = 0;
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            dragging = true;
            dx = e.clientX - panel.offsetLeft;
            dy = e.clientY - panel.offsetTop;
        });
        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            panel.style.left = (e.clientX - dx) + 'px';
            panel.style.right = 'auto';
            panel.style.top = (e.clientY - dy) + 'px';
        });
        document.addEventListener('mouseup', () => { dragging = false; });

        document.getElementById('mv-dbg-close').addEventListener('click', () => {
            panel.classList.remove('open');
        });

        // ─── Helpers ─────────────────────────────────────────────────
        // Returns a unified viewer-like object for any viewer in the selector.
        // For __inline3d / __advanced we build a façade object with the same
        // shape as a mini-viewer so the slider code can work uniformly.
        function getSelectedViewer() {
            const id = document.getElementById('mvd-viewer-sel').value;
            if (id === '__inline3d') {
                if (!inline3DAmbientLight && !inline3DDirLight) return null;
                return {
                    _special: '__inline3d',
                    ambientLight: inline3DAmbientLight,
                    dirLight:     inline3DDirLight,
                    fillLight:    inline3DFillLight,
                    viewerCfg: {
                        camAz: inline3DAzimuthDeg,
                        camEl: inline3DElevationDeg || 30,
                        camDistMultiplier: 1.2,
                        camFocusCorner: false,
                        ambientIntensity:     inline3DAmbientLight ? inline3DAmbientLight.intensity : 0.5,
                        directionalIntensity: inline3DDirLight     ? inline3DDirLight.intensity     : 1.0,
                        lightPosX: inline3DDirLight ? inline3DDirLight.position.x : 1,
                        lightPosY: inline3DDirLight ? inline3DDirLight.position.y : 2,
                        lightPosZ: inline3DDirLight ? inline3DDirLight.position.z : 0.5,
                        fillLightIntensity: inline3DFillLight ? inline3DFillLight.intensity     : 0.25,
                        fillLightPosX:      inline3DFillLight ? inline3DFillLight.position.x : -1,
                        fillLightPosY:      inline3DFillLight ? inline3DFillLight.position.y : -0.5,
                        fillLightPosZ:      inline3DFillLight ? inline3DFillLight.position.z : -0.5,
                    },
                    renderer: { render: () => { if (inline3DRenderer && inline3DScene && inline3DCamera) inline3DRenderer.render(inline3DScene, inline3DCamera); } },
                };
            }
            if (id === '__advanced') {
                if (!threeAmbientLight && !threeDirLight) return null;
                return {
                    _special: '__advanced',
                    ambientLight: threeAmbientLight,
                    dirLight:     threeDirLight,
                    fillLight:    threeFillLight,
                    viewerCfg: {
                        camAz: -45, camEl: 30, camDistMultiplier: 1.2, camFocusCorner: false,
                        ambientIntensity:     threeAmbientLight ? threeAmbientLight.intensity : 0.4,
                        directionalIntensity: threeDirLight     ? threeDirLight.intensity     : 0.9,
                        lightPosX: threeDirLight ? threeDirLight.position.x : 1,
                        lightPosY: threeDirLight ? threeDirLight.position.y : 2,
                        lightPosZ: threeDirLight ? threeDirLight.position.z : 1,
                        fillLightIntensity: threeFillLight ? threeFillLight.intensity     : 0.2,
                        fillLightPosX:      threeFillLight ? threeFillLight.position.x : -1,
                        fillLightPosY:      threeFillLight ? threeFillLight.position.y : -0.5,
                        fillLightPosZ:      threeFillLight ? threeFillLight.position.z : -0.5,
                    },
                    renderer: { render: () => { if (threeRenderer && threeScene && threeCamera) threeRenderer.render(threeScene, threeCamera); } },
                };
            }
            return viewers[id] || null;
        }

        // Load a viewer's config into all the sliders
        function loadViewerConfig(vid) {
            const v = getSelectedViewer();
            const badge = document.getElementById('mvd-viewer-status');
            if (!v) {
                badge.textContent = 'no inicializado (defaults)';
                badge.style.color = '#888';
                return;
            }
            const isSpecial = v._special;
            badge.textContent = isSpecial ? vid.replace('__', '') : `focus: ${v.focus}`;
            badge.style.color = '#7cf2c9';
            const cfg = v.viewerCfg;
            const set = (id, valId, val) => {
                const inp = document.getElementById(id);
                const lbl = document.getElementById(valId);
                if (inp) inp.value = val;
                if (lbl) lbl.textContent = typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(2)) : val;
            };
            set('mvd-camAz',    'mvd-camAz-val',   cfg.camAz);
            set('mvd-camEl',    'mvd-camEl-val',   cfg.camEl);
            set('mvd-camDist',  'mvd-camDist-val', cfg.camDistMultiplier);
            const cornerCb = document.getElementById('mvd-cornerFocus');
            if (cornerCb) cornerCb.checked = cfg.camFocusCorner || false;
            set('mvd-ambInt',   'mvd-ambInt-val',  cfg.ambientIntensity);
            set('mvd-dirInt',   'mvd-dirInt-val',  cfg.directionalIntensity);
            set('mvd-lpX',      'mvd-lpX-val',     cfg.lightPosX);
            set('mvd-lpY',      'mvd-lpY-val',     cfg.lightPosY);
            set('mvd-lpZ',      'mvd-lpZ-val',     cfg.lightPosZ);
            set('mvd-fillInt',  'mvd-fillInt-val', cfg.fillLightIntensity ?? 0.2);
            set('mvd-flX',      'mvd-flX-val',     cfg.fillLightPosX ?? -1);
            set('mvd-flY',      'mvd-flY-val',     cfg.fillLightPosY ?? -0.5);
            set('mvd-flZ',      'mvd-flZ-val',     cfg.fillLightPosZ ?? -0.5);
            // Fill light toggle: reflect current visibility
            const fillToggle = document.getElementById('mvd-fillOn');
            if (fillToggle && v.fillLight) fillToggle.checked = v.fillLight.visible;
        }

        // Viewer selector change
        document.getElementById('mvd-viewer-sel').addEventListener('change', (e) => {
            loadViewerConfig(e.target.value);
        });
        // Initialize with first viewer
        loadViewerConfig(document.getElementById('mvd-viewer-sel').value);

        // Initialize edge highlight controls to reflect current state
        const edgeOnEl = document.getElementById('mvd-edgeOn');
        const edgeAutoEl = document.getElementById('mvd-edgeAutoColor');
        const edgeColorEl = document.getElementById('mvd-edgeColor');
        const edgeSpeedEl = document.getElementById('mvd-edgeSpeed');
        const edgeMinEl = document.getElementById('mvd-edgeMin');
        const edgeMaxEl = document.getElementById('mvd-edgeMax');
        const edgeWidthEl = document.getElementById('mvd-edgeWidth');
        const edgeThreshEl = document.getElementById('mvd-edgeThresh');
        if (edgeOnEl) edgeOnEl.checked = !!edgeHL.enabled;
        if (edgeAutoEl) edgeAutoEl.checked = !!edgeHL.autoColor;
        if (edgeColorEl) edgeColorEl.value = '#' + edgeHL.color.getHexString();
        if (edgeSpeedEl) { edgeSpeedEl.value = edgeHL.speed; document.getElementById('mvd-edgeSpeed-val').textContent = edgeHL.speed; }
        if (edgeMinEl)  { edgeMinEl.value  = edgeHL.opMin;  document.getElementById('mvd-edgeMin-val').textContent  = edgeHL.opMin.toFixed(2); }
        if (edgeMaxEl)  { edgeMaxEl.value  = edgeHL.opMax;  document.getElementById('mvd-edgeMax-val').textContent  = edgeHL.opMax.toFixed(2); }
        if (edgeWidthEl) { edgeWidthEl.value = edgeHL.lineWidth; document.getElementById('mvd-edgeWidth-val').textContent = edgeHL.lineWidth; }
        if (edgeThreshEl) { edgeThreshEl.value = edgeHL.thresholdAngle; document.getElementById('mvd-edgeThresh-val').textContent = edgeHL.thresholdAngle; }
        if (edgeAutoEl && edgeColorEl) edgeColorEl.disabled = !!edgeHL.autoColor;

        // ─── Global: height sliders ───────────────────────────────────
        document.getElementById('mvd-minH').addEventListener('input', function() {
            const val = parseInt(this.value);
            document.getElementById('mvd-minH-val').textContent = val;
            MVConfig.viewerMinHeight = val;
            document.querySelectorAll('.mini-viewer-3d').forEach(el => el.style.minHeight = val + 'px');
        });
        document.getElementById('mvd-maxH').addEventListener('input', function() {
            const val = parseInt(this.value);
            document.getElementById('mvd-maxH-val').textContent = val;
            MVConfig.viewerMaxHeight = val;
            document.querySelectorAll('.mini-viewer-3d').forEach(el => el.style.maxHeight = val + 'px');
        });
        document.getElementById('mvd-useStock').addEventListener('change', (e) => {
            MVConfig.useStockPuzzle = e.target.checked;
        });

        // ─── Per-viewer: camera ───────────────────────────────────────
        document.getElementById('mvd-camAz').addEventListener('input', function() {
            const val = parseInt(this.value);
            document.getElementById('mvd-camAz-val').textContent = val;
            const v = getSelectedViewer();
            if (!v) return;
            v.viewerCfg.camAz = val;
            frameMiniCamera(v);
            v.renderer.render(v.scene, v.camera);
        });
        document.getElementById('mvd-camEl').addEventListener('input', function() {
            const val = parseInt(this.value);
            document.getElementById('mvd-camEl-val').textContent = val;
            const v = getSelectedViewer();
            if (!v) return;
            v.viewerCfg.camEl = val;
            frameMiniCamera(v);
            v.renderer.render(v.scene, v.camera);
        });
        document.getElementById('mvd-camDist').addEventListener('input', function() {
            const val = parseFloat(this.value);
            document.getElementById('mvd-camDist-val').textContent = val.toFixed(2);
            const v = getSelectedViewer();
            if (!v) return;
            v.viewerCfg.camDistMultiplier = val;
            frameMiniCamera(v);
            v.renderer.render(v.scene, v.camera);
        });
        document.getElementById('mvd-cornerFocus').addEventListener('change', function() {
            const v = getSelectedViewer();
            if (!v) return;
            v.viewerCfg.camFocusCorner = this.checked;
            frameMiniCamera(v);
            v.renderer.render(v.scene, v.camera);
        });

        // ─── Per-viewer: lighting ─────────────────────────────────────
        function wireLighting(id, valId, applyFn) {
            document.getElementById(id).addEventListener('input', function() {
                const val = parseFloat(this.value);
                document.getElementById(valId).textContent = val.toFixed(2);
                const v = getSelectedViewer();
                if (!v) return;
                applyFn(v, val);
                v.renderer.render(v.scene, v.camera);
            });
        }
        wireLighting('mvd-ambInt', 'mvd-ambInt-val', (v, val) => {
            v.viewerCfg.ambientIntensity = val;
            if (v.ambientLight) v.ambientLight.intensity = val;
        });
        wireLighting('mvd-dirInt', 'mvd-dirInt-val', (v, val) => {
            v.viewerCfg.directionalIntensity = val;
            if (v.dirLight) v.dirLight.intensity = val;
        });
        wireLighting('mvd-lpX', 'mvd-lpX-val', (v, val) => {
            v.viewerCfg.lightPosX = val;
            if (v.dirLight) v.dirLight.position.setX(val);
        });
        wireLighting('mvd-lpY', 'mvd-lpY-val', (v, val) => {
            v.viewerCfg.lightPosY = val;
            if (v.dirLight) v.dirLight.position.setY(val);
        });
        wireLighting('mvd-lpZ', 'mvd-lpZ-val', (v, val) => {
            v.viewerCfg.lightPosZ = val;
            if (v.dirLight) v.dirLight.position.setZ(val);
        });

        // Fill light
        wireLighting('mvd-fillInt', 'mvd-fillInt-val', (v, val) => {
            v.viewerCfg.fillLightIntensity = val;
            if (v.fillLight) v.fillLight.intensity = val;
        });
        wireLighting('mvd-flX', 'mvd-flX-val', (v, val) => {
            v.viewerCfg.fillLightPosX = val;
            if (v.fillLight) v.fillLight.position.setX(val);
        });
        wireLighting('mvd-flY', 'mvd-flY-val', (v, val) => {
            v.viewerCfg.fillLightPosY = val;
            if (v.fillLight) v.fillLight.position.setY(val);
        });
        wireLighting('mvd-flZ', 'mvd-flZ-val', (v, val) => {
            v.viewerCfg.fillLightPosZ = val;
            if (v.fillLight) v.fillLight.position.setZ(val);
        });

        // Fill light on/off toggle
        document.getElementById('mvd-fillOn').addEventListener('change', function() {
            const v = getSelectedViewer();
            if (!v) return;
            if (v.fillLight) {
                v.fillLight.visible = this.checked;
                v.renderer.render(v.scene, v.camera);
            }
        });

        // ─── Edge Highlight controls ──────────────────────────────────
        document.getElementById('mvd-edgeOn').addEventListener('change', function() {
            edgeHL.enabled = this.checked;
            if (this.checked) {
                stopEdgeAnimation();
                applyEdgeHighlightToAll();
                startEdgeAnimation();
            } else {
                stopEdgeAnimation();
                removeAllEdgeOverlays();
                // Re-render all viewers to clear the overlay
                for (const v of Object.values(viewers)) {
                    try { if (v.renderer) v.renderer.render(v.scene, v.camera); } catch(e) {}
                }
            }
        });
        document.getElementById('mvd-edgeAutoColor').addEventListener('change', function() {
            edgeHL.autoColor = this.checked;
            document.getElementById('mvd-edgeColor').disabled = this.checked;
            if (edgeHL.enabled) rebuildEdgeOverlays();
        });
        document.getElementById('mvd-edgeColor').addEventListener('input', function() {
            updateEdgeColor(this.value);
        });
        document.getElementById('mvd-edgeSpeed').addEventListener('input', function() {
            const val = parseFloat(this.value);
            document.getElementById('mvd-edgeSpeed-val').textContent = val;
            edgeHL.speed = val;
        });
        document.getElementById('mvd-edgeMin').addEventListener('input', function() {
            const val = parseFloat(this.value);
            document.getElementById('mvd-edgeMin-val').textContent = val.toFixed(2);
            edgeHL.opMin = val;
        });
        document.getElementById('mvd-edgeMax').addEventListener('input', function() {
            const val = parseFloat(this.value);
            document.getElementById('mvd-edgeMax-val').textContent = val.toFixed(2);
            edgeHL.opMax = val;
        });
        document.getElementById('mvd-edgeWidth').addEventListener('input', function() {
            const val = parseFloat(this.value);
            document.getElementById('mvd-edgeWidth-val').textContent = val;
            edgeHL.lineWidth = val;
            // LineMaterial supports live linewidth update; rebuild for LineSegments fallback
            for (const ov of Object.values(edgeOverlays)) {
                for (const line of ov.lines) {
                    line.material.linewidth = val;
                    line.material.needsUpdate = true;
                }
            }
        });
        document.getElementById('mvd-edgeThresh').addEventListener('input', function() {
            const val = parseInt(this.value);
            document.getElementById('mvd-edgeThresh-val').textContent = val;
            edgeHL.thresholdAngle = val;
            rebuildEdgeOverlays();
        });
        document.getElementById('mvd-edgeLogCounts').addEventListener('click', () => {
            for (const [id, v] of Object.entries(viewers)) {
                if (!v.group) continue;
                const meshes = collectMeshes(v.group);
                console.log(`[EdgeDebug] viewer=${id} focus=${v.focus||'?'}`);
                meshes.forEach(m => {
                    const geo = m.geometry;
                    const posAttr = geo.getAttribute('position');
                    const idxAttr = geo.index;
                    const triCount = idxAttr ? idxAttr.count/3 : posAttr.count/3;
                    console.log(`  mesh role=${m.userData.role||'?'} tris=${triCount} verts=${posAttr.count} name=${m.name||'—'}`);
                });
                const ov = edgeOverlays[id];
                if (ov) console.log(`  overlay lines=${ov.lines.length}`);
                else    console.log(`  NO overlay`);
            }
        });
        document.getElementById('mvd-reframe-one').addEventListener('click', () => {
            const v = getSelectedViewer();
            if (!v) return;
            v.hasModel = false;
            frameMiniCamera(v);
            v.renderer.render(v.scene, v.camera);
        });
        document.getElementById('mvd-copy-all').addEventListener('click', () => {
            const srcId = document.getElementById('mvd-viewer-sel').value;
            const src = viewers[srcId];
            if (!src) return;
            const srcCfg = src.viewerCfg;
            for (const v of Object.values(viewers)) {
                if (v === src) continue;
                Object.assign(v.viewerCfg, {
                    ambientIntensity:     srcCfg.ambientIntensity,
                    directionalIntensity: srcCfg.directionalIntensity,
                    lightPosX:            srcCfg.lightPosX,
                    lightPosY:            srcCfg.lightPosY,
                    lightPosZ:            srcCfg.lightPosZ,
                    camDistMultiplier:    srcCfg.camDistMultiplier,
                    // Note: camAz / camEl intentionally NOT copied —
                    // each viewer has different framing angles.
                });
                if (v.ambientLight) v.ambientLight.intensity = srcCfg.ambientIntensity;
                if (v.dirLight) {
                    v.dirLight.intensity = srcCfg.directionalIntensity;
                    v.dirLight.position.set(srcCfg.lightPosX, srcCfg.lightPosY, srcCfg.lightPosZ);
                }
                v.renderer.render(v.scene, v.camera);
            }
        });

        // ─── Global action buttons ─────────────────────────────────────
        document.getElementById('mvd-refresh-all').addEventListener('click', () => {
            for (const v of Object.values(viewers)) v.hasModel = false;
            updateAllMiniViewers();
        });
        document.getElementById('mvd-reframe-all').addEventListener('click', () => {
            for (const v of Object.values(viewers)) {
                v.hasModel = false;
                frameMiniCamera(v);
                v.renderer.render(v.scene, v.camera);
            }
        });
        document.getElementById('mvd-dump').addEventListener('click', () => {
            const out = document.getElementById('mvd-dump-out');
            out.style.display = out.style.display === 'none' ? 'block' : 'none';
            // Build dump: global + per-viewer configs
            const perViewer = {};
            for (const [id, v] of Object.entries(viewers)) {
                perViewer[id] = Object.assign({}, v.viewerCfg);
            }
            const dump = {
                _global: {
                    viewerMinHeight:      MVConfig.viewerMinHeight,
                    viewerMaxHeight:      MVConfig.viewerMaxHeight,
                    useStockPuzzle:       MVConfig.useStockPuzzle,
                    cameraDistMultiplier: MVConfig.cameraDistMultiplier,
                    ambientIntensity:     MVConfig.ambientIntensity,
                    directionalIntensity: MVConfig.directionalIntensity,
                    lightPosX: MVConfig.lightPosX,
                    lightPosY: MVConfig.lightPosY,
                    lightPosZ: MVConfig.lightPosZ,
                    fillLightIntensity:   MVConfig.fillLightIntensity,
                    fillLightPosX: MVConfig.fillLightPosX,
                    fillLightPosY: MVConfig.fillLightPosY,
                    fillLightPosZ: MVConfig.fillLightPosZ,
                    camera: MVConfig.camera,
                    inline3d: MVConfig.inline3d,
                    advanced: MVConfig.advanced,
                },
                perViewer,
            };
            out.textContent = JSON.stringify(dump, null, 2);
        });
    }

    function applyDebugConfig() {
        // Height: global override
        document.querySelectorAll('.mini-viewer-3d').forEach(el => {
            el.style.minHeight = MVConfig.viewerMinHeight + 'px';
            el.style.maxHeight = MVConfig.viewerMaxHeight + 'px';
        });
        // Trigger full STL re-generate for all
        for (const v of Object.values(viewers)) v.hasModel = false;
        updateAllMiniViewers();
    }

    function toggleDebugPanel() {
        buildDebugPanel();
        const panel = document.getElementById('mv-debug-panel');
        if (panel) {
            panel.classList.toggle('open');
            // Refresh viewer selector display when opening
            if (panel.classList.contains('open')) {
                const sel = document.getElementById('mvd-viewer-sel');
                if (sel) {
                    // Re-load current viewer's config in case viewers were inited after panel was built
                    const fn = document.getElementById;
                    const vid = sel.value;
                    const v = viewers[vid];
                    if (v) {
                        const badge = document.getElementById('mvd-viewer-status');
                        if (badge) {
                            badge.textContent = `focus: ${v.focus}`;
                            badge.style.color = '#7cf2c9';
                        }
                        // Re-load slider values
                        const cfg = v.viewerCfg;
                        const fields = [
                            ['mvd-camAz',   'mvd-camAz-val',   cfg.camAz],
                            ['mvd-camEl',   'mvd-camEl-val',   cfg.camEl],
                            ['mvd-camDist', 'mvd-camDist-val', cfg.camDistMultiplier],
                            ['mvd-ambInt',  'mvd-ambInt-val',  cfg.ambientIntensity],
                            ['mvd-dirInt',  'mvd-dirInt-val',  cfg.directionalIntensity],
                            ['mvd-lpX',     'mvd-lpX-val',     cfg.lightPosX],
                            ['mvd-lpY',     'mvd-lpY-val',     cfg.lightPosY],
                            ['mvd-lpZ',     'mvd-lpZ-val',     cfg.lightPosZ],
                            ['mvd-fillInt', 'mvd-fillInt-val', cfg.fillLightIntensity ?? 0.2],
                            ['mvd-flX',     'mvd-flX-val',     cfg.fillLightPosX ?? -1],
                            ['mvd-flY',     'mvd-flY-val',     cfg.fillLightPosY ?? -0.5],
                            ['mvd-flZ',     'mvd-flZ-val',     cfg.fillLightPosZ ?? -0.5],
                        ];
                        fields.forEach(([inp, lbl, val]) => {
                            const i = document.getElementById(inp);
                            const l = document.getElementById(lbl);
                            if (i) i.value = val;
                            if (l) l.textContent = typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(2)) : val;
                        });
                    }
                }
            }
        }
    }

    // Keyboard shortcut: Ctrl+Shift+F12
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'F12') {
            e.preventDefault();
            toggleDebugPanel();
        }
    });

    window.toggleMiniViewerDebug = toggleDebugPanel;

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  EDGE HIGHLIGHT — pulsing edge overlay on 3D viewers        ║
    // ╚═══════════════════════════════════════════════════════════════╝

    // Shared state for edge highlighting
    const edgeHL = {
        enabled: true,
        autoColor: true,      // derive edge color from piece material (inverted hue)
        color: new THREE.Color(0x00ffcc),
        speed: 1,          // oscillation speed (radians/sec multiplier)
        opMin: 0.10,       // min opacity during pulse
        opMax: 0.90,       // max opacity during pulse
        lineWidth: 4.0,    // linewidth in CSS pixels (Line2) or 1px fallback
        thresholdAngle: 5, // EdgesGeometry threshold in degrees
        animId: null,      // rAF id
    };

    // Per-viewer edge overlay storage: viewerId → { lines: [LineSegments], group: Group }
    const edgeOverlays = {};

    // Traverse a Three.js group and return all Mesh children
    function collectMeshes(root) {
        const meshes = [];
        root.traverse(child => { if (child.isMesh) meshes.push(child); });
        return meshes;
    }

    // Returns a vibrant color complementary (hue +180°) to the mesh material's color.
    // Falls back to the manual edgeHL.color when autoColor is off.
    function getEdgeColor(material) {
        if (!edgeHL.autoColor) return edgeHL.color.clone();
        const base = (material && material.color) ? material.color : new THREE.Color(0x888888);
        const hsl = {};
        base.getHSL(hsl);
        return new THREE.Color().setHSL((hsl.h + 0.5) % 1, Math.max(hsl.s, 0.7), 0.6);
    }

    // Build edge overlay for a single viewer-like object (mini-viewer or façade).
    // Uses Line2 (fat lines) when available, falls back to LineSegments.
    // Only OUTER-FACING sharp edges are highlighted. The filter works by computing
    // face normals per triangle and checking if they point AWAY from the mesh bbox
    // centre. Inner cavity walls (hollow/grid infill) have normals pointing INWARD
    // Build edge overlay for a single viewer. Since mini-viewers always render
    // solid pieces, we can use THREE.EdgesGeometry directly — no filtering needed.
    function buildEdgeOverlay(viewerObj, viewerId) {
        removeEdgeOverlay(viewerId);
        const group    = viewerObj.group;
        const scene    = viewerObj.scene;
        const renderer = viewerObj.renderer || null;
        if (!group || !scene) return;

        // ── Role filter ─────────────────────────────────────────────────────────
        const focus = viewerObj.focus || '';
        let roleFilter = null;
        if (/piece-edges/.test(focus)) roleFilter = 'pieces';
        else if (/base-edges/.test(focus)) roleFilter = 'base';

        let meshes = collectMeshes(group);
        if (roleFilter) meshes = meshes.filter(m => m.userData.role === roleFilter);
        if (!meshes.length) return;

        const useLine2 = !!(THREE.LineSegmentsGeometry && THREE.LineMaterial && THREE.LineSegments2);
        const canvasW  = renderer ? renderer.domElement.width  : 400;
        const canvasH  = renderer ? renderer.domElement.height : 400;

        const edgeGroup = new THREE.Group();
        edgeGroup.name  = '__edgeHighlight';
        const lines     = [];
        const tmpVec    = new THREE.Vector3();

        for (const mesh of meshes) {
            const edgeGeo   = new THREE.EdgesGeometry(mesh.geometry, edgeHL.thresholdAngle);
            const lineColor = getEdgeColor(mesh.material);
            const posAttr   = edgeGeo.getAttribute('position');

            mesh.updateWorldMatrix(true, false);

            // EdgesGeometry gives pairs: [v0, v1, v0', v1', …]; convert to world space
            const worldPositions = [];
            for (let i = 0; i < posAttr.count; i++) {
                tmpVec.fromBufferAttribute(posAttr, i).applyMatrix4(mesh.matrixWorld);
                worldPositions.push(tmpVec.x, tmpVec.y, tmpVec.z);
            }
            edgeGeo.dispose();
            if (worldPositions.length === 0) continue;

            let line;
            if (useLine2) {
                const lg = new THREE.LineSegmentsGeometry();
                lg.setPositions(worldPositions);
                const mat = new THREE.LineMaterial({
                    color:       lineColor.getHex(),
                    linewidth:   edgeHL.lineWidth,
                    transparent: true,
                    opacity:     edgeHL.opMax,
                    depthTest:   true,
                    resolution:  new THREE.Vector2(canvasW, canvasH),
                });
                line = new THREE.LineSegments2(lg, mat);
            } else {
                const geo = new THREE.BufferGeometry();
                geo.setAttribute('position', new THREE.Float32BufferAttribute(worldPositions, 3));
                const mat = new THREE.LineBasicMaterial({
                    color:       lineColor,
                    transparent: true,
                    opacity:     edgeHL.opMax,
                    depthTest:   true,
                });
                line = new THREE.LineSegments(geo, mat);
            }

            edgeGroup.add(line);
            lines.push(line);
        }

        if (lines.length === 0) return;
        scene.add(edgeGroup);
        const camera = viewerObj.camera || null;
        edgeOverlays[viewerId] = { lines, edgeGroup, scene, renderer, camera };
    }

    function removeEdgeOverlay(viewerId) {
        const ov = edgeOverlays[viewerId];
        if (!ov) return;
        if (ov.scene && ov.edgeGroup) {
            ov.scene.remove(ov.edgeGroup);
        }
        // Dispose geometries and materials
        for (const line of ov.lines) {
            if (line.geometry) line.geometry.dispose();
            if (line.material) line.material.dispose();
        }
        delete edgeOverlays[viewerId];
    }

    function removeAllEdgeOverlays() {
        for (const vid of Object.keys(edgeOverlays)) {
            removeEdgeOverlay(vid);
        }
    }

    // Build overlays for all active viewers (mini-viewers only)
    function applyEdgeHighlightToAll() {
        removeAllEdgeOverlays();
        if (!edgeHL.enabled) return;

        // Mini-viewers only — filter to edge-relevant viewers
        for (const [id, v] of Object.entries(viewers)) {
            if (!/edges/.test(v.focus || id)) continue;
            buildEdgeOverlay(v, id);
        }
    }

    // Update color on all existing overlays without rebuilding.
    // Skipped in autoColor mode (each line has its own per-mesh color).
    function updateEdgeColor(color) {
        if (edgeHL.autoColor) return;
        edgeHL.color.set(color);
        for (const [vid, ov] of Object.entries(edgeOverlays)) {
            for (const line of ov.lines) {
                if (line.material && line.material.color) {
                    line.material.color.set(color);
                    line.material.needsUpdate = true;
                }
            }
            // Re-render the overlay scene
            try {
                if (ov.renderer && ov.camera) ov.renderer.render(ov.scene, ov.camera);
                else if (vid === '__inline3d' && inline3DRenderer && inline3DScene && inline3DCamera) inline3DRenderer.render(inline3DScene, inline3DCamera);
                else if (vid === '__advanced' && threeRenderer && threeScene && threeCamera) threeRenderer.render(threeScene, threeCamera);
                else if (viewers[vid] && viewers[vid].renderer) viewers[vid].renderer.render(viewers[vid].scene, viewers[vid].camera);
            } catch (e) { /* ignore render errors */ }
        }
    }

    // Rebuild edges (when threshold changes, need new geometry)
    function rebuildEdgeOverlays() {
        if (!edgeHL.enabled) return;
        applyEdgeHighlightToAll();
    }

    // ─── Animation loop for pulsing ──────────────────────────────────
    // IMPORTANT: the loop MUST always call requestAnimationFrame at the end
    // even if there's a render error — wrap body in try-catch so a single
    // WebGL hiccup never permanently freezes the animation.
    function edgeHighlightAnimLoop(time) {
        if (!edgeHL.enabled) {
            edgeHL.animId = null;
            return;
        }
        try {
            const t = time * 0.001; // seconds
            // Sine oscillation: smoothly go between opMin and opMax
            const sine = Math.sin(t * edgeHL.speed * Math.PI);
            const opacity = edgeHL.opMin + (edgeHL.opMax - edgeHL.opMin) * (0.5 + 0.5 * sine);

            for (const ov of Object.values(edgeOverlays)) {
                for (const line of ov.lines) {
                    if (line.material) {
                        line.material.opacity = opacity;
                        // LineMaterial (ShaderMaterial) needs needsUpdate=true
                        // when uniforms change outside its own setter path.
                        line.material.needsUpdate = true;
                    }
                }
            }

            for (const [id, v] of Object.entries(viewers)) {
                if (edgeOverlays[id] && v.renderer && v.scene && v.camera) {
                    v.renderer.render(v.scene, v.camera);
                }
            }
        } catch (e) {
            // Swallow render errors — loop must keep running
        }
        edgeHL.animId = requestAnimationFrame(edgeHighlightAnimLoop);
    }

    function startEdgeAnimation() {
        // Always stop first to get a clean restart (prevents stale animId).
        if (edgeHL.animId) {
            cancelAnimationFrame(edgeHL.animId);
            edgeHL.animId = null;
        }
        if (!edgeHL.enabled) return;
        edgeHL.animId = requestAnimationFrame(edgeHighlightAnimLoop);
    }

    function stopEdgeAnimation() {
        if (edgeHL.animId) {
            cancelAnimationFrame(edgeHL.animId);
            edgeHL.animId = null;
        }
    }

    // Wire edge rebuild hook: called from inside Promise.all().then() after
    // each mini-viewer finishes loading its meshes (debounced 80ms).
    // Always stop → rebuild → start fresh so the loop begins with valid geometry.
    _edgeRebuildFn = function () {
        if (!edgeHL.enabled) return;
        stopEdgeAnimation();
        applyEdgeHighlightToAll();
        startEdgeAnimation();
    };
})();

// ══════════════════════════════════════════════════════════════════════
// ██  Wizard Step Navigation
// ══════════════════════════════════════════════════════════════════════
(function initWizard() {
    'use strict';

    const STEPS = [
        { sel: '.config-panel' },
        { sel: '.acabados-panel' },
        { sel: '#advanced-3d-config-panel' },
        { sel: '.viewer-panel' },
        { sel: '.download-panel' },
    ];

    let currentStep = 1;
    const stepData = [];

    STEPS.forEach((cfg, i) => {
        const panel = document.querySelector(cfg.sel);
        if (!panel) return;

        const stepNum = i + 1;
        panel.classList.add('wizard-step');
        panel.dataset.wizardStep = stepNum;

        // ── Build / upgrade header ───────────────────────────────
        const advHeader = panel.querySelector(':scope > .advanced-viewer-header');
        let headerEl;

        if (advHeader) {
            // Panels with existing flex header (toggle switch panels)
            headerEl = advHeader;
            headerEl.classList.add('wizard-step-header');
            const badge = document.createElement('span');
            badge.className = 'wizard-step-number';
            badge.textContent = stepNum;
            headerEl.prepend(badge);
        } else {
            // Panels with a plain h2
            const h2 = panel.querySelector(':scope > h2');
            if (!h2) return;
            headerEl = document.createElement('div');
            headerEl.className = 'wizard-step-header';
            const badge = document.createElement('span');
            badge.className = 'wizard-step-number';
            badge.textContent = stepNum;
            headerEl.appendChild(badge);
            panel.insertBefore(headerEl, h2);
            headerEl.appendChild(h2);
        }

        // Chevron
        const chevron = document.createElement('span');
        chevron.className = 'wizard-step-chevron';
        headerEl.appendChild(chevron);

        // Store nav buttons for later reference
        panel.dataset.stepNum = stepNum;
        panel._wizardStepNum = stepNum;

        // ── Wrap remaining content ───────────────────────────────
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'wizard-step-content';
        const contentInner = document.createElement('div');
        contentInner.className = 'wizard-step-content-inner';

        let sibling = headerEl.nextSibling;
        while (sibling) {
            const next = sibling.nextSibling;
            contentInner.appendChild(sibling);
            sibling = next;
        }

        // Navigation buttons
        const nav = document.createElement('div');
        nav.className = 'wizard-nav';

        if (stepNum > 1) {
            const prev = document.createElement('button');
            prev.type = 'button';
            prev.className = 'wizard-btn wizard-prev';
            prev.textContent = '\u2190 Anterior';
            prev.addEventListener('click', (e) => { e.stopPropagation(); wizardGo(stepNum - 1); });
            nav.appendChild(prev);
        }
        if (stepNum < STEPS.length) {
            const next = document.createElement('button');
            next.type = 'button';
            next.className = 'wizard-btn wizard-next';
            next.textContent = 'Siguiente \u2192';
            next.dataset.wizardNext = 'true';
            next.addEventListener('click', (e) => { 
                e.stopPropagation();
                if (!next.disabled) wizardGo(stepNum + 1);
            });
            nav.appendChild(next);
            panel._wizardNextBtn = next;
        }

        contentInner.appendChild(nav);
        contentWrapper.appendChild(contentInner);
        panel.appendChild(contentWrapper);

        stepData.push({ panel, stepNum });
    });

    // ── Navigation ───────────────────────────────────────────────
    function wizardGo(step, scroll) {
        currentStep = step;

        stepData.forEach(({ panel, stepNum }) => {
            const isActive = stepNum === step;
            const isDone   = stepNum < step;
            panel.classList.toggle('wizard-active', isActive);
            panel.classList.toggle('wizard-collapsed', !isActive);
            panel.classList.toggle('wizard-done', isDone);

            // Header click behavior: only allow for active or done steps
            const header = panel.querySelector('.wizard-step-header');
            if (header) {
                if (isActive || isDone) {
                    header.addEventListener('click', headerClickListener);
                } else {
                    header.removeEventListener('click', headerClickListener);
                }
            }

            // Auto-enable content toggles on first activation
            if (isActive && !panel.dataset.wizardInited) {
                const toggle = panel.querySelector('.wizard-step-header input[type="checkbox"]');
                if (toggle && !toggle.checked) {
                    toggle.checked = true;
                    toggle.dispatchEvent(new Event('change'));
                }
                panel.dataset.wizardInited = '1';
            }

            // Refresh inline 3D viewer when step 2 (Design 3D) becomes active
            if (isActive && stepNum === 2) {
                setTimeout(() => {
                    inline3DHasModel = false; // Reset camera frame
                    if (typeof updateInline3D === 'function') {
                        updateInline3D();
                    }
                }, 400);
            }

            // Initialize and resize 3D mini-viewers when step 3 becomes active
            if (isActive && stepNum === 3) {
                // Reset 3D viewer camera and regenerate on open
                viewerHasModel = false;
                if (typeof window.initAllMiniViewers === 'function') {
                    window.initAllMiniViewers();
                }
                // Wait for CSS animation to complete before resizing viewers and refreshing STL
                setTimeout(() => {
                    if (typeof window.recalcMiniViewerSizes === 'function') {
                        window.recalcMiniViewerSizes();
                    }
                    // Regenerate the main STL viewer with proper camera framing
                    if (typeof viewSTL === 'function') {
                        viewSTL();
                    }
                }, 400);
            }
        });

        // Validate next button for step 1
        updateNextButtonValidation();

        if (scroll !== false) {
            const active = stepData.find(s => s.stepNum === step);
            if (active) {
                setTimeout(() => {
                    active.panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }

    // Header click listener (delegated)
    const headerClickListener = function(e) {
        if (e.target.closest('.switch-label')) return;
        const panel = this.closest('.wizard-step');
        if (panel && panel._wizardStepNum) {
            wizardGo(panel._wizardStepNum);
        }
    };

    // Validate if next button should be enabled
    function updateNextButtonValidation() {
        const configPanel = stepData.find(d => d.stepNum === 1)?.panel;
        if (!configPanel || !configPanel._wizardNextBtn) return;

        const hasPuzzle = !!(puzzleData.grid && puzzleData.pieces);
        const btn = configPanel._wizardNextBtn;

        if (!hasPuzzle) {
            btn.disabled = true;
            btn.setAttribute('data-tooltip', 'Genera al menos un puzzle para continuar');
        } else {
            btn.disabled = false;
            btn.removeAttribute('data-tooltip');
        }
    }

    window.wizardGo   = wizardGo;
    window.wizardNext  = () => { if (currentStep < STEPS.length) wizardGo(currentStep + 1); };
    window.wizardPrev  = () => { if (currentStep > 1) wizardGo(currentStep - 1); };
    window.updateNextButtonValidation = updateNextButtonValidation;

    // Start at step 1 without scrolling
    wizardGo(1, false);
})();
