export function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function neighbors([r, c], M, N) {
  const out = [];
  if (r + 1 < M) out.push([r + 1, c]);
  if (r - 1 >= 0) out.push([r - 1, c]);
  if (c + 1 < N) out.push([r, c + 1]);
  if (c - 1 >= 0) out.push([r, c - 1]);
  return out;
}

export function normalizePiece(piece) {
  let minR = Infinity;
  let minC = Infinity;
  for (const [r, c] of piece) {
    if (r < minR) minR = r;
    if (c < minC) minC = c;
  }
  return piece.map(([r, c]) => [r - minR, c - minC]).sort(compareCells);
}

export function rotatePiece(piece) {
  const maxR = Math.max(...piece.map(([r]) => r));
  return normalizePiece(piece.map(([r, c]) => [c, maxR - r]));
}

export function reflectPiece(piece) {
  const maxC = Math.max(...piece.map(([, c]) => c));
  return normalizePiece(piece.map(([r, c]) => [r, maxC - c]));
}

export function generateVariants(piece) {
  const variants = new Set();
  let current = normalizePiece(piece);
  for (let i = 0; i < 4; i++) {
    current = rotatePiece(current);
    const asKey = JSON.stringify(current);
    variants.add(asKey);
    variants.add(JSON.stringify(reflectPiece(current)));
  }
  return Array.from(variants, (k) => JSON.parse(k));
}

export function canonicalPiece(piece) {
  const variants = generateVariants(piece);
  const normalized = variants.map((v) => JSON.stringify(v.sort(compareCells)));
  return normalized.sort()[0];
}

export function compareCells(a, b) {
  if (a[0] !== b[0]) return a[0] - b[0];
  return a[1] - b[1];
}
