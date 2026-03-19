/* =====================================================
 *  PuzzleEngine — Grid generation & piece partitioning
 *  Ported from app.py: generate_grid, greedy_partition_*
 * ===================================================== */
"use strict";

window.PuzzleGrid = (function () {
    const { neighbors, randomChoice, shuffle, cellKey } = PuzzleUtils;

    // ── Defaults ──────────────────────────
    const DEFAULT_BORDER_PROB = 0.25;
    const DEFAULT_AIR_PROB = 0.0;
    const MAX_UNIQUE_ATTEMPTS = 50;

    // ── Connectivity helpers ──────────────

    /** Check if converting grid[r][c] to air keeps all regions
     *  large enough (>= minSize). */
    function canPlaceAir(grid, r, c, minSize) {
        const M = grid.length, N = grid[0].length;
        grid[r][c] = -1; // temporarily air
        const nbrs = neighbors([r, c], M, N);
        const checked = new Set();
        let valid = true;
        for (const [nr, nc] of nbrs) {
            if (grid[nr][nc] !== 1 || checked.has(cellKey(nr, nc))) continue;
            // BFS region size
            let size = 0;
            const queue = [[nr, nc]];
            const visited = new Set([cellKey(nr, nc)]);
            while (queue.length > 0) {
                const [cr, cc] = queue.shift();
                size++;
                if (size >= minSize) break;
                for (const [dr, dc] of neighbors([cr, cc], M, N)) {
                    const k = cellKey(dr, dc);
                    if (!visited.has(k) && grid[dr][dc] === 1) {
                        visited.add(k);
                        queue.push([dr, dc]);
                    }
                }
            }
            for (const k of visited) checked.add(k);
            if (size < minSize) { valid = false; break; }
        }
        grid[r][c] = 1; // revert
        return valid;
    }

    /** Generate an MxN grid with blocked borders and air cells. */
    function generateGrid(M, N, borderProb, airProb, minSize) {
        const grid = Array.from({ length: M }, () => Array(N).fill(1));

        // Block border cells
        for (let r = 0; r < M; r++) {
            for (let c = 0; c < N; c++) {
                if (r === 0 || r === M - 1 || c === 0 || c === N - 1) {
                    if (Math.random() < borderProb) grid[r][c] = 0;
                }
            }
        }

        // Protect corners
        const corners = [[0, 0], [0, N - 1], [M - 1, 0], [M - 1, N - 1]];
        for (const [r, c] of corners) {
            if (grid[r][c] === 1) {
                let blocked = 0;
                for (const [nr, nc] of neighbors([r, c], M, N)) {
                    if (grid[nr][nc] === 0) blocked++;
                }
                if (blocked >= 2) grid[r][c] = 0;
            }
        }

        // Place air cells
        if (airProb > 0) {
            const candidates = [];
            for (let r = 0; r < M; r++)
                for (let c = 0; c < N; c++)
                    if (grid[r][c] === 1) candidates.push([r, c]);
            shuffle(candidates);
            for (const [r, c] of candidates) {
                if (Math.random() < airProb && canPlaceAir(grid, r, c, minSize)) {
                    grid[r][c] = -1;
                }
            }
        }
        return grid;
    }

    // ── Piece partitioning ────────────────

    function greedyPartitionBasic(grid, minSize, maxSize, attemptsPerCell) {
        attemptsPerCell = attemptsPerCell || 30;
        const M = grid.length, N = grid[0].length;
        const unassigned = new Set();
        for (let r = 0; r < M; r++)
            for (let c = 0; c < N; c++)
                if (grid[r][c] === 1) unassigned.add(cellKey(r, c));

        const pieces = [];
        while (unassigned.size > 0) {
            // pick random seed
            const unArr = Array.from(unassigned).map(k => [Math.floor(k / 10000), k % 10000]);
            const seed = randomChoice(unArr);
            const targetSize = minSize + Math.floor(Math.random() * (maxSize - minSize + 1));
            let bestPiece = null;

            for (let att = 0; att < attemptsPerCell; att++) {
                const piece = new Set([cellKey(seed[0], seed[1])]);
                const pieceList = [[seed[0], seed[1]]];
                const frontier = [[seed[0], seed[1]]];
                while (piece.size < targetSize && frontier.length > 0) {
                    const cell = randomChoice(frontier);
                    const nbrs = neighbors(cell, M, N)
                        .filter(([nr, nc]) => unassigned.has(cellKey(nr, nc)) && !piece.has(cellKey(nr, nc)));
                    if (nbrs.length === 0) {
                        frontier.splice(frontier.indexOf(cell), 1);
                        continue;
                    }
                    const newCell = randomChoice(nbrs);
                    const k = cellKey(newCell[0], newCell[1]);
                    piece.add(k);
                    pieceList.push(newCell);
                    frontier.push(newCell);
                }
                if (piece.size === targetSize) { bestPiece = pieceList; break; }
                if (!bestPiece || pieceList.length > bestPiece.length) bestPiece = pieceList;
            }

            pieces.push(bestPiece.map(([r, c]) => [r, c]));
            for (const [r, c] of bestPiece) unassigned.delete(cellKey(r, c));
        }
        return pieces;
    }

    function greedyPartitionBalanced(grid, minSize, maxSize) {
        const pieces = greedyPartitionBasic(grid, minSize, maxSize);
        const M = grid.length, N = grid[0].length;

        // Build cell → piece index map
        const cellMap = new Map();
        for (let i = 0; i < pieces.length; i++) {
            for (const [r, c] of pieces[i]) cellMap.set(cellKey(r, c), i);
        }

        // Merge tiny pieces with neighbors
        let changed = true;
        while (changed) {
            changed = false;
            for (let i = 0; i < pieces.length; i++) {
                if (pieces[i].length === 0 || pieces[i].length >= minSize) continue;
                let found = false;
                for (const [r, c] of pieces[i]) {
                    for (const [nr, nc] of neighbors([r, c], M, N)) {
                        const k = cellKey(nr, nc);
                        if (cellMap.has(k) && cellMap.get(k) !== i) {
                            const j = cellMap.get(k);
                            // merge j into i
                            for (const cell of pieces[j]) {
                                pieces[i].push(cell);
                                cellMap.set(cellKey(cell[0], cell[1]), i);
                            }
                            pieces[j] = [];
                            found = true;
                            changed = true;
                            break;
                        }
                    }
                    if (found) break;
                }
            }
        }
        return pieces.filter(p => p.length > 0);
    }

    // ── Public API ────────────────────────

    /**
     * Generate a normal puzzle (grid + pieces).
     * @param {object} params  { M, N, min_size, max_size, border_prob, air_prob, target_solutions }
     * @returns {object} { success, grid, pieces, piece_count, ... }
     */
    function generate(params) {
        const M = parseInt(params.M) || 6;
        const N = parseInt(params.N) || 7;
        const minSize = parseInt(params.min_size) || 3;
        const maxSize = parseInt(params.max_size) || 4;
        const borderProb = parseFloat(params.border_prob) || 0;
        const airProb = parseFloat(params.air_prob) || 0;
        const targetSolutions = parseInt(params.target_solutions) || 0;

        if (targetSolutions > 0) {
            const checkCount = targetSolutions === 1 ? 2 : targetSolutions + 1;
            let grid, pieces, attempt;
            for (attempt = 0; attempt < MAX_UNIQUE_ATTEMPTS; attempt++) {
                grid = generateGrid(M, N, borderProb, airProb, minSize);
                pieces = greedyPartitionBalanced(grid, minSize, maxSize);
                const solutions = PuzzleSolver.findSolutions(grid, pieces, checkCount);
                const match = targetSolutions === 1 ? solutions.length === 1 : solutions.length >= targetSolutions;
                if (match) {
                    return {
                        success: true, grid, pieces, piece_count: pieces.length,
                        target_met: true, target_solutions: targetSolutions,
                        attempts: attempt + 1
                    };
                }
            }
            // Failed after MAX attempts
            return {
                success: true, grid, pieces, piece_count: pieces.length,
                warning: `No se encontró puzzle con ${targetSolutions === 1 ? 'exactamente 1 solución' : 'al menos ' + targetSolutions + ' soluciones'} en ${MAX_UNIQUE_ATTEMPTS} intentos. Se muestra el último generado.`
            };
        }

        const grid = generateGrid(M, N, borderProb, airProb, minSize);
        const pieces = greedyPartitionBalanced(grid, minSize, maxSize);
        return { success: true, grid, pieces, piece_count: pieces.length };
    }

    return { generate, generateGrid, greedyPartitionBalanced };
})();
