/* =====================================================
 *  PuzzleEngine — Jigsaw Puzzle Generator
 *  Ported from app.py: JigsawGenerator (rect + hex)
 *  Based on https://github.com/Draradech/jigsaw
 * ===================================================== */
"use strict";

window.PuzzleJigsaw = (function () {

    class JigsawGenerator {
        constructor(opts) {
            this.jigsawType = opts.jigsaw_type || 'rectangular';
            this.rows = opts.rows || 10;
            this.cols = opts.cols || 15;
            this.rings = opts.rings || 6;
            this.tabSize = (opts.tab_size || 20) / 200.0;
            this.jitter = (opts.jitter || 4) / 100.0;
            this.circleWarp = !!opts.circle_warp;
            this.truncateEdge = !!opts.truncate_edge;
            this.pieceSize = opts.piece_size || 10.0;
            this.diameter = opts.diameter || 100.0;

            this._seed = 1 + Math.floor(Math.random() * 9999);
            this.flip = false;
            this.a = 0; this.b = 0; this.c = 0; this.d = 0; this.e = 0;
        }

        _random() {
            const x = Math.sin(this._seed) * 10000;
            this._seed++;
            return x - Math.floor(x);
        }
        _uniform(mn, mx) { return mn + this._random() * (mx - mn); }
        _rbool() { return this._random() > 0.5; }

        // ── Rectangular helpers ───────────
        _rectFirst() {
            this.e = this._uniform(-this.jitter, this.jitter);
            this._rectNext();
        }
        _rectNext() {
            const flipold = this.flip;
            this.flip = this._rbool();
            this.a = (this.flip === flipold) ? -this.e : this.e;
            this.b = this._uniform(-this.jitter, this.jitter);
            this.c = this._uniform(-this.jitter, this.jitter);
            this.d = this._uniform(-this.jitter, this.jitter);
            this.e = this._uniform(-this.jitter, this.jitter);
        }

        _getRectHBezier(xi, yi, xn, yn, isFlipped) {
            const t = this.tabSize;
            const ox = xi, oy = yi;
            const f = isFlipped ? -1.0 : 1.0;
            const p0 = [ox, oy];
            const p1 = [ox + 0.2, oy + this.a * f];
            const p2 = [ox + 0.5 + this.b + this.d, oy + (-t + this.c) * f];
            const p3 = [ox + 0.5 - t + this.b, oy + (t + this.c) * f];
            const p4 = [ox + 0.5 - 2 * t + this.b - this.d, oy + (3 * t + this.c) * f];
            const p5 = [ox + 0.5 + 2 * t + this.b - this.d, oy + (3 * t + this.c) * f];
            const p6 = [ox + 0.5 + t + this.b, oy + (t + this.c) * f];
            const p7 = [ox + 0.5 + this.b + this.d, oy + (-t + this.c) * f];
            const p8 = [ox + 0.8, oy + this.e * f];
            const p9 = [ox + 1.0, oy];
            return {
                forward: [[p0, p1, p2, p3], [p3, p4, p5, p6], [p6, p7, p8, p9]],
                backward: [[p9, p8, p7, p6], [p6, p5, p4, p3], [p3, p2, p1, p0]]
            };
        }

        _getRectVBezier(xi, yi, xn, yn, isFlipped) {
            const t = this.tabSize;
            const ox = xi, oy = yi;
            const f = isFlipped ? -1.0 : 1.0;
            const p0 = [ox, oy];
            const p1 = [ox + this.a * f, oy + 0.2];
            const p2 = [ox + (-t + this.c) * f, oy + 0.5 + this.b + this.d];
            const p3 = [ox + (t + this.c) * f, oy + 0.5 - t + this.b];
            const p4 = [ox + (3 * t + this.c) * f, oy + 0.5 - 2 * t + this.b - this.d];
            const p5 = [ox + (3 * t + this.c) * f, oy + 0.5 + 2 * t + this.b - this.d];
            const p6 = [ox + (t + this.c) * f, oy + 0.5 + t + this.b];
            const p7 = [ox + (-t + this.c) * f, oy + 0.5 + this.b + this.d];
            const p8 = [ox + this.e * f, oy + 0.8];
            const p9 = [ox, oy + 1.0];
            return {
                forward: [[p0, p1, p2, p3], [p3, p4, p5, p6], [p6, p7, p8, p9]],
                backward: [[p9, p8, p7, p6], [p6, p5, p4, p3], [p3, p2, p1, p0]]
            };
        }

        _buildRectPiecePath(row, col, xn, yn, hEdges, vEdges) {
            let path = `M ${col} ${row} `;
            // Top
            if (row === 0) { path += `L ${col + 1} ${row} `; }
            else {
                const e = hEdges.get(`${row},${col}`);
                if (e) for (const s of e.forward)
                    path += `C ${s[1][0]} ${s[1][1]} ${s[2][0]} ${s[2][1]} ${s[3][0]} ${s[3][1]} `;
                else path += `L ${col + 1} ${row} `;
            }
            // Right
            if (col === xn - 1) { path += `L ${col + 1} ${row + 1} `; }
            else {
                const e = vEdges.get(`${col + 1},${row}`);
                if (e) for (const s of e.forward)
                    path += `C ${s[1][0]} ${s[1][1]} ${s[2][0]} ${s[2][1]} ${s[3][0]} ${s[3][1]} `;
                else path += `L ${col + 1} ${row + 1} `;
            }
            // Bottom (backward)
            if (row === yn - 1) { path += `L ${col} ${row + 1} `; }
            else {
                const e = hEdges.get(`${row + 1},${col}`);
                if (e) for (const s of e.backward)
                    path += `C ${s[1][0]} ${s[1][1]} ${s[2][0]} ${s[2][1]} ${s[3][0]} ${s[3][1]} `;
                else path += `L ${col} ${row + 1} `;
            }
            // Left (backward)
            if (col === 0) { path += `L ${col} ${row} `; }
            else {
                const e = vEdges.get(`${col},${row}`);
                if (e) for (const s of e.backward)
                    path += `C ${s[1][0]} ${s[1][1]} ${s[2][0]} ${s[2][1]} ${s[3][0]} ${s[3][1]} `;
                else path += `L ${col} ${row} `;
            }
            path += 'Z';
            return path;
        }

        // ── Generate rectangular ──────────
        _generateRectangular() {
            const xn = this.cols, yn = this.rows;
            this._seed = 1 + Math.floor(Math.random() * 9999);

            const hEdges = new Map();
            for (let yi = 1; yi < yn; yi++) {
                this._rectFirst();
                for (let xi = 0; xi < xn; xi++) {
                    hEdges.set(`${yi},${xi}`, this._getRectHBezier(xi, yi, xn, yn, this.flip));
                    this._rectNext();
                }
            }
            const vEdges = new Map();
            for (let xi = 1; xi < xn; xi++) {
                this._rectFirst();
                for (let yi = 0; yi < yn; yi++) {
                    vEdges.set(`${xi},${yi}`, this._getRectVBezier(xi, yi, xn, yn, this.flip));
                    this._rectNext();
                }
            }

            const svgPaths = [], piecesCells = [];
            for (let row = 0; row < yn; row++) {
                for (let col = 0; col < xn; col++) {
                    svgPaths.push(this._buildRectPiecePath(row, col, xn, yn, hEdges, vEdges));
                    piecesCells.push([[row, col]]);
                }
            }
            return { svgPaths, piecesCells, ncols: xn, nrows: yn };
        }

        // ── Hexagonal helpers ─────────────
        _hexNext() {
            this.flip = this._rbool();
            this.a = this._uniform(-this.jitter, this.jitter);
            this.b = this._uniform(-this.jitter, this.jitter);
            this.c = this._uniform(-this.jitter, this.jitter);
            this.d = this._uniform(-this.jitter, this.jitter);
            this.e = this._uniform(-this.jitter, this.jitter);
        }

        _hexScale(x, y, radius) {
            const n = this.rings;
            return [x * (1.0 / (2 * n - 4.0 / 3)) * radius,
                    y * (1.0 / (2 * n - 4.0 / 3)) * radius * Math.sqrt(0.75)];
        }
        _hexRotate(vx, vy, rot) {
            const cs = Math.cos(rot), sn = Math.sin(rot);
            return [vx * cs - vy * sn, vx * sn + vy * cs];
        }
        _hexWarp(vx, vy) {
            if (!this.circleWarp) return [vx, vy];
            const angl = Math.atan2(vy, vx) + Math.PI;
            const angl60 = angl % (Math.PI / 3);
            const angl30 = Math.abs((Math.PI / 6) - angl60);
            const ll = Math.sqrt(0.75) / Math.cos(angl30);
            return [vx / ll, vy / ll];
        }
        _hexProcessR(x, y, rot, radius, offset) {
            const [sx, sy] = this._hexScale(x, y, radius);
            const [rx, ry] = this._hexRotate(sx, sy, rot);
            const [wx, wy] = this._hexWarp(rx, ry);
            return [wx + radius + offset, wy + radius + offset];
        }
        _hexProcess(x, y, radius, offset) {
            return this._hexProcessR(x, y, 0, radius, offset);
        }

        _hexGenEdgePts(v1, v2) {
            const t = this.tabSize;
            this._hexNext();
            const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
            const rot90 = v => [-v[1], v[0]];
            const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
            const mul = (s, v) => [s * v[0], s * v[1]];
            const f = this.flip ? -1.0 : 1.0;
            const dl = sub(v2, v1);
            const dw = rot90(dl);
            const lerp = (pl, pw) => add(v1, add(mul(pl, dl), mul(pw, dw)));
            return [
                lerp(0.0, 0.0), lerp(0.2, this.a * f),
                lerp(0.5 + this.b + this.d, (-t + this.c) * f),
                lerp(0.5 - t + this.b, (t + this.c) * f),
                lerp(0.5 - 2 * t + this.b - this.d, (3 * t + this.c) * f),
                lerp(0.5 + 2 * t + this.b - this.d, (3 * t + this.c) * f),
                lerp(0.5 + t + this.b, (t + this.c) * f),
                lerp(0.5 + this.b + this.d, (-t + this.c) * f),
                lerp(0.8, this.e * f), lerp(1.0, 0.0)
            ];
        }

        // ── Generate hexagonal (per-cell paths) ──────
        _generateHexagonal() {
            const n = this.rings;
            const radius = n - 2.0 / 3;
            const offset = 0.15;
            this._seed = 1 + Math.floor(Math.random() * 9999);
            const yl = 2 * n - 1;

            // Horizontal edge points
            const hEdges = new Map();
            for (let yi = -yl + 2; yi < yl - 1; yi += 2) {
                const xl = 2 * n - 1 - Math.floor((Math.abs(yi) - 1) / 2);
                for (let xi = -xl + 1; xi < xl - 1; xi++) {
                    const yeven = ((yi + 1) % 4 === 0);
                    const xeven = (xi % 2 === 0);
                    const yoff = (yeven === xeven) ? (-1.0 / 3) : (1.0 / 3);
                    const v1 = this._hexProcess(xi, yi + yoff, radius, offset);
                    const v2 = this._hexProcess(xi + 1, yi - yoff, radius, offset);
                    hEdges.set(`${yi},${xi}`, this._hexGenEdgePts(v1, v2));
                }
            }

            // Vertical edge points
            const vEdges = new Map();
            for (let yi = -yl; yi < yl; yi += 2) {
                const xl = 2 * n - 1 - Math.floor(Math.abs(yi + 1) / 2);
                for (let xi = -xl + 2; xi < xl - 1; xi += 2) {
                    const v1 = this._hexProcess(xi, yi + 1.0 / 3, radius, offset);
                    const v2 = this._hexProcess(xi, yi + 5.0 / 3, radius, offset);
                    vEdges.set(`${yi},${xi}`, this._hexGenEdgePts(v1, v2));
                }
            }

            // Enumerate hex cells
            const cells = [];
            for (let q = -(n - 1); q < n; q++)
                for (let r = -(n - 1); r < n; r++)
                    if (Math.abs(q + r) <= n - 1) cells.push([q, r]);

            const fwdSvg = (pts) =>
                `C ${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]} ${pts[3][0]} ${pts[3][1]} ` +
                `C ${pts[4][0]} ${pts[4][1]} ${pts[5][0]} ${pts[5][1]} ${pts[6][0]} ${pts[6][1]} ` +
                `C ${pts[7][0]} ${pts[7][1]} ${pts[8][0]} ${pts[8][1]} ${pts[9][0]} ${pts[9][1]} `;
            const revSvg = (pts) =>
                `C ${pts[8][0]} ${pts[8][1]} ${pts[7][0]} ${pts[7][1]} ${pts[6][0]} ${pts[6][1]} ` +
                `C ${pts[5][0]} ${pts[5][1]} ${pts[4][0]} ${pts[4][1]} ${pts[3][0]} ${pts[3][1]} ` +
                `C ${pts[2][0]} ${pts[2][1]} ${pts[1][0]} ${pts[1][1]} ${pts[0][0]} ${pts[0][1]} `;

            const svgPaths = [], piecesCells = [];
            for (let idx = 0; idx < cells.length; idx++) {
                const [q, r] = cells[idx];
                const cx = 2 * q + r, cy = 2 * r;
                const edgeDefs = [
                    ['h', cy - 1, cx, true],   ['v', cy - 1, cx + 1, true],
                    ['h', cy + 1, cx, false],  ['h', cy + 1, cx - 1, false],
                    ['v', cy - 1, cx - 1, false], ['h', cy - 1, cx - 1, true],
                ];
                const parts = [];
                for (let i = 0; i < edgeDefs.length; i++) {
                    const [etype, yi, xi, forward] = edgeDefs[i];
                    const dict = etype === 'h' ? hEdges : vEdges;
                    const key = `${yi},${xi}`;
                    if (dict.has(key)) {
                        const pts = dict.get(key);
                        const startPt = forward ? pts[0] : pts[9];
                        const seg = forward ? fwdSvg(pts) : revSvg(pts);
                        if (i === 0) parts.push(`M ${startPt[0]} ${startPt[1]} `);
                        parts.push(seg);
                    } else {
                        // Border — straight line
                        let ev1, ev2;
                        if (etype === 'h') {
                            const yeven = ((yi + 1) % 4 === 0), xeven = (xi % 2 === 0);
                            const yoff = (yeven === xeven) ? (-1.0 / 3) : (1.0 / 3);
                            ev1 = this._hexProcess(xi, yi + yoff, radius, offset);
                            ev2 = this._hexProcess(xi + 1, yi - yoff, radius, offset);
                        } else {
                            ev1 = this._hexProcess(xi, yi + 1.0 / 3, radius, offset);
                            ev2 = this._hexProcess(xi, yi + 5.0 / 3, radius, offset);
                        }
                        const [startPt, endPt] = forward ? [ev1, ev2] : [ev2, ev1];
                        if (i === 0) parts.push(`M ${startPt[0]} ${startPt[1]} `);
                        parts.push(`L ${endPt[0]} ${endPt[1]} `);
                    }
                }
                parts.push('Z');
                svgPaths.push(parts.join(''));
                piecesCells.push([[idx, 0]]);
            }
            const width = 2 * (radius + offset);
            return { svgPaths, piecesCells, ncols: width, nrows: width, hexRadius: radius, hexOffset: offset };
        }

        generate() {
            if (this.jigsawType === 'hexagonal' || this.jigsawType === 'circular') {
                return this._generateHexagonal();
            }
            return this._generateRectangular();
        }
    }

    // ── Public API ───────────────────────

    function generate(params) {
        const gen = new JigsawGenerator({
            jigsaw_type: params.jigsaw_type || 'rectangular',
            rows: parseInt(params.rows) || 10,
            cols: parseInt(params.cols) || 15,
            rings: parseInt(params.rings) || 6,
            tab_size: parseFloat(params.tab_size) || 20,
            jitter: parseFloat(params.jitter) || 4,
            circle_warp: !!params.circle_warp,
            truncate_edge: !!params.truncate_edge,
            piece_size: parseFloat(params.piece_size) || 10,
            diameter: parseFloat(params.diameter) || 100,
        });

        const result = gen.generate();
        const jt = params.jigsaw_type || 'rectangular';
        const isHex = jt === 'hexagonal' || jt === 'circular';

        const base = {
            success: true,
            grid: isHex ? [[1]] : Array.from({ length: result.nrows }, () => Array(result.ncols).fill(1)),
            pieces: result.piecesCells,
            piece_count: result.svgPaths.length,
            svg_paths: result.svgPaths,
            ncols: result.ncols,
            nrows: result.nrows,
            puzzle_type: 'jigsaw',
            jigsaw_type: jt,
        };

        if (isHex) {
            base.hex_radius = result.hexRadius || 0;
            base.hex_offset = result.hexOffset || 0;
            base.truncate_edge = !!params.truncate_edge;
        }

        return base;
    }

    return { generate };
})();
