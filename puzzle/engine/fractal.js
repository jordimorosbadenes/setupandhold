/* =====================================================
 *  PuzzleEngine — Circle Fractal Jigsaw
 *  Ported from app.py: FractalTile, FractalDiagonalConnection,
 *  FractalCellGrid, FractalArc, CircleFractalJigsaw
 * ===================================================== */
"use strict";

window.PuzzleFractal = (function () {

    // ── FractalTile ──────────────────────
    class FractalTile {
        constructor(x, y) { this.x = x; this.y = y; this.hasConnections = true; }
        eq(other) { return this.x === other.x && this.y === other.y; }
    }

    // ── FractalDiagonalConnection ────────
    class FractalDiagonalConnection {
        constructor(p1, p2, p2Taken) {
            this.p1 = p1; this.p2 = p2; this.p2Taken = p2Taken;
            this.slope = (p2.x - p1.x) !== 0 ? (p2.y - p1.y) / (p2.x - p1.x) : Infinity;
            const cx = Math.min(p2.x, p1.x), cy = Math.min(p2.y, p1.y);
            this.cell = [cx, cy];
            if (this.slope > 0) {
                this.quad = p2.y > p1.y ? 3 : 1;
            } else {
                this.quad = p2.y > p1.y ? 2 : 0;
            }
        }
        eq(other) {
            return this.cell[0] === other.cell[0] && this.cell[1] === other.cell[1] &&
                this.slope === other.slope && this.p2Taken === other.p2Taken;
        }
        static fromPointAndQuad(p1, quadrant, p2Taken) {
            let p2;
            if (quadrant === 0)      p2 = new FractalTile(p1.x + 1, p1.y - 1);
            else if (quadrant === 1) p2 = new FractalTile(p1.x - 1, p1.y - 1);
            else if (quadrant === 2) p2 = new FractalTile(p1.x - 1, p1.y + 1);
            else                     p2 = new FractalTile(p1.x + 1, p1.y + 1);
            return new FractalDiagonalConnection(p1, p2, p2Taken);
        }
    }

    // ── FractalCellGrid ──────────────────
    class FractalCellGrid {
        constructor(nrow, ncol) {
            this.nrow = nrow; this.ncol = ncol;
            this.visited = new Map();
            this.cellmap = new Map();
            this._nunvisited = ncol * nrow;
        }
        _key(x, y) { return x * 10000 + y; }
        _cellKey(c) { return c[0] * 10000 + c[1]; }

        randomEmptyTile() {
            const empties = [];
            for (let y = 0; y < this.ncol; y++)
                for (let x = 0; x < this.nrow; x++)
                    if (!this.visited.has(this._key(x, y)))
                        empties.push([x, y]);
            const c = empties[Math.min(Math.floor(Math.random() * empties.length), empties.length - 1)];
            return new FractalTile(c[0], c[1]);
        }
        reset() { this.visited.clear(); this.cellmap.clear(); this._nunvisited = this.ncol * this.nrow; }
        isTileValid(v) { return v.x >= 0 && v.x < this.nrow && v.y >= 0 && v.y < this.ncol; }
        isTileVisited(v) { return this.visited.has(this._key(v.x, v.y)); }
        isCellEmpty(cell) { return !this.cellmap.has(this._cellKey(cell)); }
        visitTile(v) {
            const k = this._key(v.x, v.y);
            if (!this.visited.has(k)) { this.visited.set(k, true); this._nunvisited--; }
        }
        occupyCell(cell) { this.cellmap.set(this._cellKey(cell), true); }
        liberateCell(cell) { this.cellmap.delete(this._cellKey(cell)); }
        get nunvisited() { return this._nunvisited; }
    }

    // ── FractalArc ───────────────────────
    class FractalArc {
        constructor(gcpX, gcpY, rad, offs, quad, sign) {
            this.cp = [gcpX * 2 * rad + rad + offs, gcpY * 2 * rad + rad + offs];
            this.quad = quad; this.rad = rad; this.sign = sign;
            const [cpX, cpY] = this.cp;
            let pa, pb;
            if (quad === 0)      { pa = [cpX + rad, cpY];       pb = [cpX, cpY - rad]; }
            else if (quad === 1) { pa = [cpX, cpY - rad];       pb = [cpX - rad, cpY]; }
            else if (quad === 2) { pa = [cpX - rad, cpY];       pb = [cpX, cpY + rad]; }
            else                 { pa = [cpX, cpY + rad];       pb = [cpX + rad, cpY]; }
            if (sign === 0) { this.sp = pa; this.ep = pb; }
            else            { this.sp = pb; this.ep = pa; }
        }

        toDict() {
            return { cp: [...this.cp], sp: [...this.sp], ep: [...this.ep],
                     rad: this.rad, quad: this.quad, sign: this.sign };
        }

        toSvg(arcShape) {
            arcShape = arcShape || 0;
            if (arcShape === 1) {
                // Square
                return `L ${this.ep[0]} ${this.ep[1]} `;
            }
            if (arcShape === 2) {
                // Octagonal
                const tan225 = Math.tan(Math.PI / 8);
                const hlen = this.rad * tan225;
                const q = this.quad;
                let sp = this.sp, ep = this.ep;
                if (this.sign === 1) { sp = this.ep; ep = this.sp; }
                let mp1, mp2;
                if (q === 0)      { mp1 = [sp[0], sp[1] - hlen]; mp2 = [ep[0] + hlen, ep[1]]; }
                else if (q === 1) { mp1 = [sp[0] - hlen, sp[1]]; mp2 = [ep[0], ep[1] - hlen]; }
                else if (q === 2) { mp1 = [sp[0], sp[1] + hlen]; mp2 = [ep[0] - hlen, ep[1]]; }
                else              { mp1 = [sp[0] + hlen, sp[1]]; mp2 = [ep[0], ep[1] + hlen]; }
                if (this.sign === 1)
                    return `L ${mp2[0]} ${mp2[1]} L ${mp1[0]} ${mp1[1]} L ${this.ep[0]} ${this.ep[1]} `;
                else
                    return `L ${mp1[0]} ${mp1[1]} L ${mp2[0]} ${mp2[1]} L ${this.ep[0]} ${this.ep[1]} `;
            }
            // Circular (default)
            return `A ${this.rad} ${this.rad} 0 0,${this.sign} ${this.ep[0]} ${this.ep[1]} `;
        }
    }

    // ── CircleFractalJigsaw ──────────────
    class CircleFractalJigsaw {
        constructor(ncols, nrows, minPieceLen, maxPieceLen) {
            this.ncols = ncols; this.nrows = nrows;
            this.grid = new FractalCellGrid(ncols, nrows);
            this.pieces = [];
            this.minPieceLen = minPieceLen;
            this.maxPieceLen = maxPieceLen;
        }

        possibleConnections(myTiles, allowPartials) {
            const pcs = [];
            const nbrs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            for (const v of myTiles) {
                if (v.hasConnections || allowPartials) {
                    v.hasConnections = false;
                    for (const [nx, ny] of nbrs) {
                        const cpt = new FractalTile(v.x + nx, v.y + ny);
                        if (!this.grid.isTileValid(cpt)) continue;
                        if (myTiles.some(t => t.eq(cpt))) continue;
                        const dc = new FractalDiagonalConnection(v, cpt, !this.grid.isTileVisited(cpt));
                        if (!this.grid.isCellEmpty(dc.cell)) continue;
                        if (allowPartials || !this.grid.isTileVisited(cpt)) {
                            pcs.push(dc);
                            v.hasConnections = true;
                        }
                    }
                }
            }
            return pcs;
        }

        createPiece() {
            const myTiles = [];
            const myConns = [];
            const target = Math.round(PuzzleUtils.uniform(this.minPieceLen, this.maxPieceLen));
            const vi = this.grid.randomEmptyTile();
            myTiles.push(vi);
            this.grid.visitTile(vi);

            while (this.grid.nunvisited > 0 && myTiles.length < target) {
                const pcs = this.possibleConnections(myTiles, false);
                if (pcs.length === 0) break;
                const chosen = pcs[Math.min(Math.floor(Math.random() * pcs.length), pcs.length - 1)];
                myConns.push(chosen);
                myTiles.push(chosen.p2);
                this.grid.occupyCell(chosen.cell);
                this.grid.visitTile(chosen.p2);
            }

            if (myTiles.length >= this.minPieceLen) {
                this.pieces.push(myConns);
            } else {
                for (const c of myConns) this.grid.liberateCell(c.cell);
            }
        }

        fillHoles(allowPartials) {
            let filled = false;
            this.pieces.sort((a, b) => a.length - b.length);
            for (const p of this.pieces) {
                if (!p.length) continue;
                const tiles = [p[0].p1];
                for (const con of p) tiles.push(con.p2);
                for (const v of [...tiles]) {
                    const pcs = this.possibleConnections([v], allowPartials)
                        .filter(pc => !tiles.some(t => t.eq(pc.p2)));
                    for (const pc of pcs) {
                        p.push(pc);
                        tiles.push(pc.p2);
                        filled = true;
                        this.grid.occupyCell(pc.cell);
                        this.grid.visitTile(pc.p2);
                    }
                }
            }
            return filled;
        }

        fillOrphanTiles() {
            let changed = true;
            while (changed) {
                changed = false;
                const assigned = new Set();
                for (const p of this.pieces) {
                    if (!p.length) continue;
                    assigned.add(this.grid._key(p[0].p1.x, p[0].p1.y));
                    for (const con of p) assigned.add(this.grid._key(con.p2.x, con.p2.y));
                }
                const orphans = [];
                for (let y = 0; y < this.grid.ncol; y++)
                    for (let x = 0; x < this.grid.nrow; x++)
                        if (this.grid.visited.has(this.grid._key(x, y)) && !assigned.has(this.grid._key(x, y)))
                            orphans.push(new FractalTile(x, y));
                if (!orphans.length) break;
                this.pieces.sort((a, b) => a.length - b.length);
                for (const orphan of orphans) {
                    let placed = false;
                    for (const p of this.pieces) {
                        if (!p.length) continue;
                        const tiles = [p[0].p1];
                        for (const con of p) tiles.push(con.p2);
                        for (const v of tiles) {
                            const dx = orphan.x - v.x, dy = orphan.y - v.y;
                            if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
                                const dc = new FractalDiagonalConnection(v, orphan, true);
                                if (this.grid.isCellEmpty(dc.cell)) {
                                    p.push(dc);
                                    this.grid.occupyCell(dc.cell);
                                    placed = true; changed = true;
                                    break;
                                }
                            }
                        }
                        if (placed) break;
                    }
                }
            }
        }

        regenerateGrid() {
            this.grid.reset();
            for (const p of this.pieces) {
                for (const c of p) {
                    if (!this.grid.isTileVisited(c.p1)) this.grid.visitTile(c.p1);
                    if (c.p2Taken && !this.grid.isTileVisited(c.p2)) this.grid.visitTile(c.p2);
                    this.grid.occupyCell(c.cell);
                }
            }
        }

        generate() {
            while (this.grid.nunvisited > 0) this.createPiece();
            this.regenerateGrid();
            this.fillOrphanTiles();
            while (this.fillHoles(false)) { /* keep filling */ }
            this.fillHoles(true);
        }

        getPiecesAsCells() {
            const result = [];
            for (const p of this.pieces) {
                const tiles = new Set();
                if (p.length) tiles.add(p[0].p1.y + ',' + p[0].p1.x);
                for (const con of p) tiles.add(con.p2.y + ',' + con.p2.x);
                result.push(Array.from(tiles).map(s => {
                    const [r, c] = s.split(',').map(Number);
                    return [r, c];
                }).sort((a, b) => a[0] - b[0] || a[1] - b[1]));
            }
            return result;
        }

        getGrid() {
            return Array.from({ length: this.nrows }, () => Array(this.ncols).fill(1));
        }

        static _addArcs(con, connections, arcs, rad, frame, first) {
            let newArc;
            if (con.quad === 0)      newArc = new FractalArc(con.p1.x + 1, con.p1.y, rad, frame, 1, 1);
            else if (con.quad === 1) newArc = new FractalArc(con.p1.x, con.p1.y - 1, rad, frame, 2, 1);
            else if (con.quad === 2) newArc = new FractalArc(con.p1.x - 1, con.p1.y, rad, frame, 3, 1);
            else                     newArc = new FractalArc(con.p1.x, con.p1.y + 1, rad, frame, 0, 1);
            arcs.push(newArc);

            if (con.p2Taken) {
                const p2quads = [(con.quad + 3) % 4, (con.quad + 4) % 4, (con.quad + 5) % 4];
                for (const q of p2quads) {
                    const pct = FractalDiagonalConnection.fromPointAndQuad(con.p2, q, true);
                    const pcnt = FractalDiagonalConnection.fromPointAndQuad(con.p2, q, false);
                    let found = false;
                    for (const c of connections) {
                        if (c.eq(pct)) {
                            CircleFractalJigsaw._addArcs(pct, connections, arcs, rad, frame, false);
                            found = true; break;
                        }
                    }
                    if (!found) {
                        for (const c of connections) {
                            if (c.eq(pcnt)) {
                                CircleFractalJigsaw._addArcs(pcnt, connections, arcs, rad, frame, false);
                                found = true; break;
                            }
                        }
                    }
                    if (!found) arcs.push(new FractalArc(con.p2.x, con.p2.y, rad, frame, q, 0));
                }
            } else {
                arcs.push(new FractalArc(con.p2.x, con.p2.y, rad, frame, (con.quad + 2) % 4, 1));
            }

            if (con.quad === 0)      newArc = new FractalArc(con.p1.x, con.p1.y - 1, rad, frame, 3, 1);
            else if (con.quad === 1) newArc = new FractalArc(con.p1.x - 1, con.p1.y, rad, frame, 0, 1);
            else if (con.quad === 2) newArc = new FractalArc(con.p1.x, con.p1.y + 1, rad, frame, 1, 1);
            else                     newArc = new FractalArc(con.p1.x + 1, con.p1.y, rad, frame, 2, 1);
            arcs.push(newArc);

            if (first) {
                const p1quads = [(con.quad + 1) % 4, (con.quad + 2) % 4, (con.quad + 3) % 4];
                for (const q of p1quads) {
                    const pct = FractalDiagonalConnection.fromPointAndQuad(con.p1, q, true);
                    const pcnt = FractalDiagonalConnection.fromPointAndQuad(con.p1, q, false);
                    let found = false;
                    for (const c of connections) {
                        if (c.eq(pct)) {
                            CircleFractalJigsaw._addArcs(pct, connections, arcs, rad, frame, false);
                            found = true; break;
                        }
                    }
                    if (!found) {
                        for (const c of connections) {
                            if (c.eq(pcnt)) {
                                CircleFractalJigsaw._addArcs(pcnt, connections, arcs, rad, frame, false);
                                found = true; break;
                            }
                        }
                    }
                    if (!found) arcs.push(new FractalArc(con.p1.x, con.p1.y, rad, frame, q, 0));
                }
            }
        }

        getArcsData(rad, frame) {
            rad = rad || 1.0; frame = frame || 0.0;
            const piecesArcs = [];
            for (const p of this.pieces) {
                if (!p.length) { piecesArcs.push([]); continue; }
                const arcs = [];
                CircleFractalJigsaw._addArcs(p[0], p, arcs, rad, frame, true);
                piecesArcs.push(arcs.map(a => a.toDict()));
            }
            return piecesArcs;
        }

        getSvgPaths(rad, frame, arcShape) {
            rad = rad || 1.0; frame = frame || 0.0; arcShape = arcShape || 0;
            const paths = [];
            for (const p of this.pieces) {
                if (!p.length) { paths.push(''); continue; }
                const arcs = [];
                CircleFractalJigsaw._addArcs(p[0], p, arcs, rad, frame, true);
                let d = `M${arcs[0].sp[0]},${arcs[0].sp[1]} `;
                for (const a of arcs) d += a.toSvg(arcShape);
                d += 'Z';
                paths.push(d);
            }
            return paths;
        }
    }

    // ── Public API ───────────────────────

    /**
     * Generate a fractal puzzle.
     * @param {object} params  { M, N, min_size, max_size, arc_shape }
     */
    function generate(params) {
        const M = parseInt(params.M) || 6;
        const N = parseInt(params.N) || 6;
        const minSize = parseInt(params.min_size) || 3;
        const maxSize = parseInt(params.max_size) || 6;
        const arcShape = parseInt(params.arc_shape) || 0;

        const jigsaw = new CircleFractalJigsaw(N, M, minSize, maxSize);
        jigsaw.generate();

        const grid = jigsaw.getGrid();
        const pieces = jigsaw.getPiecesAsCells();
        const arcsData = jigsaw.getArcsData(1.0, 0.0);
        const svgPaths = jigsaw.getSvgPaths(1.0, 0.0, arcShape);

        return {
            success: true, grid, pieces, piece_count: pieces.length,
            arcs_data: arcsData, svg_paths: svgPaths,
            ncols: N, nrows: M, puzzle_type: 'fractal'
        };
    }

    return { generate };
})();
