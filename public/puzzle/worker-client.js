/* =====================================================
 *  Worker Client — Fetch Interceptor
 *  Replaces api-bridge.js.
 *  Intercepts fetch('/api/...') calls from app.js and
 *  routes them to the configured backend.
 *
 *  BACKEND RESOLUTION (in order):
 *    1. URL param ?worker=local  → http://localhost:8787
 *    2. URL param ?worker=vps    → VPS_URL below
 *    3. URL param ?worker=cf     → WORKER_URL below (Cloudflare)
 *    4. localStorage 'PUZZLE_WORKER_URL'  (any custom URL)
 *    5. Default: DEFAULT_BACKEND below
 *
 *  DEV USAGE:
 *    ?worker=local   → local dev server (port 8787)
 *    ?worker=vps     → VPS backend
 *    ?worker=cf      → Cloudflare Worker
 * ===================================================== */
(function () {
    "use strict";

    // ══ Backend URLs — edit these after deploying ══════════════
    var WORKER_URL = 'https://puzzlestudio-worker.jordimorosbadenes.workers.dev';
    var VPS_URL    = 'https://puzzle.setupandhold.com';
    var LOCAL_URL  = 'http://localhost:3000';

    // ══ Default backend: 'vps', 'cf', or a full URL ═══════════
    var DEFAULT_BACKEND = 'vps';
    // ═══════════════════════════════════════════════════════════

    var BACKENDS = { local: LOCAL_URL, vps: VPS_URL, cf: WORKER_URL };

    function getWorkerBase() {
        // 1. URL param override
        try {
            var params = new URLSearchParams(window.location.search);
            var w = params.get('worker');
            if (w && BACKENDS[w]) return BACKENDS[w];
            if (w && w.startsWith('http')) return w.replace(/\/$/, '');
        } catch (_) {}
        // 2. localStorage override
        try {
            var stored = localStorage.getItem('PUZZLE_WORKER_URL');
            if (stored) return stored.replace(/\/$/, '');
        } catch (_) {}
        // 3. Default
        if (BACKENDS[DEFAULT_BACKEND]) return BACKENDS[DEFAULT_BACKEND];
        return DEFAULT_BACKEND;
    }

    var WORKER_BASE = getWorkerBase();

    // Routes that receive puzzle state from the frontend
    var ROUTES_WITH_STATE = {
        '/api/export_stl': true,
        '/api/export_3mf': true,
        '/api/export_stl_separate': true,
        '/api/find_solutions': true,
    };

    // Routes that return binary data (not JSON)
    var BINARY_ROUTES = {
        '/api/export_stl': true,
        '/api/export_3mf': true,
    };

    /**
     * Collect current puzzle state from the global puzzleData variable
     * (defined in app.js).  The Worker needs this for export/solve calls.
     */
    function getPuzzleState() {
        var pd = typeof puzzleData !== 'undefined' ? puzzleData : {};
        return {
            grid:        pd.grid        || null,
            pieces:      pd.pieces      || null,
            puzzle_type: pd.puzzleType  || 'normal',
            svg_paths:   pd.svgPaths    || null,
            arcs_data:   pd.arcsData    || null,
            ncols:       pd.fractalNcols || 0,
            nrows:       pd.fractalNrows || 0,
            jigsaw_type: pd.jigsawType  || null,
            hex_radius:  pd.hexRadius   || 0,
            hex_offset:  pd.hexOffset   || 0,
            truncate_edge: pd.truncateEdge || false,
            sliding_rows:       pd.slidingRows       || 0,
            sliding_cols:       pd.slidingCols       || 0,
            sliding_empty_row:  pd.slidingEmptyRow,
            sliding_empty_col:  pd.slidingEmptyCol,
            sliding_empty_corner: pd.slidingEmptyCorner || 'br',
        };
    }

    var _originalFetch = window.fetch;

    window.fetch = async function (input, init) {
        var url  = typeof input === 'string' ? input : (input && input.url ? input.url : '');
        var path = url.split('?')[0];

        // Only intercept /api/* calls
        if (!path.startsWith('/api/') && path !== '/health') {
            return _originalFetch.apply(window, arguments);
        }

        // Build worker URL
        var workerUrl = WORKER_BASE + path;

        // Parse request body
        var body = {};
        if (init && init.body) {
            try { body = JSON.parse(init.body); } catch (_) {}
        }

        // Inject puzzle state for routes that need it (skip if caller already provided state)
        if (ROUTES_WITH_STATE[path] && !body.puzzle_state) {
            body.puzzle_state = getPuzzleState();
        }

        // Build fetch options
        var options = {
            method:  (init && init.method) ? init.method : 'POST',
            headers: Object.assign({}, init && init.headers, { 'Content-Type': 'application/json' }),
            body:    JSON.stringify(body),
        };

        return _originalFetch.call(window, workerUrl, options);
    };

    console.log('[PuzzleEngine] Worker client loaded — /api/* → ' + WORKER_BASE);
})();
