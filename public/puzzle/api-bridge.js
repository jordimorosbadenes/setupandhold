/* =====================================================
 *  API Bridge — Fetch Interceptor
 *  Intercepts fetch('/api/...') calls from app.js and
 *  routes them to local JS engine functions.
 *  Returns proper Response objects (JSON or Blob).
 * ===================================================== */
"use strict";

(function () {

    // Global puzzle state (mirrors Flask's app.puzzle_data)
    const puzzleState = {
        grid: null,
        pieces: null,
        solutions: [],
        puzzle_type: 'normal',
        svg_paths: null,
        arcs_data: null,
        ncols: 0,
        nrows: 0,
        jigsaw_type: 'rectangular',
        hex_radius: 0,
        hex_offset: 0,
        truncate_edge: false,
    };

    const generationProgress = { active: false, attempt: 0, max: 0, found: false };

    function jsonResponse(obj) {
        return new Response(JSON.stringify(obj), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    function blobResponse(blob, filename) {
        return new Response(blob, {
            status: 200,
            headers: {
                'Content-Type': blob.type || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });
    }
    function errorResponse(msg) {
        return new Response(JSON.stringify({ success: false, error: msg }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // ── Route handlers ──────────────────────────────────

    function handleGenerate(data) {
        try {
            const result = window.PuzzleGrid.generate({
                M: data.M, N: data.N,
                min_size: data.min_size, max_size: data.max_size,
                border_prob: data.border_prob, air_prob: data.air_prob,
                target_solutions: data.target_solutions
            });
            puzzleState.grid = result.grid;
            puzzleState.pieces = result.pieces;
            puzzleState.solutions = [];
            puzzleState.puzzle_type = 'normal';
            puzzleState.svg_paths = null;
            puzzleState.arcs_data = null;
            return jsonResponse(result);
        } catch (e) {
            return errorResponse(e.message);
        }
    }

    function handleGenerateFractal(data) {
        try {
            const result = window.PuzzleFractal.generate({
                M: data.M, N: data.N,
                min_size: data.min_size, max_size: data.max_size,
                arc_shape: data.arc_shape
            });
            puzzleState.grid = result.grid;
            puzzleState.pieces = result.pieces;
            puzzleState.solutions = [];
            puzzleState.puzzle_type = 'fractal';
            puzzleState.svg_paths = result.svg_paths;
            puzzleState.arcs_data = result.arcs_data;
            puzzleState.ncols = result.ncols;
            puzzleState.nrows = result.nrows;
            return jsonResponse(result);
        } catch (e) {
            return errorResponse(e.message);
        }
    }

    function handleGenerateJigsaw(data) {
        try {
            const result = window.PuzzleJigsaw.generate(data);
            puzzleState.grid = result.grid;
            puzzleState.pieces = result.pieces;
            puzzleState.solutions = [];
            puzzleState.puzzle_type = 'jigsaw';
            puzzleState.jigsaw_type = result.jigsaw_type;
            puzzleState.svg_paths = result.svg_paths;
            puzzleState.ncols = result.ncols;
            puzzleState.nrows = result.nrows;
            puzzleState.hex_radius = result.hex_radius || 0;
            puzzleState.hex_offset = result.hex_offset || 0;
            puzzleState.truncate_edge = result.truncate_edge || false;
            return jsonResponse(result);
        } catch (e) {
            return errorResponse(e.message);
        }
    }

    function handleFindSolutions(data) {
        try {
            if (!puzzleState.grid || !puzzleState.pieces) {
                return errorResponse('No puzzle generated');
            }
            const solutions = window.PuzzleSolver.findSolutions(
                puzzleState.grid, puzzleState.pieces,
                data.max_solutions || 10
            );
            puzzleState.solutions = solutions;
            return jsonResponse({
                success: true,
                solutions_count: solutions.length,
                solutions: solutions
            });
        } catch (e) {
            return errorResponse(e.message);
        }
    }

    function handleExportSTL(data) {
        try {
            if (!puzzleState.grid && !puzzleState.svg_paths) {
                return errorResponse('No puzzle generated');
            }
            const blob = window.PuzzleSTL.exportSTL(puzzleState, data);
            return blobResponse(blob, 'puzzle_project.stl');
        } catch (e) {
            return errorResponse(e.message);
        }
    }

    function handleExport3MF(data) {
        try {
            if (!puzzleState.grid && !puzzleState.svg_paths) {
                return errorResponse('No puzzle generated');
            }
            const blob = window.PuzzleSTL.export3MF(puzzleState, data);
            return blobResponse(blob, 'puzzle_multicolor.3mf');
        } catch (e) {
            return errorResponse(e.message);
        }
    }

    function handleExportSTLSeparate(data) {
        try {
            if (!puzzleState.grid && !puzzleState.svg_paths) {
                return errorResponse('No puzzle generated');
            }
            const result = window.PuzzleSTL.exportSTLSeparate(puzzleState, data);
            const resp = { success: true };

            const blobToBase64 = (blob) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        // result is data:...;base64,XXXXX — extract after comma
                        const b64 = reader.result.split(',')[1] || '';
                        resolve(b64);
                    };
                    reader.readAsDataURL(blob);
                });
            };

            // Return a promise that resolves to the JSON response
            return (async () => {
                if (result.base) resp.base = await blobToBase64(result.base);
                if (result.pieces) resp.pieces = await blobToBase64(result.pieces);
                if (result.relief) resp.relief = await blobToBase64(result.relief);
                return jsonResponse(resp);
            })();
        } catch (e) {
            return errorResponse(e.message);
        }
    }

    function handleProgress() {
        return jsonResponse(generationProgress);
    }

    // ── Route table ─────────────────────────────────────
    const routes = {
        '/api/generate':          handleGenerate,
        '/api/generate_fractal':  handleGenerateFractal,
        '/api/generate_jigsaw':   handleGenerateJigsaw,
        '/api/find_solutions':    handleFindSolutions,
        '/api/export_stl':        handleExportSTL,
        '/api/export_3mf':        handleExport3MF,
        '/api/export_stl_separate': handleExportSTLSeparate,
        '/api/progress':          handleProgress,
    };

    // ── Intercept fetch ─────────────────────────────────
    const _originalFetch = window.fetch;

    window.fetch = async function (input, init) {
        const url = (typeof input === 'string') ? input : (input.url || '');
        const path = url.split('?')[0];

        // Only intercept /api/* and /health calls
        const handler = routes[path];
        if (!handler) {
            return _originalFetch.apply(this, arguments);
        }

        // Parse body
        let body = {};
        if (init && init.body) {
            try { body = JSON.parse(init.body); } catch (_) {}
        }

        // Execute handler (may be sync, wrap in promise)
        try {
            const response = await Promise.resolve(handler(body));
            return response;
        } catch (e) {
            return errorResponse(e.message);
        }
    };

    // Also intercept the /health endpoint used by puzzle.astro
    const _origFetch2 = window.fetch;
    // (already intercepted above, add /health to route table)
    routes['/health'] = () => jsonResponse({ status: 'ok' });

    console.log('[PuzzleEngine] API Bridge loaded — all /api/* calls routed to local JS engine');
})();
