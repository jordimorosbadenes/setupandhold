import { generateGrid, partitionPieces } from './engine/grid.js';
import { findSolutions } from './engine/solver.js';
import { buildStl } from './engine/stl.js';

export function initPuzzle() {
  const puzzleCanvas = document.getElementById('puzzle-canvas');
  const galleryCanvas = document.getElementById('gallery-canvas');
  if (!puzzleCanvas || !galleryCanvas) return;

  const puzzleCtx = puzzleCanvas.getContext('2d');
  const galleryCtx = galleryCanvas.getContext('2d');
  const state = { grid: null, pieces: null, solutions: 0, viewMode: 'isometric' };

  const viewButtons = document.querySelectorAll('.view-btn');
  viewButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      viewButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.viewMode = btn.dataset.view;
      draw();
    });
  });

  const get = (id) => document.getElementById(id);
  get('generate-btn')?.addEventListener('click', onGenerate);
  get('solve-10-btn')?.addEventListener('click', () => onSolve(10));
  get('solve-50-btn')?.addEventListener('click', () => onSolve(50));
  get('export-stl-btn')?.addEventListener('click', onExportStl);

  function readParams() {
    return {
      M: clamp(parseInt(get('M').value, 10), 2, 40),
      N: clamp(parseInt(get('N').value, 10), 2, 40),
      minSize: clamp(parseInt(get('min_size').value, 10), 1, 12),
      maxSize: clamp(parseInt(get('max_size').value, 10), 1, 20),
      mode: get('mode').value,
      borderProb: clamp(parseInt(get('border_prob').value, 10) / 100, 0, 1),
      airProb: clamp(parseInt(get('air_prob').value, 10) / 100, 0, 1),
    };
  }

  function onGenerate() {
    const params = readParams();
    const grid = generateGrid({ M: params.M, N: params.N, borderProb: params.borderProb, airProb: params.airProb });
    const pieces = partitionPieces(grid, { minSize: params.minSize, maxSize: params.maxSize, mode: params.mode });
    state.grid = grid;
    state.pieces = pieces;
    state.solutions = 0;
    setStatus(`✅ ${pieces.length} piezas generadas`);
    draw();
  }

  function onSolve(maxSolutions) {
    if (!state.grid || !state.pieces) {
      setStatus('⚠️ Genera un puzzle primero');
      return;
    }
    const count = findSolutions(state.grid, state.pieces, maxSolutions);
    state.solutions = count;
    const infoEl = get('solution-info');
    if (infoEl) infoEl.textContent = `Soluciones encontradas: ${count}`;
    setStatus(count > 0 ? `✅ ${count} soluciones` : '❌ Sin soluciones');
  }

  function onExportStl() {
    if (!state.grid || !state.pieces) {
      setStatus('⚠️ Genera un puzzle primero');
      return;
    }
    const params = readExportParams();
    const stl = buildStl({
      grid: state.grid,
      pieces: state.pieces,
      cubeSize: params.cubeSize,
      height: params.height,
      gap: params.gap,
      tolerance: params.tolerance,
      border: params.border,
      baseThickness: params.baseThickness,
      wallHeight: params.wallHeight,
    });
    const blob = new Blob([stl], { type: 'model/stl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'puzzle.stl';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('💾 STL exportado');
  }

  function draw() {
    if (!state.grid || !state.pieces) {
      clearCanvas(puzzleCtx, puzzleCanvas);
      clearCanvas(galleryCtx, galleryCanvas);
      return;
    }
    if (state.viewMode === 'flat') drawFlat();
    else drawIso();
    drawGallery();
  }

  function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f121a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawIso() {
    const grid = state.grid;
    const pieces = state.pieces;
    const M = grid.length;
    const N = grid[0].length;
    const w = puzzleCanvas.width;
    const h = puzzleCanvas.height;
    const cellSize = Math.min(2 * w / (N + M + 1), 4 * h / (N + M + 1), 180);
    clearCanvas(puzzleCtx, puzzleCanvas);

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    for (let r = 0; r < M; r++) {
      for (let c = 0; c < N; c++) {
        const x = c * cellSize * 0.5 - r * cellSize * 0.5;
        const y = r * cellSize * 0.25 + c * cellSize * 0.25;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x + cellSize);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y + cellSize);
      }
    }
    const offsetX = (w - (maxX - minX)) / 2 - minX;
    const offsetY = (h - (maxY - minY)) / 2 - minY;
    const isoX = (r, c) => offsetX + c * cellSize * 0.5 - r * cellSize * 0.5;
    const isoY = (r, c) => offsetY + r * cellSize * 0.25 + c * cellSize * 0.25;

    const cellPiece = new Map();
    pieces.forEach((p, idx) => {
      p.forEach(([r, c]) => cellPiece.set(`${r},${c}`, idx));
    });
    const cubes = [];
    for (let r = 0; r < M; r++) {
      for (let c = 0; c < N; c++) {
        const idx = cellPiece.get(`${r},${c}`);
        const val = grid[r][c];
        const color = idx !== undefined ? colorFor(idx) : val === 0 ? '#2a2f3a' : '#cfd3dc';
        cubes.push({ x: isoX(r, c), y: isoY(r, c), depth: r + c, color });
      }
    }
    cubes.sort((a, b) => a.depth - b.depth);
    for (const cube of cubes) drawIsoCube(cube.x, cube.y, cellSize, cube.color);
  }

  function drawIsoCube(x, y, s, color) {
    const ctx = puzzleCtx;
    const shade = (c, delta) => shadeColor(c, delta);
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    const top = ctx.createLinearGradient(x + s * 0.25, y, x + s * 0.25, y + s * 0.25);
    top.addColorStop(0, color);
    top.addColorStop(1, shade(color, -10));
    ctx.fillStyle = top;
    ctx.beginPath();
    ctx.moveTo(x + s * 0.5, y);
    ctx.lineTo(x + s, y + s * 0.25);
    ctx.lineTo(x + s * 0.5, y + s * 0.5);
    ctx.lineTo(x, y + s * 0.25);
    ctx.closePath();
    ctx.fill();

    const right = ctx.createLinearGradient(x + s, y + s * 0.25, x + s * 0.5, y + s * 0.75);
    right.addColorStop(0, shade(color, -5));
    right.addColorStop(1, shade(color, -25));
    ctx.fillStyle = right;
    ctx.beginPath();
    ctx.moveTo(x + s, y + s * 0.25);
    ctx.lineTo(x + s, y + s * 0.75);
    ctx.lineTo(x + s * 0.5, y + s);
    ctx.lineTo(x + s * 0.5, y + s * 0.5);
    ctx.closePath();
    ctx.fill();

    const left = ctx.createLinearGradient(x, y + s * 0.25, x + s * 0.5, y + s * 0.75);
    left.addColorStop(0, shade(color, -8));
    left.addColorStop(1, shade(color, -35));
    ctx.fillStyle = left;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.25);
    ctx.lineTo(x, y + s * 0.75);
    ctx.lineTo(x + s * 0.5, y + s);
    ctx.lineTo(x + s * 0.5, y + s * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = 'transparent';
  }

  function drawFlat() {
    const grid = state.grid;
    const pieces = state.pieces;
    const M = grid.length;
    const N = grid[0].length;
    clearCanvas(puzzleCtx, puzzleCanvas);
    const cellSize = Math.min(puzzleCanvas.width / (N + 1), puzzleCanvas.height / (M + 1));
    for (let r = 0; r < M; r++) {
      for (let c = 0; c < N; c++) {
        const idx = pieces.findIndex((p) => p.some(([pr, pc]) => pr === r && pc === c));
        const val = grid[r][c];
        const color = idx !== -1 ? colorFor(idx) : val === 0 ? '#2a2f3a' : '#cfd3dc';
        const x = c * cellSize + cellSize * 0.5;
        const y = r * cellSize + cellSize * 0.5;
        puzzleCtx.fillStyle = color;
        puzzleCtx.strokeStyle = '#0d1017';
        puzzleCtx.lineWidth = 1;
        puzzleCtx.beginPath();
        puzzleCtx.rect(x, y, cellSize * 0.9, cellSize * 0.9);
        puzzleCtx.fill();
        puzzleCtx.stroke();
      }
    }
  }

  function drawGallery() {
    const ctx = galleryCtx;
    const canvas = galleryCanvas;
    clearCanvas(ctx, canvas);
    if (!state.pieces) return;
    const pieces = state.pieces;
    const cols = 3;
    const spacing = 24;
    const cellSize = 22;
    pieces.forEach((piece, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const offsetX = col * (cellSize * 6 + spacing) + 20;
      const offsetY = row * (cellSize * 6 + spacing) + 20;
      const minR = Math.min(...piece.map(([r]) => r));
      const minC = Math.min(...piece.map(([, c]) => c));
      ctx.fillStyle = colorFor(idx);
      piece.forEach(([r, c]) => {
        const x = offsetX + (c - minC) * cellSize;
        const y = offsetY + (r - minR) * cellSize;
        ctx.fillRect(x, y, cellSize * 0.9, cellSize * 0.9);
      });
    });
  }

  function colorFor(idx) {
    const COLORS = [
      '#FF6666', '#FFCC66', '#99CC66', '#66CCCC', '#6699CC',
      '#CC99CC', '#FF99CC', '#CCCCCC', '#99CC99', '#CC6666',
      '#99CCCC', '#CC9966', '#66CC99', '#9966CC', '#9999CC',
      '#FF9966', '#FF6699', '#66FF99', '#99FFCC', '#FFCC99'
    ];
    return COLORS[idx % COLORS.length];
  }

  function shadeColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${(b | (g << 8) | (r << 16)).toString(16).padStart(6, '0')}`;
  }

  function setStatus(msg) {
    const el = get('status');
    if (el) el.textContent = msg;
  }

  function readExportParams() {
    const num = (id, fallback) => {
      const v = parseFloat(get(id)?.value ?? fallback);
      return Number.isFinite(v) ? v : fallback;
    };
    return {
      cubeSize: num('stl_cube_size', 10),
      height: num('stl_height', 2),
      tolerance: num('stl_tolerance', 0.3),
      gap: num('stl_gap', 5),
      border: num('stl_border', 5),
      baseThickness: num('stl_base_thickness', 1),
      wallHeight: num('stl_wall_height', 2),
    };
  }

  function clamp(v, min, max) {
    if (Number.isNaN(v)) return min;
    return Math.max(min, Math.min(max, v));
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initPuzzle();
  });
}
