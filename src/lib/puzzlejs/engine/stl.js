import { normalizePiece } from './utils.js';

const TRI_TEMPLATE = (n, a, b, c) =>
  `  facet normal ${n.join(' ')}\n` +
  `    outer loop\n` +
  `      vertex ${a.join(' ')}\n` +
  `      vertex ${b.join(' ')}\n` +
  `      vertex ${c.join(' ')}\n` +
  `    endloop\n  endfacet\n`;

function cubeVertices(x0, y0, z0, sx, sy, sz) {
  return [
    [x0, y0, z0],
    [x0 + sx, y0, z0],
    [x0 + sx, y0 + sy, z0],
    [x0, y0 + sy, z0],
    [x0, y0, z0 + sz],
    [x0 + sx, y0, z0 + sz],
    [x0 + sx, y0 + sy, z0 + sz],
    [x0, y0 + sy, z0 + sz],
  ];
}

function cubeTriangles(x0, y0, z0, sx, sy, sz) {
  const v = cubeVertices(x0, y0, z0, sx, sy, sz);
  const f = [
    [0, 3, 1], [1, 3, 2],
    [4, 5, 7], [5, 6, 7],
    [0, 1, 4], [1, 5, 4],
    [1, 2, 5], [2, 6, 5],
    [2, 3, 6], [3, 7, 6],
    [3, 0, 7], [0, 4, 7],
  ];
  return f.map(([a, b, c]) => [v[a], v[b], v[c]]);
}

function normal([a, b, c]) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const len = Math.hypot(n[0], n[1], n[2]) || 1;
  return n.map((x) => (x / len).toFixed(6));
}

export function buildStl({ grid, pieces, cubeSize = 10, height = 2, gap = 5, tolerance = 0.3, border = 5, baseThickness = 1, wallHeight = 2 }) {
  const triangles = [];
  const addCube = (x, y, z, sx, sy, sz) => {
    for (const tri of cubeTriangles(x, y, z, sx, sy, sz)) {
      triangles.push(TRI_TEMPLATE(normal(tri), ...tri));
    }
  };

  const M = grid.length;
  const N = grid[0].length;
  const baseW = N * cubeSize + 2 * border;
  const baseH = M * cubeSize + 2 * border;

  addCube(0, 0, 0, baseW, baseH, baseThickness);
  addCube(0, 0, baseThickness, baseW, border, wallHeight);
  addCube(0, baseH - border, baseThickness, baseW, border, wallHeight);
  addCube(0, 0, baseThickness, border, baseH, wallHeight);
  addCube(baseW - border, 0, baseThickness, border, baseH, wallHeight);

  const cols = 3;
  const total = pieces.length;
  const rows = Math.ceil(total / cols);
  const maxWCells = pieces.length ? Math.max(...pieces.map((p) => span(p, 1))) : 0;
  const maxHCells = pieces.length ? Math.max(...pieces.map((p) => span(p, 0))) : 0;
  const strideX = maxWCells * cubeSize + gap;
  const strideY = maxHCells * cubeSize + gap;
  const galleryOffsetX = baseW + 20;
  const galleryOffsetY = 0;

  pieces.forEach((piece, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const baseX = galleryOffsetX + col * strideX;
    const baseY = galleryOffsetY + row * strideY;
    const norm = normalizePiece(piece);
    const set = new Set(norm.map(([r, c]) => `${r},${c}`));

    norm.forEach(([r, c]) => {
      const x = baseX + c * cubeSize + tolerance / 2;
      const y = baseY + r * cubeSize + tolerance / 2;
      addCube(x, y, baseThickness, cubeSize - tolerance, cubeSize - tolerance, height);
      if (set.has(`${r},${c + 1}`)) {
        const bx = baseX + (c + 1) * cubeSize - tolerance / 2;
        const by = baseY + r * cubeSize + tolerance / 2;
        addCube(bx, by, baseThickness, tolerance, cubeSize - tolerance, height);
      }
      if (set.has(`${r + 1},${c}`)) {
        const bx = baseX + c * cubeSize + tolerance / 2;
        const by = baseY + (r + 1) * cubeSize - tolerance / 2;
        addCube(bx, by, baseThickness, cubeSize - tolerance, tolerance, height);
      }
      if (set.has(`${r},${c + 1}`) && set.has(`${r + 1},${c}`) && set.has(`${r + 1},${c + 1}`)) {
        const cx = baseX + (c + 1) * cubeSize - tolerance / 2;
        const cy = baseY + (r + 1) * cubeSize - tolerance / 2;
        addCube(cx, cy, baseThickness, tolerance, tolerance, height);
      }
    });
  });

  const body = triangles.join('');
  return `solid puzzle\n${body}endsolid puzzle\n`;
}

function span(piece, idx) {
  const vals = piece.map((cell) => cell[idx]);
  return Math.max(...vals) - Math.min(...vals) + 1;
}
