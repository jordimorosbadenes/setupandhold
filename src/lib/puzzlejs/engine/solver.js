import { generateVariants, normalizePiece, canonicalPiece } from './utils.js';

export function groupIdenticalPieces(pieces) {
  const groups = new Map();
  pieces.forEach((p, idx) => {
    const key = canonicalPiece(p);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(idx);
  });
  return Array.from(groups.values());
}

export function precomputePlacements(grid, piece) {
  const M = grid.length;
  const N = grid[0].length;
  const cells = new Set();
  for (let r = 0; r < M; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c] !== 0) cells.add(`${r},${c}`);
    }
  }
  const placements = new Set();
  const variants = generateVariants(piece);
  for (const variant of variants) {
    const maxR = Math.max(...variant.map(([r]) => r));
    const maxC = Math.max(...variant.map(([, c]) => c));
    for (let dr = 0; dr <= M - maxR - 1; dr++) {
      for (let dc = 0; dc <= N - maxC - 1; dc++) {
        const shifted = variant.map(([r, c]) => [r + dr, c + dc]);
        const key = shifted.map(([r, c]) => `${r},${c}`);
        const fits = key.every((k) => cells.has(k));
        if (fits) placements.add(JSON.stringify(shifted.sort(([a1, a2], [b1, b2]) => (a1 === b1 ? a2 - b2 : a1 - b1))));
      }
    }
  }
  return Array.from(placements, (p) => JSON.parse(p));
}

export function findSolutions(grid, pieces, maxSolutions = 10) {
  const M = grid.length;
  const N = grid[0].length;
  const cellsToCover = new Set();
  for (let r = 0; r < M; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c] !== 0) cellsToCover.add(`${r},${c}`);
    }
  }

  const groups = groupIdenticalPieces(pieces);
  const placementsByGroup = groups.map((g) => precomputePlacements(grid, normalizePiece(pieces[g[0]])));
  const solutionByOriginal = Array(pieces.length).fill(null);
  const solutions = [];

  function backtrack(groupIdx, covered) {
    if (solutions.length >= maxSolutions) return;
    if (groupIdx >= groups.length) {
      if (covered.size === cellsToCover.size) {
        solutions.push(solutionByOriginal.map((pl) => (pl ? Array.from(pl) : null)));
      }
      return;
    }
    const group = groups[groupIdx];
    const k = group.length;
    const placements = placementsByGroup[groupIdx];
    if (!placements.length) return;

    const chosen = [];
    function place(startIdx, placedCount, coveredSoFar) {
      if (solutions.length >= maxSolutions) return;
      if (placedCount === k) {
        group.forEach((origIdx, i) => {
          solutionByOriginal[origIdx] = chosen[i];
        });
        backtrack(groupIdx + 1, coveredSoFar);
        group.forEach((origIdx) => {
          solutionByOriginal[origIdx] = null;
        });
        return;
      }
      for (let pIdx = startIdx; pIdx < placements.length; pIdx++) {
        const pl = placements[pIdx];
        const plSet = new Set(pl.map(([r, c]) => `${r},${c}`));
        let conflict = false;
        for (const k of plSet) {
          if (coveredSoFar.has(k)) {
            conflict = true;
            break;
          }
        }
        if (conflict) continue;
        chosen.push(pl);
        const newCovered = new Set(coveredSoFar);
        plSet.forEach((k) => newCovered.add(k));
        place(pIdx + 1, placedCount + 1, newCovered);
        chosen.pop();
        if (solutions.length >= maxSolutions) return;
      }
    }
    place(0, 0, covered);
  }

  backtrack(0, new Set());
  return solutions.length;
}

export function countCells(grid) {
  let count = 0;
  for (const row of grid) {
    for (const v of row) {
      if (v !== 0) count++;
    }
  }
  return count;
}
