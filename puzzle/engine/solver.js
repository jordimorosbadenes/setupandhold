/* =====================================================
 *  PuzzleEngine — Solution Finder (backtracking)
 *  Ported from app.py: find_solutions_unique
 * ===================================================== */
"use strict";

window.PuzzleSolver = (function () {
    const { normalizePiece, rotatePiece, reflectPiece } = window.PuzzleUtils;

    function generateVariants(piece) {
        const variants = new Set();
        let current = normalizePiece(piece);
        for (let i = 0; i < 4; i++) {
            current = rotatePiece(current);
            variants.add(JSON.stringify(current));
            variants.add(JSON.stringify(reflectPiece(current)));
        }
        return [...variants].map(v => JSON.parse(v));
    }

    function canonicalForms(piece) {
        const variants = generateVariants(piece);
        const normalized = variants.map(v => {
            const sorted = [...v].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            return JSON.stringify(sorted);
        });
        normalized.sort();
        return normalized[0];
    }

    function groupIdenticalPieces(pieces) {
        const groupsMap = new Map();
        for (let idx = 0; idx < pieces.length; idx++) {
            const key = canonicalForms(pieces[idx]);
            if (!groupsMap.has(key)) groupsMap.set(key, []);
            groupsMap.get(key).push(idx);
        }
        return {
            groups: [...groupsMap.values()],
            keys: [...groupsMap.keys()]
        };
    }

    function findSolutions(grid, pieces, maxSolutions) {
        maxSolutions = maxSolutions || 10;
        const M = grid.length, N = grid[0].length;
        const cellsToCover = new Set();
        for (let r = 0; r < M; r++)
            for (let c = 0; c < N; c++)
                if (grid[r][c] === 1)
                    cellsToCover.add(`${r},${c}`);

        const solutions = [];
        const { groups } = groupIdenticalPieces(pieces);

        // Precompute placements per group
        const groupPlacements = [];
        for (const g of groups) {
            const repIdx = g[0];
            const piece = pieces[repIdx];
            const rel = normalizePiece(piece);
            const variants = generateVariants(rel);
            const placementsSet = new Set();
            for (const v of variants) {
                const maxR = Math.max(...v.map(c => c[0]));
                const maxC = Math.max(...v.map(c => c[1]));
                for (let rs = 0; rs <= M - maxR - 1; rs++) {
                    for (let cs = 0; cs <= N - maxC - 1; cs++) {
                        const shifted = v.map(([r, c]) => [r + rs, c + cs]);
                        const allInCover = shifted.every(([r, c]) => cellsToCover.has(`${r},${c}`));
                        if (allInCover) {
                            const key = shifted.map(([r, c]) => `${r},${c}`).sort().join('|');
                            placementsSet.add(key);
                        }
                    }
                }
            }
            const placements = [...placementsSet].map(k =>
                new Set(k.split('|'))
            );
            placements.sort((a, b) => {
                const minA = [...a].sort()[0];
                const minB = [...b].sort()[0];
                return minA < minB ? -1 : minA > minB ? 1 : a.size - b.size;
            });
            groupPlacements.push(placements);
        }

        const nGroups = groups.length;
        const solutionByOriginal = new Array(pieces.length).fill(null);

        function setIntersects(a, b) {
            for (const v of a) if (b.has(v)) return true;
            return false;
        }
        function setUnion(a, b) {
            const u = new Set(a);
            for (const v of b) u.add(v);
            return u;
        }

        function backtrackGroup(idxGroup, covered) {
            if (solutions.length >= maxSolutions) return;
            if (idxGroup >= nGroups) {
                if (covered.size === cellsToCover.size) {
                    solutions.push(solutionByOriginal.map(s => s ? new Set(s) : null));
                }
                return;
            }

            const placements = groupPlacements[idxGroup];
            const g = groups[idxGroup];
            const k = g.length;
            if (k === 0) { backtrackGroup(idxGroup + 1, covered); return; }

            const chosen = [];
            function placeInGroup(startIdx, placedCount, coveredSoFar) {
                if (solutions.length >= maxSolutions) return;
                if (placedCount === k) {
                    const sortedG = [...g].sort((a, b) => a - b);
                    for (let j = 0; j < sortedG.length; j++) {
                        solutionByOriginal[sortedG[j]] = chosen[j];
                    }
                    backtrackGroup(idxGroup + 1, coveredSoFar);
                    for (const origIdx of g) solutionByOriginal[origIdx] = null;
                    return;
                }
                for (let pIdx = startIdx; pIdx < placements.length; pIdx++) {
                    const pl = placements[pIdx];
                    if (setIntersects(pl, coveredSoFar)) continue;
                    chosen.push(pl);
                    placeInGroup(pIdx + 1, placedCount + 1, setUnion(coveredSoFar, pl));
                    chosen.pop();
                    if (solutions.length >= maxSolutions) return;
                }
            }

            placeInGroup(0, 0, covered);
        }

        backtrackGroup(0, new Set());

        // Convert solutions to serializable format
        return solutions.map(sol =>
            sol.map(pieceCells => {
                if (!pieceCells) return [];
                return [...pieceCells].map(k => k.split(',').map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            })
        );
    }

    return { findSolutions, groupIdenticalPieces, canonicalForms };
})();
