/* =====================================================
 *  PuzzleEngine — Shared utilities
 * ===================================================== */
"use strict";

window.PuzzleUtils = (function () {

    /** Pick a random element from an array. */
    function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /** Fisher-Yates shuffle (in-place) and return the array. */
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /** Uniform random in [lo, hi). */
    function uniform(lo, hi) {
        return lo + Math.random() * (hi - lo);
    }

    /** 4-connected neighbors of [r,c] inside MxN grid. */
    function neighbors(cell, M, N) {
        const [r, c] = cell;
        const result = [];
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < M && nc >= 0 && nc < N) {
                result.push([nr, nc]);
            }
        }
        return result;
    }

    /** Translate piece so that minimum (r,c) is (0,0), then sort. */
    function normalizePiece(piece) {
        let minR = Infinity, minC = Infinity;
        for (const [r, c] of piece) { minR = Math.min(minR, r); minC = Math.min(minC, c); }
        const shifted = piece.map(([r, c]) => [r - minR, c - minC]);
        shifted.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        return shifted;
    }

    /** Rotate piece 90° clockwise, then normalize. */
    function rotatePiece(piece) {
        const maxR = Math.max(...piece.map(([r]) => r));
        return normalizePiece(piece.map(([r, c]) => [c, maxR - r]));
    }

    /** Reflect piece horizontally, then normalize. */
    function reflectPiece(piece) {
        const maxC = Math.max(...piece.map(([, c]) => c));
        return normalizePiece(piece.map(([r, c]) => [r, maxC - c]));
    }

    /** Generate all rotations × reflections of a piece.
     *  Returns an array of unique normalized variants. */
    function generateVariants(piece) {
        const seen = new Set();
        const variants = [];
        let current = normalizePiece(piece);
        for (let i = 0; i < 4; i++) {
            current = rotatePiece(current);
            const key1 = JSON.stringify(current);
            if (!seen.has(key1)) { seen.add(key1); variants.push(current); }
            const ref = reflectPiece(current);
            const key2 = JSON.stringify(ref);
            if (!seen.has(key2)) { seen.add(key2); variants.push(ref); }
        }
        return variants;
    }

    /** Canonical form: smallest sorted normalized variant. */
    function canonicalPiece(piece) {
        const variants = generateVariants(piece);
        const sorted = variants
            .map(v => JSON.stringify(v))
            .sort();
        return sorted[0];
    }

    /** Key for a cell [r,c] (for Set/Map). */
    function cellKey(r, c) {
        return r * 10000 + c;
    }

    return {
        randomChoice, shuffle, uniform, neighbors,
        normalizePiece, rotatePiece, reflectPiece,
        generateVariants, canonicalPiece, cellKey
    };
})();
