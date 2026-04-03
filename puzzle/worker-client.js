/* =====================================================
 *  Worker Client — Fetch Interceptor
 *  Replaces api-bridge.js.
 *  Intercepts fetch('/api/...') calls from app.js and
 *  routes them to the Cloudflare Worker backend.
 *
 *  WORKER URL RESOLUTION (in order):
 *    1. URL param ?worker=local  → http://localhost:8787
 *    2. localStorage 'PUZZLE_WORKER_URL'
 *    3. Default: deployed worker URL (set PUZZLE_WORKER_URL below)
 *
 *  DEV USAGE (local worker):
 *    - Start worker:  cd puzzlestudio-worker && npm run dev
 *    - Open studio:   add ?worker=local to the URL
 *      e.g. http://localhost:4321/puzzle/studio.html?worker=local
 *    OR run in browser console:
 *      localStorage.setItem('PUZZLE_WORKER_URL', 'http://localhost:8787')
 * ===================================================== */
(function () {
    "use strict";

    // ══ Change this to your deployed Worker URL after deploying ══
    // var DEFAULT_WORKER_URL = 'https://puzzlestudio-worker.YOUR_SUBDOMAIN.workers.dev';
    var DEFAULT_WORKER_URL = 'https://puzzlestudio-worker.jordimorosbadenes.workers.dev';
    // ═════════════════════════════════════════════════════════════

    function getWorkerBase() {
        // 1. URL param override
        try {
            var params = new URLSearchParams(window.location.search);
            if (params.get('worker') === 'local') return 'http://localhost:8787';
        } catch (_) {}
        // 2. localStorage override
        try {
            var stored = localStorage.getItem('PUZZLE_WORKER_URL');
            if (stored) return stored.replace(/\/$/, '');
        } catch (_) {}
        // 3. Default deployed URL
        return DEFAULT_WORKER_URL;
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
