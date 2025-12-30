import { neighbors, randomChoice } from './utils.js';

export function generateGrid({ M, N, borderProb = 0.25, airProb = 0.0 }) {
  const grid = Array.from({ length: M }, () => Array.from({ length: N }, () => 1));
  for (let r = 0; r < M; r++) {
    for (let c = 0; c < N; c++) {
      if (r === 0 || r === M - 1 || c === 0 || c === N - 1) {
        if (Math.random() < borderProb) grid[r][c] = 0;
      }
    }
  }

  const corners = [
    [0, 0],
    [0, N - 1],
    [M - 1, 0],
    [M - 1, N - 1],
  ];
  for (const [r, c] of corners) {
    if (grid[r][c] === 1) {
      let blocked = 0;
      for (const [nr, nc] of neighbors([r, c], M, N)) {
        if (grid[nr][nc] === 0) blocked++;
      }
      if (blocked >= 2) grid[r][c] = 0;
    }
  }

  for (let r = 0; r < M; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c] === 1 && Math.random() < airProb) {
        grid[r][c] = -1;
      }
    }
  }
  return grid;
}

function randomPieceGrowth(unassigned, seed, minSize, maxSize, attemptsPerCell, M, N) {
  const target = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
  for (let attempt = 0; attempt < attemptsPerCell; attempt++) {
    const piece = new Set([seed.toString()]);
    const frontier = [seed];
    while (piece.size < target && frontier.length) {
      const cell = randomChoice(frontier);
      const nbrs = neighbors(cell, M, N).filter((n) => unassigned.has(n.toString()) && !piece.has(n.toString()));
      if (!nbrs.length) {
        frontier.splice(frontier.indexOf(cell), 1);
        continue;
      }
      const picked = randomChoice(nbrs);
      piece.add(picked.toString());
      frontier.push(picked);
    }
    if (piece.size === target) return Array.from(piece, (s) => s.split(',').map(Number));
  }
  return Array.from(new Set([seed.toString()]), (s) => s.split(',').map(Number));
}

export function partitionPieces(grid, { minSize = 3, maxSize = 4, mode = 'Balanced' }) {
  const M = grid.length;
  const N = grid[0].length;
  const isFillable = (r, c) => grid[r][c] === 1 || grid[r][c] === -1;
  let unassigned = new Set();
  for (let r = 0; r < M; r++) {
    for (let c = 0; c < N; c++) {
      if (isFillable(r, c)) unassigned.add(`${r},${c}`);
    }
  }

  const pieces = [];

  while (unassigned.size) {
    const seedStr = randomChoice(Array.from(unassigned));
    const seed = seedStr.split(',').map(Number);
    let piece;
    if (mode === 'Force minimum') {
      piece = growForceMin(unassigned, seed, minSize, maxSize, M, N);
    } else if (mode === 'Balanced') {
      piece = growBalanced(unassigned, seed, minSize, maxSize, M, N);
    } else if (mode === 'Strategic') {
      piece = growSmart(unassigned, seed, minSize, maxSize, M, N);
    } else {
      piece = randomPieceGrowth(unassigned, seed, minSize, maxSize, 30, M, N);
    }
    pieces.push(piece);
    for (const [r, c] of piece) unassigned.delete(`${r},${c}`);
  }
  return pieces.map((p) => p.sort(([a1, a2], [b1, b2]) => (a1 === b1 ? a2 - b2 : a1 - b1)));
}

function growForceMin(unassigned, seed, minSize, maxSize, M, N) {
  const target = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
  const piece = new Set([seed.toString()]);
  const frontier = [seed];
  let attempts = 0;
  while (piece.size < target && frontier.length && attempts < 80) {
    const cell = randomChoice(frontier);
    const nbrs = neighbors(cell, M, N).filter((n) => unassigned.has(n.toString()) && !piece.has(n.toString()));
    if (!nbrs.length) {
      frontier.splice(frontier.indexOf(cell), 1);
      attempts++;
      continue;
    }
    const pick = randomChoice(nbrs);
    piece.add(pick.toString());
    frontier.push(pick);
    attempts++;
  }
  if (piece.size < minSize) {
    for (const cellStr of Array.from(piece)) {
      const cell = cellStr.split(',').map(Number);
      for (const n of neighbors(cell, M, N)) {
        if (unassigned.has(n.toString()) && !piece.has(n.toString())) {
          piece.add(n.toString());
          if (piece.size >= minSize) break;
        }
      }
      if (piece.size >= minSize) break;
    }
  }
  return Array.from(piece, (s) => s.split(',').map(Number));
}

function growBalanced(unassigned, seed, minSize, maxSize, M, N) {
  const piece = randomPieceGrowth(unassigned, seed, minSize, maxSize, 30, M, N);
  if (piece.length >= minSize) return piece;
  const pool = new Set(piece.map((p) => p.toString()));
  for (const cellStr of Array.from(pool)) {
    const cell = cellStr.split(',').map(Number);
    for (const n of neighbors(cell, M, N)) {
      if (unassigned.has(n.toString()) && !pool.has(n.toString())) {
        pool.add(n.toString());
        if (pool.size >= minSize) break;
      }
    }
    if (pool.size >= minSize) break;
  }
  return Array.from(pool, (s) => s.split(',').map(Number));
}

function growSmart(unassigned, seed, minSize, maxSize, M, N) {
  const target = Math.floor((minSize + maxSize) / 2);
  const piece = new Set([seed.toString()]);
  const frontier = [seed];
  let attempts = 0;
  while (piece.size < target && frontier.length && attempts < 80) {
    const cell = randomChoice(frontier);
    const nbrs = neighbors(cell, M, N)
      .filter((n) => unassigned.has(n.toString()) && !piece.has(n.toString()))
      .sort((a, b) => scoreCell(a, unassigned, M, N) - scoreCell(b, unassigned, M, N));
    if (!nbrs.length) {
      frontier.splice(frontier.indexOf(cell), 1);
      attempts++;
      continue;
    }
    const pick = nbrs[0];
    piece.add(pick.toString());
    frontier.push(pick);
    attempts++;
  }
  while (piece.size < minSize) {
    let added = false;
    for (const cellStr of Array.from(piece)) {
      const cell = cellStr.split(',').map(Number);
      for (const n of neighbors(cell, M, N)) {
        if (unassigned.has(n.toString()) && !piece.has(n.toString())) {
          piece.add(n.toString());
          added = true;
          break;
        }
      }
      if (added) break;
    }
    if (!added) break;
  }
  return Array.from(piece, (s) => s.split(',').map(Number));
}

function scoreCell(cell, unassigned, M, N) {
  let free = 0;
  for (const n of neighbors(cell, M, N)) {
    if (unassigned.has(n.toString())) free++;
  }
  return free;
}
