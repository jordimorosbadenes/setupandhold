/* =====================================================
 *  PuzzleEngine — STL / 3MF Export (pure JS)
 *  Full port from app.py using Clipper.js for polygon booleans.
 *
 *  Features:
 *    - Normal puzzle: union of cell boxes → polygon → extrude
 *    - Fractal/Jigsaw: SVG path → polygon → extrude
 *    - Tolerance via polygon offset (buffer)
 *    - Corner rounding via morphological opening/closing
 *    - Infill patterns: solid, hollow, grid, stripes, zigzag, honeycomb, circles, remix
 *    - Texture patterns: grid, stripes, zigzag, honeycomb, circles, solid
 *    - Texture directions: outward, flush, inward
 *    - Base with walls, fill border gaps, contoured base, truncate edge
 *    - return_separate: base/pieces/relief with center + X-mirror
 * ===================================================== */
"use strict";

window.PuzzleSTL = (function () {

    // ═══════════════════════════════════════════════════
    //  CLIPPER.JS POLYGON OPERATIONS
    // ═══════════════════════════════════════════════════
    var CLP_SCALE = 1000;
    var CL = window.ClipperLib;

    function toClip(pts) {
        return pts.map(function(p) { return {X: Math.round(p[0]*CLP_SCALE), Y: Math.round(p[1]*CLP_SCALE)}; });
    }
    function fromClip(cp) {
        return cp.map(function(p) { return [p.X/CLP_SCALE, p.Y/CLP_SCALE]; });
    }

    function offsetPolygon(pts, amount, joinType, miterLimit) {
        if (!pts || pts.length < 3) return [];
        joinType = joinType !== undefined ? joinType : 2;
        miterLimit = miterLimit || 5.0;
        var co = new CL.ClipperOffset(miterLimit, 0.001 * CLP_SCALE);
        var path = toClip(pts);
        if (CL.Clipper.Area(path) < 0) path.reverse();
        co.AddPath(path, joinType, CL.EndType.etClosedPolygon);
        var solution = new CL.Paths();
        co.Execute(solution, amount * CLP_SCALE);
        if (solution.length === 0) return [];
        var best = solution[0], bestA = Math.abs(CL.Clipper.Area(best));
        for (var i = 1; i < solution.length; i++) {
            var a = Math.abs(CL.Clipper.Area(solution[i]));
            if (a > bestA) { best = solution[i]; bestA = a; }
        }
        return fromClip(best);
    }

    function offsetPolygonAll(pts, amount, joinType, miterLimit) {
        if (!pts || pts.length < 3) return [];
        joinType = joinType !== undefined ? joinType : 2;
        miterLimit = miterLimit || 5.0;
        var co = new CL.ClipperOffset(miterLimit, 0.001 * CLP_SCALE);
        var path = toClip(pts);
        if (CL.Clipper.Area(path) < 0) path.reverse();
        co.AddPath(path, joinType, CL.EndType.etClosedPolygon);
        var solution = new CL.Paths();
        co.Execute(solution, amount * CLP_SCALE);
        return solution.map(fromClip);
    }

    function offsetPaths(pathsArr, amount, joinType, miterLimit) {
        joinType = joinType !== undefined ? joinType : 2;
        miterLimit = miterLimit || 5.0;
        var co = new CL.ClipperOffset(miterLimit, 0.001 * CLP_SCALE);
        for (var k = 0; k < pathsArr.length; k++) {
            var pts = pathsArr[k];
            if (!pts || pts.length < 3) continue;
            var path = toClip(pts);
            // Preserve winding: CCW=outer, CW=hole (matches Clipper convention)
            co.AddPath(path, joinType, CL.EndType.etClosedPolygon);
        }
        var solution = new CL.Paths();
        co.Execute(solution, amount * CLP_SCALE);
        return solution.map(fromClip);
    }

    function clipperOp(subj, clip, opType) {
        var c = new CL.Clipper();
        for (var i = 0; i < subj.length; i++) {
            if (!subj[i] || subj[i].length < 3) continue;
            c.AddPath(toClip(subj[i]), CL.PolyType.ptSubject, true);
        }
        for (var j = 0; j < clip.length; j++) {
            if (!clip[j] || clip[j].length < 3) continue;
            c.AddPath(toClip(clip[j]), CL.PolyType.ptClip, true);
        }
        var sol = new CL.Paths();
        c.Execute(opType, sol, CL.PolyFillType.pftNonZero, CL.PolyFillType.pftNonZero);
        return sol.map(fromClip);
    }

    function asArr(x) {
        if (x.length === 0) return [];
        return (Array.isArray(x[0]) && Array.isArray(x[0][0])) ? x : [x];
    }
    function polyUnion(a, b) { return clipperOp(asArr(a), asArr(b), CL.ClipType.ctUnion); }
    function polyDifference(s, c) { return clipperOp(asArr(s), asArr(c), CL.ClipType.ctDifference); }
    function polyIntersection(s, c) { return clipperOp(asArr(s), asArr(c), CL.ClipType.ctIntersection); }

    function polyUnionAll(arr) {
        if (arr.length === 0) return [];
        if (arr.length === 1) return [arr[0]];
        var c = new CL.Clipper();
        for (var i = 0; i < arr.length; i++) {
            if (!arr[i] || arr[i].length < 3) continue;
            c.AddPath(toClip(arr[i]), CL.PolyType.ptSubject, true);
        }
        var sol = new CL.Paths();
        c.Execute(CL.ClipType.ctUnion, sol, CL.PolyFillType.pftNonZero, CL.PolyFillType.pftNonZero);
        return sol.map(fromClip);
    }

    function polyArea(pts) {
        var a = 0;
        for (var i = 0, n = pts.length; i < n; i++) {
            var j = (i + 1) % n;
            a += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1];
        }
        return a / 2;
    }

    function polyBounds(pts) {
        var mnX = Infinity, mnY = Infinity, mxX = -Infinity, mxY = -Infinity;
        for (var i = 0; i < pts.length; i++) {
            var x = pts[i][0], y = pts[i][1];
            if (x < mnX) mnX = x; if (x > mxX) mxX = x;
            if (y < mnY) mnY = y; if (y > mxY) mxY = y;
        }
        return [mnX, mnY, mxX, mxY];
    }

    function boxPoly(x1, y1, x2, y2) { return [[x1,y1],[x2,y1],[x2,y2],[x1,y2]]; }

    function circlePoly(cx, cy, r, n) {
        n = n || 64;
        var pts = [];
        for (var i = 0; i < n; i++) {
            var a = 2 * Math.PI * i / n;
            pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
        }
        return pts;
    }

    function hexPoly(cx, cy, r, angOff) {
        angOff = angOff || 0;
        var pts = [];
        for (var k = 0; k < 6; k++) {
            var a = (Math.PI / 180) * (60 * k + 30) + angOff;
            pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
        }
        return pts;
    }

    function rotatePoly(pts, deg, cx, cy) {
        var rad = deg * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
        return pts.map(function(p) {
            var dx = p[0]-cx, dy = p[1]-cy;
            return [cx + dx*cos - dy*sin, cy + dx*sin + dy*cos];
        });
    }
    function rotatePolys(polys, deg, cx, cy) {
        return polys.map(function(p) { return rotatePoly(p, deg, cx, cy); });
    }

    // ═══════════════════════════════════════════════════
    //  EARCUT TRIANGULATION
    // ═══════════════════════════════════════════════════
    function triangulate(coords, holeIndices) {
        if (window.earcut) return window.earcut(coords, holeIndices);
        var n = coords.length / 2, tris = [];
        for (var i = 1; i < n - 1; i++) tris.push(0, i, i + 1);
        return tris;
    }

    // ═══════════════════════════════════════════════════
    //  BINARY STL WRITER
    // ═══════════════════════════════════════════════════
    function buildBinarySTL(triangles) {
        var nFaces = triangles.length;
        if (nFaces === 0) return new Blob([new ArrayBuffer(84)], { type: 'model/stl' });
        var bufLen = 80 + 4 + nFaces * 50;
        var buf = new ArrayBuffer(bufLen);
        var dv = new DataView(buf);
        for (var i = 0; i < 80; i++) dv.setUint8(i, 0);
        dv.setUint32(80, nFaces, true);
        var off = 84;
        for (var i = 0; i < nFaces; i++) {
            var tri = triangles[i], a = tri[0], b = tri[1], c = tri[2];
            var u0 = b[0]-a[0], u1 = b[1]-a[1], u2 = b[2]-a[2];
            var v0 = c[0]-a[0], v1 = c[1]-a[1], v2 = c[2]-a[2];
            var nx = u1*v2 - u2*v1, ny = u2*v0 - u0*v2, nz = u0*v1 - u1*v0;
            var len = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
            nx /= len; ny /= len; nz /= len;
            dv.setFloat32(off, nx, true); off += 4;
            dv.setFloat32(off, ny, true); off += 4;
            dv.setFloat32(off, nz, true); off += 4;
            var pts = [a, b, c];
            for (var k = 0; k < 3; k++) {
                dv.setFloat32(off, pts[k][0], true); off += 4;
                dv.setFloat32(off, pts[k][1], true); off += 4;
                dv.setFloat32(off, pts[k][2], true); off += 4;
            }
            dv.setUint16(off, 0, true); off += 2;
        }
        return new Blob([buf], { type: 'model/stl' });
    }

    // ═══════════════════════════════════════════════════
    //  BOX HELPER (legacy compat)
    // ═══════════════════════════════════════════════════
    function boxTriangles(x, y, z, sx, sy, sz) {
        var v = [
            [x,y,z],[x+sx,y,z],[x+sx,y+sy,z],[x,y+sy,z],
            [x,y,z+sz],[x+sx,y,z+sz],[x+sx,y+sy,z+sz],[x,y+sy,z+sz]
        ];
        var faces = [[0,3,1],[1,3,2],[4,5,7],[5,6,7],[0,1,4],[1,5,4],[1,2,5],[2,6,5],[2,3,6],[3,7,6],[3,0,7],[0,4,7]];
        return faces.map(function(f){return [v[f[0]],v[f[1]],v[f[2]]];});
    }

    // ═══════════════════════════════════════════════════
    //  EXTRUSION: 2D polygon(s) → 3D triangles
    // ═══════════════════════════════════════════════════
    function _pointInPoly(pt, poly) {
        var x = pt[0], y = pt[1], inside = false;
        for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
            if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
        }
        return inside;
    }

    function _extrudeWithHoles(outer, holePolys, height, zOff) {
        zOff = zOff || 0;
        var poly = outer.slice();
        if (poly.length > 1 && poly[0][0] === poly[poly.length-1][0] && poly[0][1] === poly[poly.length-1][1])
            poly = poly.slice(0, -1);
        if (poly.length < 3) return [];
        // Build flat coordinate array + hole indices for earcut
        var flat = [], holeIndices = [], allRings = [poly];
        for (var i = 0; i < poly.length; i++) flat.push(poly[i][0], poly[i][1]);
        for (var hi = 0; hi < holePolys.length; hi++) {
            var h = holePolys[hi].slice();
            if (h.length > 1 && h[0][0] === h[h.length-1][0] && h[0][1] === h[h.length-1][1])
                h = h.slice(0, -1);
            if (h.length < 3) continue;
            holeIndices.push(flat.length / 2);
            for (var i = 0; i < h.length; i++) flat.push(h[i][0], h[i][1]);
            allRings.push(h);
        }
        var idx = triangulate(flat, holeIndices.length > 0 ? holeIndices : undefined);
        var totalPts = flat.length / 2;
        // Map from flat index to coordinate
        function getP(fi) { return [flat[fi*2], flat[fi*2+1]]; }
        var tris = [];
        var z0 = zOff, z1 = zOff + height;
        // Bottom face
        for (var i = 0; i < idx.length; i += 3) {
            var a = getP(idx[i]), b = getP(idx[i+1]), c = getP(idx[i+2]);
            tris.push([[a[0],a[1],z0],[c[0],c[1],z0],[b[0],b[1],z0]]);
        }
        // Top face
        for (var i = 0; i < idx.length; i += 3) {
            var a = getP(idx[i]), b = getP(idx[i+1]), c = getP(idx[i+2]);
            tris.push([[a[0],a[1],z1],[b[0],b[1],z1],[c[0],c[1],z1]]);
        }
        // Side faces for each ring
        for (var ri = 0; ri < allRings.length; ri++) {
            var ring = allRings[ri], n = ring.length;
            for (var i = 0; i < n; i++) {
                var j = (i+1)%n, a = ring[i], b = ring[j];
                tris.push([[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1]]);
                tris.push([[a[0],a[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]]);
            }
        }
        return tris;
    }

    function extrudePolygon(pts, height, zOff) {
        zOff = zOff || 0;
        if (!pts || pts.length < 3) return [];
        var poly = pts;
        if (poly.length > 1 && poly[0][0] === poly[poly.length-1][0] && poly[0][1] === poly[poly.length-1][1])
            poly = poly.slice(0, -1);
        var n = poly.length;
        if (n < 3) return [];
        var flat = [];
        for (var i = 0; i < n; i++) { flat.push(poly[i][0], poly[i][1]); }
        var idx = triangulate(flat);
        var tris = [];
        var z0 = zOff, z1 = zOff + height;
        for (var i = 0; i < idx.length; i += 3) {
            var a = poly[idx[i]], b = poly[idx[i+1]], c = poly[idx[i+2]];
            tris.push([[a[0],a[1],z0],[c[0],c[1],z0],[b[0],b[1],z0]]);
        }
        for (var i = 0; i < idx.length; i += 3) {
            var a = poly[idx[i]], b = poly[idx[i+1]], c = poly[idx[i+2]];
            tris.push([[a[0],a[1],z1],[b[0],b[1],z1],[c[0],c[1],z1]]);
        }
        for (var i = 0; i < n; i++) {
            var j = (i+1)%n, a = poly[i], b = poly[j];
            tris.push([[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1]]);
            tris.push([[a[0],a[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]]);
        }
        return tris;
    }

    function extrudePolygons(polys, height, zOff) {
        // Group polygons into outers and holes based on signed area.
        // Clipper returns CCW outers (positive area) and CW holes (negative area).
        if (!polys || polys.length === 0) return [];
        var outers = [], holes = [];
        for (var i = 0; i < polys.length; i++) {
            var p = polys[i]; if (!p || p.length < 3) continue;
            if (polyArea(p) >= 0) outers.push(p); else holes.push(p);
        }
        if (outers.length === 0 && holes.length === 0) return [];
        // If no holes, just extrude each outer independently
        if (holes.length === 0) {
            var all = [];
            for (var i = 0; i < outers.length; i++) all.push.apply(all, extrudePolygon(outers[i], height, zOff));
            return all;
        }
        // Assign each hole to its containing outer using point-in-polygon
        var outerHoles = outers.map(function() { return []; });
        for (var hi = 0; hi < holes.length; hi++) {
            var hp = holes[hi][0]; // test first point of hole
            var assigned = false;
            for (var oi = 0; oi < outers.length; oi++) {
                if (_pointInPoly(hp, outers[oi])) { outerHoles[oi].push(holes[hi]); assigned = true; break; }
            }
            if (!assigned && outers.length > 0) outerHoles[0].push(holes[hi]);
        }
        var all = [];
        for (var oi = 0; oi < outers.length; oi++) {
            if (outerHoles[oi].length === 0) {
                all.push.apply(all, extrudePolygon(outers[oi], height, zOff));
            } else {
                all.push.apply(all, _extrudeWithHoles(outers[oi], outerHoles[oi], height, zOff));
            }
        }
        return all;
    }

    // ═══════════════════════════════════════════════════
    //  SVG PATH → 2D POLYGON
    // ═══════════════════════════════════════════════════
    function svgPathToPolygon(d, numSeg) {
        numSeg = numSeg || 20;
        if (!d) return [];
        var pts = [];
        var re = /([MLCASZmlcasz])([^MLCASZmlcasz]*)/g;
        var m, cx = 0, cy = 0, startX = 0, startY = 0;
        while ((m = re.exec(d)) !== null) {
            var cmd = m[1];
            var raw = m[2].trim().replace(/,/g, ' ').split(/\s+/).filter(Boolean).map(Number);
            if (cmd === 'M' || cmd === 'm') {
                var x = raw[0], y = raw[1];
                if (cmd === 'm') { x += cx; y += cy; }
                cx = x; cy = y; startX = cx; startY = cy;
                pts.push([cx, cy]);
                for (var i = 2; i + 1 < raw.length; i += 2) {
                    var lx = raw[i], ly = raw[i+1];
                    if (cmd === 'm') { lx += cx; ly += cy; }
                    cx = lx; cy = ly; pts.push([cx, cy]);
                }
            } else if (cmd === 'L' || cmd === 'l') {
                for (var i = 0; i + 1 < raw.length; i += 2) {
                    var x = raw[i], y = raw[i+1];
                    if (cmd === 'l') { x += cx; y += cy; }
                    cx = x; cy = y; pts.push([cx, cy]);
                }
            } else if (cmd === 'C' || cmd === 'c') {
                for (var i = 0; i + 5 < raw.length; i += 6) {
                    var x1 = raw[i], y1 = raw[i+1], x2 = raw[i+2], y2 = raw[i+3], ex = raw[i+4], ey = raw[i+5];
                    if (cmd === 'c') { x1+=cx; y1+=cy; x2+=cx; y2+=cy; ex+=cx; ey+=cy; }
                    for (var s = 1; s <= numSeg; s++) {
                        var t = s/numSeg, mt = 1-t;
                        var px = mt*mt*mt*cx + 3*mt*mt*t*x1 + 3*mt*t*t*x2 + t*t*t*ex;
                        var py = mt*mt*mt*cy + 3*mt*mt*t*y1 + 3*mt*t*t*y2 + t*t*t*ey;
                        pts.push([px, py]);
                    }
                    cx = ex; cy = ey;
                }
            } else if (cmd === 'A' || cmd === 'a') {
                for (var i = 0; i + 6 < raw.length; i += 7) {
                    var rx = raw[i], largeArc = raw[i+3], sweepFlag = raw[i+4];
                    var ex = raw[i+5], ey = raw[i+6];
                    if (cmd === 'a') { ex += cx; ey += cy; }
                    var center = svgArcCenter(cx, cy, ex, ey, rx, sweepFlag);
                    if (center) {
                        var ccx = center[0], ccy = center[1];
                        var startA = Math.atan2(cy-ccy, cx-ccx);
                        var endA = Math.atan2(ey-ccy, ex-ccx);
                        var sweep = endA - startA;
                        if (sweepFlag === 1) {
                            if (sweep > 0) sweep -= 2*Math.PI;
                            if (largeArc === 0 && sweep < -Math.PI) sweep += 2*Math.PI;
                        } else {
                            if (sweep < 0) sweep += 2*Math.PI;
                            if (largeArc === 0 && sweep > Math.PI) sweep -= 2*Math.PI;
                        }
                        for (var s = 1; s <= numSeg; s++) {
                            var aa = startA + (s/numSeg)*sweep;
                            pts.push([ccx + rx*Math.cos(aa), ccy + rx*Math.sin(aa)]);
                        }
                    } else {
                        pts.push([ex, ey]);
                    }
                    cx = ex; cy = ey;
                }
            } else if (cmd === 'Z' || cmd === 'z') {
                if (pts.length > 0) {
                    var f = pts[0], l = pts[pts.length-1];
                    if (Math.abs(f[0]-l[0]) > 1e-6 || Math.abs(f[1]-l[1]) > 1e-6)
                        pts.push([f[0], f[1]]);
                }
                cx = startX; cy = startY;
            }
        }
        return pts;
    }

    function svgArcCenter(x1, y1, x2, y2, r, sweepFlag) {
        var dx = x2-x1, dy = y2-y1;
        var d = Math.sqrt(dx*dx + dy*dy);
        if (d > 2*r || d < 1e-9) return null;
        var a = d/2, h = Math.sqrt(r*r - a*a);
        var mx = (x1+x2)/2, my = (y1+y2)/2;
        var px = -dy/d, py = dx/d;
        return sweepFlag === 1 ? [mx+h*px, my+h*py] : [mx-h*px, my-h*py];
    }

    // ═══════════════════════════════════════════════════
    //  INFILL PATTERNS
    // ═══════════════════════════════════════════════════
    var REMIX_TYPES = ['hollow','grid','stripes','zigzag','honeycomb','circles'];

    function bufferLine(pts, hw) {
        if (pts.length < 2) return null;
        var left = [], right = [];
        for (var i = 0; i < pts.length; i++) {
            var nx, ny;
            if (i === 0) {
                var dx = pts[1][0]-pts[0][0], dy = pts[1][1]-pts[0][1];
                var len = Math.sqrt(dx*dx+dy*dy)||1;
                nx = -dy/len; ny = dx/len;
            } else if (i === pts.length-1) {
                var dx = pts[i][0]-pts[i-1][0], dy = pts[i][1]-pts[i-1][1];
                var len = Math.sqrt(dx*dx+dy*dy)||1;
                nx = -dy/len; ny = dx/len;
            } else {
                var dx1 = pts[i][0]-pts[i-1][0], dy1 = pts[i][1]-pts[i-1][1];
                var dx2 = pts[i+1][0]-pts[i][0], dy2 = pts[i+1][1]-pts[i][1];
                var l1 = Math.sqrt(dx1*dx1+dy1*dy1)||1, l2 = Math.sqrt(dx2*dx2+dy2*dy2)||1;
                nx = -(dy1/l1+dy2/l2)/2; ny = (dx1/l1+dx2/l2)/2;
                var nl = Math.sqrt(nx*nx+ny*ny)||1;
                nx /= nl; ny /= nl;
            }
            left.push([pts[i][0]+nx*hw, pts[i][1]+ny*hw]);
            right.unshift([pts[i][0]-nx*hw, pts[i][1]-ny*hw]);
        }
        return left.concat(right);
    }

    function applyInfillPattern(piecePoly, iType, params, cellGeos) {
        if (iType === 'solid' || !iType) return [piecePoly];
        var wall = parseFloat(params.infill_wall || 2.0);
        var angle = parseFloat(params.infill_angle || 0);
        var cs = String(params.corner_style || 'sharp');
        var jt = cs === 'round' ? 1 : 2;
        var innerAll = offsetPolygonAll(piecePoly, -wall, jt, 5.0);
        if (innerAll.length === 0) return [piecePoly];

        if (iType === 'hollow') return polyDifference([piecePoly], innerAll);

        var shell = polyDifference([piecePoly], innerAll);
        var b = polyBounds(piecePoly);
        var pad = Math.max(b[2]-b[0], b[3]-b[1]);

        var offX = parseFloat(params.infill_offset_x||0);
        var offY = parseFloat(params.infill_offset_y||0);
        var oX = parseFloat(params._puzzle_origin_x||0);
        var oY = parseFloat(params._puzzle_origin_y||0);
        var pW = parseFloat(params._puzzle_w_mm||0);
        var pH = parseFloat(params._puzzle_h_mm||0);
        var rcx = pW > 0 ? oX+pW/2 : (b[0]+b[2])/2;
        var rcy = pH > 0 ? oY+pH/2 : (b[1]+b[3])/2;
        var fillP = [];

        if (iType === 'grid') {
            var sp = parseFloat(params.infill_spacing||4.0);
            var fw = parseFloat(params.infill_fill_width||1.0);
            var lines = [];
            var gy = oY+offY, y = gy + Math.floor((b[1]-pad-gy)/sp)*sp;
            while (y <= b[3]+pad) { lines.push(boxPoly(b[0]-pad, y-fw/2, b[2]+pad, y+fw/2)); y += sp; }
            var gx = oX+offX, x = gx + Math.floor((b[0]-pad-gx)/sp)*sp;
            while (x <= b[2]+pad) { lines.push(boxPoly(x-fw/2, b[1]-pad, x+fw/2, b[3]+pad)); x += sp; }
            fillP = polyUnionAll(lines);
            if (angle !== 0) fillP = rotatePolys(fillP, angle, rcx, rcy);
            fillP = polyIntersection(fillP, innerAll);
        }
        else if (iType === 'stripes') {
            var sp = parseFloat(params.infill_spacing||3.0);
            var fw = parseFloat(params.infill_fill_width||1.5);
            var stride = sp + fw;
            var stripes = [];
            var gy = oY+offY, y = gy + Math.floor((b[1]-pad*2-gy)/stride)*stride;
            while (y <= b[3]+pad*2) { stripes.push(boxPoly(b[0]-pad*2, y-fw/2, b[2]+pad*2, y+fw/2)); y += stride; }
            fillP = polyUnionAll(stripes);
            if (angle !== 0) fillP = rotatePolys(fillP, angle, rcx, rcy);
            fillP = polyIntersection(fillP, innerAll);
        }
        else if (iType === 'zigzag') {
            var sp = parseFloat(params.infill_spacing||3.0);
            var fw = parseFloat(params.infill_fill_width||1.0);
            var amp = parseFloat(params.infill_amplitude||2.0);
            var zzStride = sp*2+fw;
            var zzPolys = [];
            var gy = oY+offY, y = gy + Math.floor((b[1]-pad*2-gy)/zzStride)*zzStride;
            while (y <= b[3]+pad*2) {
                var linePts = [];
                var gx = oX+offX, x = gx + Math.floor((b[0]-pad*2-gx)/sp)*sp;
                var ii = Math.round((x-gx)/sp);
                while (x <= b[2]+pad*2) { linePts.push([x, y + ((ii%2===0)?amp:-amp)]); x += sp; ii++; }
                if (linePts.length >= 2) { var bf = bufferLine(linePts, fw/2); if (bf) zzPolys.push(bf); }
                y += zzStride;
            }
            if (zzPolys.length > 0) {
                fillP = polyUnionAll(zzPolys);
                if (angle !== 0) fillP = rotatePolys(fillP, angle, rcx, rcy);
                fillP = polyIntersection(fillP, innerAll);
            }
        }
        else if (iType === 'honeycomb') {
            var cs2 = parseFloat(params.infill_cell_size||5.0);
            var fw = parseFloat(params.infill_fill_width||1.0);
            var hexR = (cs2 - fw) / Math.sqrt(3);
            var rowH = cs2 * Math.sqrt(3) / 2;
            var hexs = [];
            var gy = oY+offY, gx = oX+offX;
            var sr = Math.floor((b[1]-pad-gy)/rowH), er = Math.ceil((b[3]+pad-gy)/rowH);
            for (var ri = sr; ri <= er; ri++) {
                var yy = gy + ri * rowH;
                var xOff = (ri%2!==0) ? cs2/2 : 0;
                var sc = Math.floor((b[0]-pad-gx-xOff)/cs2), ec = Math.ceil((b[2]+pad-gx-xOff)/cs2);
                for (var ci = sc; ci <= ec; ci++) hexs.push(hexPoly(gx+xOff+ci*cs2, yy, hexR));
            }
            if (hexs.length > 0) {
                var allH = polyUnionAll(hexs);
                // Fill thin vertex-to-vertex gaps between hexagons (morphological closing)
                var vtxGap = cs2 - 2 * hexR;
                if (vtxGap > 0.01) {
                    var fillR = vtxGap / 2 + 0.02;
                    var hExp = offsetPaths(allH, fillR, 1);
                    if (hExp.length > 0) { var hShr = offsetPaths(hExp, -fillR, 1); if (hShr.length > 0) allH = hShr; }
                }
                if (angle !== 0) allH = rotatePolys(allH, angle, rcx, rcy);
                allH = polyIntersection(allH, innerAll);
                fillP = polyDifference(innerAll, allH);
            }
        }
        else if (iType === 'circles') {
            if (!cellGeos || cellGeos.length < 2) return polyDifference([piecePoly], innerAll);
            var fw = parseFloat(params.infill_fill_width||wall);
            var fillGaps = !!params.infill_fill_gaps;
            var crPct = parseFloat(params.infill_circle_radius||40)/100;
            var cFilled = params.infill_circle_filled !== false;
            var circles = [];
            for (var k = 0; k < cellGeos.length; k++) {
                var cg = cellGeos[k]; if (!cg || cg.length < 3) continue;
                var cb = polyBounds(cg);
                var rr = Math.min(cb[2]-cb[0], cb[3]-cb[1]) * crPct;
                circles.push(circlePoly((cb[0]+cb[2])/2, (cb[1]+cb[3])/2, rr, 64));
            }
            if (circles.length > 0) {
                var shapes;
                if (cFilled) { shapes = circles; }
                else {
                    shapes = [];
                    for (var k = 0; k < circles.length; k++) {
                        var inn = offsetPolygonAll(circles[k], -fw, 1);
                        if (inn.length > 0 && inn[0].length >= 3) { shapes = shapes.concat(polyDifference([circles[k]], inn)); }
                        else shapes.push(circles[k]);
                    }
                }
                var allS = polyUnionAll(shapes);
                var intS = polyIntersection(allS, innerAll);
                if (fillGaps) {
                    var allC = polyUnionAll(circles);
                    var gaps = polyDifference(innerAll, allC);
                    fillP = intS.concat(gaps);
                } else fillP = intS;
            }
        }

        if (fillP.length > 0) {
            // Union shell + fill to produce clean outer/hole polygon structure
            // (matches Python's unary_union([shell, grid_fill]))
            return polyUnionAll(shell.concat(fillP));
        }
        return shell.length > 0 ? shell : [piecePoly];
    }

    // ═══════════════════════════════════════════════════
    //  IMAGE TO GEOMETRY (custom texture)
    // ═══════════════════════════════════════════════════
    function _imageToGeometry(params, clipP) {
        var data = params.texture_image_data;
        var imgW = params.texture_image_width;
        var imgH = params.texture_image_height;
        if (!data || !imgW || !imgH) return null;

        var zoom = parseFloat(params.texture_zoom || 100) / 100;
        var offX = parseFloat(params.texture_offset_x || 0);
        var offY = parseFloat(params.texture_offset_y || 0);
        var pW = parseFloat(params._puzzle_w_mm || 0);
        var pH = parseFloat(params._puzzle_h_mm || 0);
        var oX = parseFloat(params._puzzle_origin_x || 0);
        var oY = parseFloat(params._puzzle_origin_y || 0);

        var imgWmm = pW * zoom;
        var imgHmm = pH * zoom;
        if (imgWmm <= 0 || imgHmm <= 0) return null;

        var imgOriX = oX + (pW - imgWmm) / 2 + offX;
        var imgOriY = oY + (pH - imgHmm) / 2 + offY;

        var pxPerMmX = imgW / imgWmm;
        var pxPerMmY = imgH / imgHmm;

        // Crop to clipP bounds
        var b = polyBounds(clipP[0] || clipP);
        var pxMinX = Math.max(0, Math.floor((b[0] - imgOriX) * pxPerMmX));
        var pxMinY = Math.max(0, Math.floor((b[1] - imgOriY) * pxPerMmY));
        var pxMaxX = Math.min(imgW, Math.ceil((b[2] - imgOriX) * pxPerMmX));
        var pxMaxY = Math.min(imgH, Math.ceil((b[3] - imgOriY) * pxPerMmY));
        if (pxMaxX <= pxMinX || pxMaxY <= pxMinY) return null;

        var pixWmm = 1.0 / pxPerMmX;
        var pixHmm = 1.0 / pxPerMmY;

        // Optional dilation (MaxFilter equivalent) if line thickness > 0
        var lineThk = parseInt(params.texture_line_thickness || 0);
        var mask = data; // raw grayscale array
        if (lineThk > 0) {
            var dilated = new Uint8Array(imgW * imgH);
            for (var i = 0; i < dilated.length; i++) dilated[i] = 255; // white
            var r2 = lineThk * lineThk;
            for (var dy = pxMinY; dy < pxMaxY; dy++) {
                for (var dx = pxMinX; dx < pxMaxX; dx++) {
                    if (data[dy * imgW + dx] < 128) { // source black pixel
                        for (var ky = -lineThk; ky <= lineThk; ky++) {
                            var ny = dy + ky;
                            if (ny < 0 || ny >= imgH) continue;
                            for (var kx = -lineThk; kx <= lineThk; kx++) {
                                if (kx * kx + ky * ky > r2) continue;
                                var nx = dx + kx;
                                if (nx < 0 || nx >= imgW) continue;
                                dilated[ny * imgW + nx] = 0; // black
                            }
                        }
                    }
                }
            }
            mask = dilated;
        }

        // RLE rows → rectangles
        var rects = [];
        for (var y = pxMinY; y < pxMaxY; y++) {
            var x = pxMinX;
            while (x < pxMaxX) {
                if (mask[y * imgW + x] < 128) { // black = pattern
                    var xEnd = x + 1;
                    while (xEnd < pxMaxX && mask[y * imgW + xEnd] < 128) xEnd++;
                    var mmX = x / pxPerMmX + imgOriX;
                    var mmY = y / pxPerMmY + imgOriY;
                    var mmW = (xEnd - x) * pixWmm;
                    rects.push(boxPoly(mmX, mmY, mmX + mmW, mmY + pixHmm));
                    x = xEnd;
                } else x++;
            }
        }
        if (rects.length === 0) return null;

        // Batch union for performance
        var BATCH = 5000;
        while (rects.length > 1) {
            var batched = [];
            for (var i = 0; i < rects.length; i += BATCH) {
                var chunk = rects.slice(i, i + BATCH);
                var u = polyUnionAll(chunk);
                batched = batched.concat(u);
            }
            if (batched.length >= rects.length) break; // no progress
            rects = batched;
        }
        return rects;
    }

    // ═══════════════════════════════════════════════════
    //  TEXTURE PATTERNS
    // ═══════════════════════════════════════════════════
    function generateTextureGeo(piecePoly, texType, params, cellGeos) {
        var noBorder = !!params.texture_no_border;
        var wall = noBorder ? 0 : parseFloat(params.texture_wall||2.0);
        var invert = !!params.texture_invert;
        var angle = parseFloat(params.texture_angle||0);
        var cs = String(params.corner_style||'sharp');
        var jt = cs==='round'?1:2;
        var clipP;
        if (wall > 0) {
            clipP = offsetPolygonAll(piecePoly, -wall, jt, 5.0);
            if (clipP.length === 0) return null;
        } else clipP = [piecePoly];
        var b = polyBounds(piecePoly);
        var pad = Math.max(b[2]-b[0], b[3]-b[1]);
        var offX = parseFloat(params.texture_offset_x||0);
        var offY = parseFloat(params.texture_offset_y||0);
        var oX = parseFloat(params._puzzle_origin_x||0);
        var oY = parseFloat(params._puzzle_origin_y||0);
        var pW = parseFloat(params._puzzle_w_mm||0);
        var pH = parseFloat(params._puzzle_h_mm||0);
        var rcx = pW>0?oX+pW/2:(b[0]+b[2])/2;
        var rcy = pH>0?oY+pH/2:(b[1]+b[3])/2;
        var pf = null;

        if (texType === 'grid') {
            var sp = parseFloat(params.texture_spacing||4.0);
            var fw = parseFloat(params.texture_fill_width||1.0);
            var lines = [];
            var gy = oY+offY, y = gy + Math.floor((b[1]-pad-gy)/sp)*sp;
            while (y <= b[3]+pad) { lines.push(boxPoly(b[0]-pad, y-fw/2, b[2]+pad, y+fw/2)); y += sp; }
            var gx = oX+offX, x = gx + Math.floor((b[0]-pad-gx)/sp)*sp;
            while (x <= b[2]+pad) { lines.push(boxPoly(x-fw/2, b[1]-pad, x+fw/2, b[3]+pad)); x += sp; }
            pf = polyUnionAll(lines);
            if (angle !== 0) pf = rotatePolys(pf, angle, rcx, rcy);
        }
        else if (texType === 'stripes') {
            var sp = parseFloat(params.texture_spacing||3.0);
            var fw = parseFloat(params.texture_fill_width||1.5);
            var stride = sp + fw;
            var str = [];
            var gy = oY+offY, y = gy + Math.floor((b[1]-pad*2-gy)/stride)*stride;
            while (y <= b[3]+pad*2) { str.push(boxPoly(b[0]-pad*2, y-fw/2, b[2]+pad*2, y+fw/2)); y += stride; }
            pf = polyUnionAll(str);
            if (angle !== 0) pf = rotatePolys(pf, angle, rcx, rcy);
        }
        else if (texType === 'zigzag') {
            var sp = parseFloat(params.texture_spacing||3.0);
            var fw = parseFloat(params.texture_fill_width||1.0);
            var amp = parseFloat(params.texture_amplitude||2.0);
            var zzStride = sp*2+fw;
            var zzP = [];
            var gy = oY+offY, y = gy + Math.floor((b[1]-pad*2-gy)/zzStride)*zzStride;
            while (y <= b[3]+pad*2) {
                var lp = [];
                var gx = oX+offX, x = gx + Math.floor((b[0]-pad*2-gx)/sp)*sp;
                var ii = Math.round((x-gx)/sp);
                while (x <= b[2]+pad*2) { lp.push([x, y + ((ii%2===0)?amp:-amp)]); x += sp; ii++; }
                if (lp.length >= 2) { var bf = bufferLine(lp, fw/2); if (bf) zzP.push(bf); }
                y += zzStride;
            }
            pf = polyUnionAll(zzP);
            if (angle !== 0) pf = rotatePolys(pf, angle, rcx, rcy);
        }
        else if (texType === 'honeycomb') {
            var cs2 = parseFloat(params.texture_cell_size||5.0);
            var fw = parseFloat(params.texture_fill_width||1.0);
            var hexR = (cs2-fw)/Math.sqrt(3);
            var rowH = cs2*Math.sqrt(3)/2;
            var hexs = [];
            var gy = oY+offY, gx = oX+offX;
            var sr = Math.floor((b[1]-pad-gy)/rowH), er = Math.ceil((b[3]+pad-gy)/rowH);
            for (var ri = sr; ri <= er; ri++) {
                var yy = gy+ri*rowH;
                var xOff = (ri%2!==0)?cs2/2:0;
                var sc = Math.floor((b[0]-pad-gx-xOff)/cs2), ec = Math.ceil((b[2]+pad-gx-xOff)/cs2);
                for (var ci = sc; ci <= ec; ci++) hexs.push(hexPoly(gx+xOff+ci*cs2, yy, hexR));
            }
            if (hexs.length > 0) {
                var allH = polyUnionAll(hexs);
                // Fill thin vertex-to-vertex gaps between hexagons (morphological closing)
                var vtxGap = cs2 - 2 * hexR;
                if (vtxGap > 0.01) {
                    var fillR = vtxGap / 2 + 0.02;
                    var hExp = offsetPaths(allH, fillR, 1);
                    if (hExp.length > 0) { var hShr = offsetPaths(hExp, -fillR, 1); if (hShr.length > 0) allH = hShr; }
                }
                if (angle !== 0) allH = rotatePolys(allH, angle, rcx, rcy);
                var allHC = polyIntersection(allH, clipP);
                pf = polyDifference(clipP, allHC);
                if (invert) pf = polyDifference(clipP, pf);
                return pf.length > 0 ? pf : null;
            }
        }
        else if (texType === 'circles') {
            if (!cellGeos || cellGeos.length < 2) return null;
            var fw = parseFloat(params.texture_fill_width||2.0);
            var crPct = parseFloat(params.texture_circle_radius||40)/100;
            var cFilled = params.texture_circle_filled !== false;
            var circles = [];
            for (var k = 0; k < cellGeos.length; k++) {
                var cg = cellGeos[k]; if (!cg||cg.length<3) continue;
                var cb = polyBounds(cg);
                var rr = Math.min(cb[2]-cb[0], cb[3]-cb[1])*crPct;
                circles.push(circlePoly((cb[0]+cb[2])/2, (cb[1]+cb[3])/2, rr, 64));
            }
            if (circles.length > 0) {
                var shapes;
                if (cFilled) shapes = circles;
                else {
                    shapes = [];
                    for (var k = 0; k < circles.length; k++) {
                        var inn = offsetPolygonAll(circles[k], -fw, 1);
                        if (inn.length > 0) shapes = shapes.concat(polyDifference([circles[k]], inn));
                        else shapes.push(circles[k]);
                    }
                }
                pf = polyIntersection(polyUnionAll(shapes), clipP);
                if (invert) pf = polyDifference(clipP, pf);
                return pf.length > 0 ? pf : null;
            }
        }
        else if (texType === 'solid') {
            pf = clipP;
        }
        else if (texType === 'custom') {
            var rawGeo = _imageToGeometry(params, clipP);
            if (rawGeo && rawGeo.length > 0) {
                pf = polyIntersection(rawGeo, clipP);
                if (invert) pf = polyDifference(clipP, pf);
                return pf.length > 0 ? pf : null;
            }
            return null;
        }

        if (!pf || pf.length === 0) return null;
        pf = polyIntersection(pf, clipP);
        if (invert) pf = polyDifference(clipP, pf);
        return pf.length > 0 ? pf : null;
    }

    // ═══════════════════════════════════════════════════
    //  CORNER ROUNDING
    // ═══════════════════════════════════════════════════
    function applyCornerRounding(poly, cr, isJigsaw) {
        if (isJigsaw) {
            var jr = Math.min(cr, 0.5);
            var origA = Math.abs(polyArea(poly));
            var s1 = offsetPolygon(poly, -jr, 1);
            if (s1.length < 3) return poly;
            var s2 = offsetPolygon(s1, jr, 1);
            if (s2.length < 3) return poly;
            return Math.abs(polyArea(s2)) > origA * 0.85 ? s2 : poly;
        }
        var origA = Math.abs(polyArea(poly));
        var r1 = offsetPolygon(poly, -cr, 1);
        if (r1.length < 3) return poly;
        r1 = offsetPolygon(r1, cr, 1);
        if (r1.length < 3 || Math.abs(polyArea(r1)) < origA * 0.8) return poly;
        r1 = offsetPolygon(r1, cr, 1);
        if (r1.length < 3) return poly;
        r1 = offsetPolygon(r1, -cr, 1);
        if (r1.length < 3 || Math.abs(polyArea(r1)) < origA * 0.8) return poly;
        return r1;
    }

    // ═══════════════════════════════════════════════════
    //  BASE GENERATION (normal puzzle)
    // ═══════════════════════════════════════════════════
    function generateBase(grid, cubeSize, border, baseThk, wallH, params) {
        var M = grid.length, N = grid[0].length;
        var bW = N*cubeSize + 2*border, bL = M*cubeSize + 2*border;
        var bcs = String((params||{}).base_corner_style || 'sharp');
        var bcr = parseFloat((params||{}).base_corner_radius || 2.0);
        var bcri = parseFloat((params||{}).base_corner_radius_inner || 0.0);
        var outerRect = boxPoly(0, 0, bW, bL);
        var innerRect = boxPoly(border, border, bW-border, bL-border);
        if (bcs === 'round' && bcr > 0) {
            var rr = offsetPolygon(outerRect, -bcr, 1);
            if (rr.length >= 3) { var rr2 = offsetPolygon(rr, bcr, 1); if (rr2.length >= 3) outerRect = rr2; }
        }
        // Round inner pocket corners BEFORE computing wallParts (avoids
        // destructive morphological operations on thin wall geometry).
        if (bcs === 'round' && bcri > 0) {
            var ir1 = offsetPolygon(innerRect, -bcri, 1);
            if (ir1.length >= 3) {
                var ir2 = offsetPolygon(ir1, bcri, 1);
                if (ir2.length >= 3) innerRect = ir2;
            }
        }
        var wallParts = polyDifference([outerRect], [innerRect]);
        var blocked = [];
        for (var r = 0; r < M; r++)
            for (var c = 0; c < N; c++)
                if (grid[r][c] === 0) {
                    var x = border+c*cubeSize, y = border+r*cubeSize;
                    blocked.push(boxPoly(x, y, x+cubeSize, y+cubeSize));
                }
        if (blocked.length > 0) wallParts = polyUnionAll(wallParts.concat(blocked));
        var tris = [];
        tris.push.apply(tris, extrudePolygon(outerRect, baseThk, 0));
        tris.push.apply(tris, extrudePolygons(wallParts, wallH, baseThk));
        return tris;
    }

    // ═══════════════════════════════════════════════════
    //  BASE GENERATION (fractal/jigsaw)
    // ═══════════════════════════════════════════════════
    function buildTruncClip(params, scale) {
        if (!params) return null;
        var te = !!params.truncate_edge;
        var pt = String(params.puzzle_type||'fractal');
        var jt = String(params.jigsaw_type||'rectangular');
        if (!te || pt !== 'jigsaw' || (jt !== 'hexagonal' && jt !== 'circular')) return null;
        var hr = parseFloat(params.hex_radius||0); if (hr <= 0) return null;
        var ho = parseFloat(params.hex_offset||0);
        var cx = (hr+ho)*scale, cy = (hr+ho)*scale, r = hr*scale;
        if (jt === 'circular') return circlePoly(cx, cy, r, 64);
        var pts = [];
        for (var i = 0; i < 6; i++) { var a = Math.PI - i*Math.PI/3; pts.push([cx+r*Math.cos(a), cy+r*Math.sin(a)]); }
        return pts;
    }

    function generateFractalBase(svgPaths, ncols, nrows, cubeSize, border, baseThk, wallH, params, scale, minX, minY) {
        var puzzleW = ncols*cubeSize, puzzleH = nrows*cubeSize;
        var bW = puzzleW+2*border, bL = puzzleH+2*border;
        var bcs = String((params||{}).base_corner_style||'sharp');
        var bcr = parseFloat((params||{}).base_corner_radius||2.0);
        var bcri = parseFloat((params||{}).base_corner_radius_inner||0.0);
        var contoured = !!(params||{}).contoured_base;
        var jt = String((params||{}).jigsaw_type||'rectangular');
        var fillBG = (params||{}).fill_border_gaps !== false;
        var outerRect, innerRect;
        if (contoured && (jt === 'hexagonal' || jt === 'circular')) {
            var cxB = bW/2, cyB = bL/2;
            var tol = parseFloat((params||{}).tolerance_mm || 0.3);
            var cl = Math.max(tol, 0.5);
            var rIn = Math.min(puzzleW, puzzleH)/2 + cl;
            var rOut = rIn + border;
            if (jt === 'circular') { outerRect = circlePoly(cxB, cyB, rOut, 64); innerRect = circlePoly(cxB, cyB, rIn, 64); }
            else {
                outerRect = []; innerRect = [];
                for (var i = 0; i < 6; i++) {
                    var a = Math.PI - i*Math.PI/3;
                    outerRect.push([cxB+rOut*Math.cos(a), cyB+rOut*Math.sin(a)]);
                    innerRect.push([cxB+rIn*Math.cos(a), cyB+rIn*Math.sin(a)]);
                }
            }
        } else {
            outerRect = boxPoly(0, 0, bW, bL);
            innerRect = boxPoly(border, border, bW-border, bL-border);
            if (bcs === 'round' && bcr > 0) {
                var rr = offsetPolygon(outerRect, -bcr, 1);
                if (rr.length >= 3) { var rr2 = offsetPolygon(rr, bcr, 1); if (rr2.length >= 3) outerRect = rr2; }
            }
        }
        // Round inner pocket corners BEFORE computing wallParts
        if (bcs === 'round' && bcri > 0) {
            var ir1 = offsetPolygon(innerRect, -bcri, 1);
            if (ir1.length >= 3) {
                var ir2 = offsetPolygon(ir1, bcri, 1);
                if (ir2.length >= 3) innerRect = ir2;
            }
        }
        var wallParts = polyDifference([outerRect], [innerRect]);
        if (fillBG && svgPaths) {
            var clipMm = buildTruncClip(params, scale);
            var ppInBase = [];
            for (var k = 0; k < svgPaths.length; k++) {
                var dd = svgPaths[k]; if (!dd) continue;
                var raw = svgPathToPolygon(dd, 20);
                if (raw.length < 3) continue;
                var based = raw.map(function(p) { return [border + (p[0]-minX)*scale, border + (p[1]-minY)*scale]; });
                if (clipMm) {
                    var clipOff = clipMm.map(function(p) { return [p[0]+border, p[1]+border]; });
                    var cl2 = polyIntersection([based], [clipOff]);
                    if (cl2.length > 0) ppInBase = ppInBase.concat(cl2);
                } else ppInBase.push(based);
            }
            if (ppInBase.length > 0) {
                var pU = polyUnionAll(ppInBase);
                var gapA = polyDifference([innerRect], pU);
                if (gapA.length > 0) wallParts = polyUnionAll(wallParts.concat(gapA));
            }
        }
        var tris = [];
        tris.push.apply(tris, extrudePolygon(outerRect, baseThk, 0));
        tris.push.apply(tris, extrudePolygons(wallParts, wallH, baseThk));
        return tris;
    }

    // ═══════════════════════════════════════════════════
    //  REMIX DEFAULTS
    // ═══════════════════════════════════════════════════
    var REMIX_DEFAULTS = {
        hollow: {infill_wall:2.0},
        grid: {infill_wall:1.5,infill_fill_width:1.0,infill_spacing:4.0,infill_angle:0},
        stripes: {infill_wall:1.5,infill_fill_width:1.5,infill_spacing:3.0,infill_angle:0},
        zigzag: {infill_wall:1.5,infill_fill_width:1.0,infill_spacing:3.0,infill_amplitude:2.0,infill_angle:0},
        honeycomb: {infill_wall:1.5,infill_fill_width:1.0,infill_cell_size:5.0,infill_angle:0},
        circles: {infill_wall:1.5,infill_fill_width:1.5,infill_fill_gaps:true,infill_circle_radius:40,infill_circle_filled:true},
    };
    function getRemixDefaults(rType, parentP) {
        var d = {};
        var dd = REMIX_DEFAULTS[rType] || {};
        for (var k in dd) d[k] = dd[k];
        if (parentP) { ['corner_style','corner_radius','_puzzle_origin_x','_puzzle_origin_y','_puzzle_w_mm','_puzzle_h_mm'].forEach(function(k){if (k in parentP) d[k]=parentP[k];}); }
        return d;
    }

    // ═══════════════════════════════════════════════════
    //  FINALIZE: center + X-mirror + build STL blobs
    // ═══════════════════════════════════════════════════
    function finalize(baseTris, pieceTris, reliefTris, returnSeparate, returnRaw) {
        var all = baseTris.concat(pieceTris).concat(reliefTris);
        if (all.length === 0) {
            if (returnRaw) return {base:[], pieces:[], relief:[]};
            if (returnSeparate) return {base:null, pieces:null, relief:null};
            return buildBinarySTL([]);
        }
        var mnX=Infinity, mnY=Infinity, mnZ=Infinity, mxX=-Infinity, mxY=-Infinity, mxZ=-Infinity;
        for (var i = 0; i < all.length; i++) {
            for (var j = 0; j < 3; j++) {
                var v = all[i][j];
                if (v[0]<mnX) mnX=v[0]; if (v[0]>mxX) mxX=v[0];
                if (v[1]<mnY) mnY=v[1]; if (v[1]>mxY) mxY=v[1];
                if (v[2]<mnZ) mnZ=v[2]; if (v[2]>mxZ) mxZ=v[2];
            }
        }
        var cx=(mnX+mxX)/2, cy=(mnY+mxY)/2, cz=(mnZ+mxZ)/2;
        function xform(tris) {
            return tris.map(function(tri) {
                var a = [-(tri[0][0]-cx), tri[0][1]-cy, tri[0][2]-cz];
                var b = [-(tri[1][0]-cx), tri[1][1]-cy, tri[1][2]-cz];
                var c = [-(tri[2][0]-cx), tri[2][1]-cy, tri[2][2]-cz];
                return [a, c, b]; // reverse winding for mirror
            });
        }
        if (returnRaw) {
            return {
                base: baseTris.length > 0 ? xform(baseTris) : [],
                pieces: pieceTris.length > 0 ? xform(pieceTris) : [],
                relief: reliefTris.length > 0 ? xform(reliefTris) : [],
            };
        }
        if (returnSeparate) {
            return {
                base: baseTris.length > 0 ? buildBinarySTL(xform(baseTris)) : null,
                pieces: pieceTris.length > 0 ? buildBinarySTL(xform(pieceTris)) : null,
                relief: reliefTris.length > 0 ? buildBinarySTL(xform(reliefTris)) : null,
            };
        }
        return buildBinarySTL(xform(all));
    }

    // ═══════════════════════════════════════════════════
    //  EXPORT: Normal Puzzle
    // ═══════════════════════════════════════════════════
    function exportNormalPuzzle(grid, pieces, opts) {
        var cubeSize = opts.cube_size||10, height = opts.height||2;
        var gapMm = opts.gap_mm||5, tolMm = opts.tolerance_mm||0.3;
        var border = opts.border||5, baseThk = opts.base_thickness||1;
        var wallH = opts.wall_height||2;
        var assembled = opts.assembled||false;
        var incP = opts.include_pieces !== false, incB = opts.include_base !== false;
        var iType = opts.infill_type||'solid';
        var infP = {}; for (var k in opts) infP[k] = opts[k];
        var retSep = opts.return_separate||false;
        var retRaw = opts.return_raw||false;
        var M = grid.length, N = grid[0].length;
        var bW = N*cubeSize + 2*border;

        var baseTris = [];
        if (incB) baseTris = generateBase(grid, cubeSize, border, baseThk, wallH, opts);

        // Pieces are ALWAYS placed beside the base (galX offset)
        var galX = bW + 10, galY = 0;

        // Compute pocket polygon for base inner corner rounding → piece clipping
        var pocketPoly = null;
        if (assembled) {
            var bcs = String(opts.base_corner_style||'sharp');
            var bcri = parseFloat(opts.base_corner_radius_inner||0);
            if (bcs === 'round' && bcri > 0) {
                var pocketRect = boxPoly(galX, galY, galX + N*cubeSize, galY + M*cubeSize);
                var ps1 = offsetPolygon(pocketRect, -bcri, 1);
                if (ps1.length >= 3) {
                    var ps2 = offsetPolygon(ps1, bcri, 1);
                    if (ps2.length >= 3) pocketPoly = ps2;
                }
            }
        }

        var allPT = [], allRT = [];
        if (incP && pieces.length > 0) {
            var pzOff = 0; // Pieces always at z=0, beside the base
            var maxWC = 0, maxHC = 0;
            for (var i = 0; i < pieces.length; i++) {
                var p = pieces[i], rMin=Infinity, rMax=-Infinity, cMin=Infinity, cMax=-Infinity;
                for (var j=0;j<p.length;j++) {
                    if (p[j][0]<rMin) rMin=p[j][0]; if (p[j][0]>rMax) rMax=p[j][0];
                    if (p[j][1]<cMin) cMin=p[j][1]; if (p[j][1]>cMax) cMax=p[j][1];
                }
                var wc = cMax-cMin+1, hc = rMax-rMin+1;
                if (wc > maxWC) maxWC = wc; if (hc > maxHC) maxHC = hc;
            }
            var strX = maxWC*cubeSize + gapMm;
            var strY = maxHC*cubeSize + gapMm;

            for (var idx = 0; idx < pieces.length; idx++) {
                var piece = pieces[idx];
                var baseX, baseY, minR, minC;
                if (assembled) { baseX = galX; baseY = galY; minR = 0; minC = 0; }
                else {
                    var col = idx%3, row = Math.floor(idx/3);
                    baseX = galX + col*strX; baseY = galY + row*strY;
                    minR = Infinity; minC = Infinity;
                    for (var j=0;j<piece.length;j++) { if (piece[j][0]<minR)minR=piece[j][0]; if (piece[j][1]<minC)minC=piece[j][1]; }
                }
                var cellBoxes = [];
                for (var j = 0; j < piece.length; j++) {
                    var r = piece[j][0], c = piece[j][1];
                    var cx2, cy2;
                    if (assembled) { cx2 = baseX + c*cubeSize; cy2 = baseY + r*cubeSize; }
                    else { cx2 = baseX + (c-minC)*cubeSize; cy2 = baseY + (r-minR)*cubeSize; }
                    cellBoxes.push(boxPoly(cx2, cy2, cx2+cubeSize, cy2+cubeSize));
                }
                var uPoly = polyUnionAll(cellBoxes);
                if (uPoly.length === 0) continue;
                var mainP = uPoly[0], mainA = Math.abs(polyArea(mainP));
                for (var i = 1; i < uPoly.length; i++) {
                    var aa = Math.abs(polyArea(uPoly[i]));
                    if (aa > mainA) { mainP = uPoly[i]; mainA = aa; }
                }
                if (tolMm > 0) {
                    var shrunk = offsetPolygon(mainP, -tolMm/2, 2, 5.0);
                    if (shrunk.length >= 3 && Math.abs(polyArea(shrunk)) > 1e-6) mainP = shrunk;
                    else continue;
                }
                if (opts.corner_style === 'round') {
                    var cr = parseFloat(opts.corner_radius||1.0);
                    mainP = applyCornerRounding(mainP, cr, false);
                    if (mainP.length < 3) continue;
                }
                // Clip piece to pocket shape (for base inner corner rounding)
                if (pocketPoly && assembled) {
                    var clipped = polyIntersection([mainP], [pocketPoly]);
                    if (clipped.length > 0 && clipped[0].length >= 3) mainP = clipped[0];
                }
                infP._puzzle_w_mm = N*cubeSize; infP._puzzle_h_mm = M*cubeSize;
                infP._puzzle_origin_x = assembled ? galX : (baseX-minC*cubeSize);
                infP._puzzle_origin_y = assembled ? galY : (baseY-minR*cubeSize);

                var acabados = opts.acabados_mode || 'infill';
                try {
                    if (acabados === 'texture') {
                        _applyTexture(mainP, opts, infP, cellBoxes, height, allPT, allRT, pzOff);
                    } else {
                        var finalP;
                        if (iType === 'remix') {
                            var ri = idx % REMIX_TYPES.length;
                            var rd = getRemixDefaults(REMIX_TYPES[ri], infP);
                            finalP = applyInfillPattern(mainP, REMIX_TYPES[ri], rd, cellBoxes);
                        } else if (iType !== 'solid') {
                            finalP = applyInfillPattern(mainP, iType, infP, cellBoxes);
                        } else {
                            finalP = [mainP];
                        }
                        allPT.push.apply(allPT, extrudePolygons(finalP, height, pzOff));
                    }
                } catch(e) { console.warn('[STL] normal piece', idx, e); }
            }
        }
        return finalize(baseTris, allPT, allRT, retSep, retRaw);
    }

    // Shared texture application logic
    function _applyTexture(mainP, opts, infP, cellGeos, height, outPT, outRT, zOff) {
        zOff = zOff || 0;
        var texType = String(opts.texture_type||'grid');
        var texDir = String(opts.texture_direction||'outward');
        var texH = parseFloat(opts.texture_height||0.5);
        var texGeo = generateTextureGeo(mainP, texType, infP, cellGeos);
        if (texDir === 'outward') {
            outPT.push.apply(outPT, extrudePolygon(mainP, height, zOff));
            if (texGeo) outRT.push.apply(outRT, extrudePolygons(texGeo, texH, height + zOff));
        } else if (texDir === 'flush') {
            if (texGeo) {
                var nonTex = polyDifference([mainP], texGeo);
                // Base slab at (height - texH) to avoid z-fighting
                outPT.push.apply(outPT, extrudePolygon(mainP, height - texH, zOff));
                // Non-texture area raised to full height (piece color)
                if (nonTex.length > 0) outPT.push.apply(outPT, extrudePolygons(nonTex, texH, height - texH + zOff));
                // Texture area raised to full height (relief color)
                outRT.push.apply(outRT, extrudePolygons(texGeo, texH, height - texH + zOff));
            } else outPT.push.apply(outPT, extrudePolygon(mainP, height, zOff));
        } else { // inward / engrave
            var engD = texH;
            var baseH = Math.max(height - engD, 0.1);
            var colD = Math.min(parseFloat(opts.texture_engrave_depth||0.4), height - 0.1);
            var rZ = Math.max(baseH - colD, 0);
            if (texGeo) {
                var nonCarved = polyDifference([mainP], texGeo);
                // Bottom slab under the channel (piece color)
                outPT.push.apply(outPT, extrudePolygon(mainP, rZ, zOff));
                // Non-carved columns from rZ to full height (piece color)
                if (nonCarved.length > 0) outPT.push.apply(outPT, extrudePolygons(nonCarved, height - rZ, rZ + zOff));
                // Relief color at bottom of carved channel (rZ to baseH)
                if (baseH > rZ) outRT.push.apply(outRT, extrudePolygons(texGeo, baseH - rZ, rZ + zOff));
            } else {
                outPT.push.apply(outPT, extrudePolygon(mainP, height, zOff));
            }
        }
    }

    // ═══════════════════════════════════════════════════
    //  EXPORT: Fractal / Jigsaw Puzzle
    // ═══════════════════════════════════════════════════
    function exportSvgPuzzle(puzzleData, opts) {
        var svgPaths = puzzleData.svg_paths;
        var ncols = puzzleData.ncols, nrows = puzzleData.nrows;
        var pieceCells = puzzleData.pieces;
        var cubeSize = opts.cube_size||10, height = opts.height||2;
        var gapMm = opts.gap_mm||5, tolMm = opts.tolerance_mm||0.3;
        var border = opts.border||5, baseThk = opts.base_thickness||1;
        var wallH = opts.wall_height||2;
        var assembled = opts.assembled||false;
        var incP = opts.include_pieces !== false, incB = opts.include_base !== false;
        var iType = opts.infill_type||'solid';
        var infP = {}; for (var k in opts) infP[k] = opts[k];
        var retSep = opts.return_separate||false;
        var retRaw = opts.return_raw||false;
        var puzzleType = opts.puzzle_type || puzzleData.puzzle_type || 'fractal';
        var cs2 = puzzleType === 'jigsaw' ? 1.0 : 2.0;
        var minX = 0, minY = 0;
        var rawW = ncols*cs2, rawH = nrows*cs2;
        var puzzleW = ncols*cubeSize, puzzleH = nrows*cubeSize;
        var scale = Math.min(puzzleW/rawW, puzzleH/rawH);
        var bW = puzzleW + 2*border;

        // Copy jigsaw params from puzzleData for truncate/contoured
        if (puzzleData.jigsaw_type) { opts.jigsaw_type = puzzleData.jigsaw_type; infP.jigsaw_type = puzzleData.jigsaw_type; }
        if (puzzleData.hex_radius) { opts.hex_radius = puzzleData.hex_radius; infP.hex_radius = puzzleData.hex_radius; }
        if (puzzleData.hex_offset !== undefined) { opts.hex_offset = puzzleData.hex_offset; infP.hex_offset = puzzleData.hex_offset; }
        if (puzzleData.truncate_edge) { opts.truncate_edge = puzzleData.truncate_edge; infP.truncate_edge = puzzleData.truncate_edge; }

        var clipMm = buildTruncClip(opts, scale);

        var baseTris = [];
        if (incB) baseTris = generateFractalBase(svgPaths, ncols, nrows, cubeSize, border, baseThk, wallH, opts, scale, minX, minY);

        // Pieces are ALWAYS placed beside the base (galX offset)
        var galX = bW + 10, galY = 0;

        // Compute pocket polygon for jigsaw base-corner rounding → piece clipping
        var pocketPoly = null;
        if (puzzleType === 'jigsaw' && assembled) {
            var bcs = String(opts.base_corner_style||'sharp');
            var bcri = parseFloat(opts.base_corner_radius_inner||0);
            if (bcs === 'round' && bcri > 0) {
                var pocketRect = boxPoly(galX, galY, puzzleW+galX, puzzleH+galY);
                // Opening rounds convex corners of the pocket (= the concave base wall corners)
                var ps1 = offsetPolygon(pocketRect, -bcri, 1);
                if (ps1.length >= 3) {
                    var ps2 = offsetPolygon(ps1, bcri, 1);
                    if (ps2.length >= 3) pocketPoly = ps2;
                }
            }
        }

        var pzOff = 0; // Pieces always at z=0, beside the base
        var allPT = [], allRT = [];
        if (incP) {
            var rawPolys = svgPaths.map(function(d) {
                var pts = svgPathToPolygon(d, 20);
                return pts.length >= 3 ? pts : null;
            });
            var piecePolys = [], pieceSizes = [];
            for (var idx = 0; idx < rawPolys.length; idx++) {
                var rp = rawPolys[idx];
                if (!rp) { piecePolys.push(null); pieceSizes.push(null); continue; }
                var scaled = rp.map(function(p) { return [(p[0]-minX)*scale, (p[1]-minY)*scale]; });
                if (clipMm) {
                    var clipped = polyIntersection([scaled], [clipMm]);
                    if (clipped.length === 0 || clipped[0].length < 3) { piecePolys.push(null); pieceSizes.push(null); continue; }
                    scaled = clipped[0];
                }
                var xs = scaled.map(function(p){return p[0];}), ys = scaled.map(function(p){return p[1];});
                piecePolys.push(scaled);
                pieceSizes.push({w:Math.max.apply(null,xs)-Math.min.apply(null,xs), h:Math.max.apply(null,ys)-Math.min.apply(null,ys), idx:idx});
            }
            var valP = pieceSizes.filter(Boolean);
            valP.sort(function(a,b){return b.h-a.h;});
            var tArea = valP.reduce(function(s,v){return s+v.w*v.h;},0);
            var sW = Math.max(Math.sqrt(tArea)*1.2, Math.max.apply(null, valP.map(function(v){return v.w;}))+gapMm);
            var placements = {};
            var shX = 0, shY = 0, shH = 0;
            for (var k = 0; k < valP.length; k++) {
                var vi = valP[k];
                if (shX + vi.w + gapMm > sW && shX > 0) { shY += shH + gapMm; shX = 0; shH = 0; }
                placements[vi.idx] = [shX, shY];
                shX += vi.w + gapMm; shH = Math.max(shH, vi.h);
            }

            for (var idx = 0; idx < piecePolys.length; idx++) {
                var pp = piecePolys[idx];
                if (!pp || pp.length < 3) continue;
                if (!assembled && !(idx in placements)) continue;
                var xs = pp.map(function(p){return p[0];}), ys = pp.map(function(p){return p[1];});
                var pMinX = Math.min.apply(null,xs), pMinY = Math.min.apply(null,ys);
                var translated, bx, by;
                if (assembled) {
                    translated = pp.map(function(p){return [p[0]+galX, p[1]+galY];});
                    bx = galX; by = galY;
                } else {
                    var pl = placements[idx];
                    bx = galX + pl[0]; by = galY + pl[1];
                    translated = pp.map(function(p){return [p[0]-pMinX+bx+tolMm/2, p[1]-pMinY+by+tolMm/2];});
                }
                if (tolMm > 0) {
                    var shrunk = offsetPolygon(translated, -tolMm/2, 1);
                    if (shrunk.length >= 3 && Math.abs(polyArea(shrunk)) > 1e-6) translated = shrunk;
                    else continue;
                }
                // Clip jigsaw pieces to the pocket shape (for base inner corner rounding)
                if (pocketPoly && assembled) {
                    var clipped = polyIntersection([translated], [pocketPoly]);
                    if (clipped.length > 0 && clipped[0].length >= 3) translated = clipped[0];
                }
                if (opts.corner_style === 'round') {
                    var cr = parseFloat(opts.corner_radius||1.0);
                    translated = applyCornerRounding(translated, cr, puzzleType === 'jigsaw');
                    if (translated.length < 3) continue;
                }
                // Cell geometries for circles pattern
                var cellGeos = null;
                var acabados = opts.acabados_mode || 'infill';
                var texTC = String(opts.texture_type||'grid');
                var needCells = (iType==='circles') || (acabados==='texture' && texTC==='circles');
                if (needCells && pieceCells && idx < pieceCells.length) {
                    cellGeos = [];
                    var tileRadS = 1.0 * scale;
                    for (var j = 0; j < pieceCells[idx].length; j++) {
                        var rc = pieceCells[idx][j];
                        var rawCx = rc[1]*2+1, rawCy = rc[0]*2+1;
                        var scCx = (rawCx-minX)*scale, scCy = (rawCy-minY)*scale;
                        var tcX, tcY;
                        if (assembled) { tcX = scCx+galX; tcY = scCy+galY; }
                        else { tcX = scCx-pMinX+bx+tolMm/2; tcY = scCy-pMinY+by+tolMm/2; }
                        cellGeos.push(circlePoly(tcX, tcY, tileRadS, 80));
                    }
                }
                infP._puzzle_w_mm = puzzleW; infP._puzzle_h_mm = puzzleH;
                if (assembled) { infP._puzzle_origin_x = galX; infP._puzzle_origin_y = galY; }
                else { infP._puzzle_origin_x = bx-pMinX+tolMm/2; infP._puzzle_origin_y = by-pMinY+tolMm/2; }

                try {
                    if (acabados === 'texture') {
                        _applyTexture(translated, opts, infP, cellGeos, height, allPT, allRT, pzOff);
                    } else {
                        var finalP;
                        if (iType === 'remix') {
                            var ri = idx % REMIX_TYPES.length;
                            var rd = getRemixDefaults(REMIX_TYPES[ri], infP);
                            finalP = applyInfillPattern(translated, REMIX_TYPES[ri], rd, cellGeos);
                        } else if (iType !== 'solid') {
                            finalP = applyInfillPattern(translated, iType, infP, cellGeos);
                        } else {
                            finalP = [translated];
                        }
                        allPT.push.apply(allPT, extrudePolygons(finalP, height, pzOff));
                    }
                } catch(e) { console.warn('[STL] svg piece', idx, e); }
            }
        }
        return finalize(baseTris, allPT, allRT, retSep, retRaw);
    }

    // ═══════════════════════════════════════════════════
    //  PUBLIC API
    // ═══════════════════════════════════════════════════
    function exportSTL(puzzleData, opts) {
        var pt = puzzleData.puzzle_type || 'normal';
        if (pt === 'fractal' || pt === 'jigsaw') return exportSvgPuzzle(puzzleData, opts);
        return exportNormalPuzzle(puzzleData.grid, puzzleData.pieces, opts);
    }

    function exportSTLSeparate(puzzleData, opts) {
        opts = {}; for (var k in arguments[1]) opts[k] = arguments[1][k];
        opts.return_separate = true;
        var pt = puzzleData.puzzle_type || 'normal';
        if (pt === 'fractal' || pt === 'jigsaw') return exportSvgPuzzle(puzzleData, opts);
        return exportNormalPuzzle(puzzleData.grid, puzzleData.pieces, opts);
    }

    function export3MF(puzzleData, opts) {
        var o = {}; for (var k in opts) o[k] = opts[k];
        o.return_raw = true;
        var pt = puzzleData.puzzle_type || 'normal';
        var raw;
        if (pt === 'fractal' || pt === 'jigsaw') raw = exportSvgPuzzle(puzzleData, o);
        else raw = exportNormalPuzzle(puzzleData.grid, puzzleData.pieces, o);

        // Gather parts
        var parts = []; // {name, tris, extruder}
        if (raw.base && raw.base.length > 0) parts.push({name:'Base', tris:raw.base, extruder:1});
        if (raw.pieces && raw.pieces.length > 0) parts.push({name:'Pieces', tris:raw.pieces, extruder:2});
        if (raw.relief && raw.relief.length > 0) parts.push({name:'Relief', tris:raw.relief, extruder:3});
        if (parts.length === 0) return buildBinarySTL([]); // fallback

        // Colors
        var baseCol = String(opts.color_base || '#808080');
        var pieceCol = String(opts.color_pieces || '#6699CC');
        var reliefCol = String(opts.color_relief || '#FF6633');
        var colors = [baseCol, pieceCol, reliefCol].map(function(c) {
            return c.length === 7 ? c + 'FF' : c;
        });

        // Convert triangles arrays to 3MF vertex/triangle data
        function trisToMesh(tris) {
            var vMap = {}, verts = [], faces = [];
            for (var i = 0; i < tris.length; i++) {
                var tri = tris[i], fi = [];
                for (var j = 0; j < 3; j++) {
                    var v = tri[j];
                    var key = v[0].toFixed(6) + ',' + v[1].toFixed(6) + ',' + v[2].toFixed(6);
                    if (!(key in vMap)) { vMap[key] = verts.length; verts.push(v); }
                    fi.push(vMap[key]);
                }
                faces.push(fi);
            }
            return {verts:verts, faces:faces};
        }

        // Build mesh XML for a sub-object
        function meshXML(mesh, oid, uuid) {
            var x = '  <object id="' + oid + '" p:UUID="' + uuid + '" type="model">\n   <mesh>\n    <vertices>\n';
            for (var i = 0; i < mesh.verts.length; i++) {
                var v = mesh.verts[i];
                x += '   <vertex x="' + v[0].toFixed(6) + '" y="' + v[1].toFixed(6) + '" z="' + v[2].toFixed(6) + '" />\n';
            }
            x += '    </vertices>\n    <triangles>\n';
            for (var i = 0; i < mesh.faces.length; i++) {
                var f = mesh.faces[i];
                x += '   <triangle v1="' + f[0] + '" v2="' + f[1] + '" v3="' + f[2] + '" />\n';
            }
            x += '    </triangles>\n   </mesh>\n  </object>\n';
            return x;
        }

        function uuid4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0; return (c==='x'?r:(r&0x3|0x8)).toString(16);
            });
        }

        // Compute z-offset: shift all parts so min-z = 0
        var minZ = Infinity;
        for (var pi = 0; pi < parts.length; pi++) {
            var tris = parts[pi].tris;
            for (var i = 0; i < tris.length; i++)
                for (var j = 0; j < 3; j++)
                    if (tris[i][j][2] < minZ) minZ = tris[i][j][2];
        }
        var zOff = -minZ;

        // Build sub-object model
        var subResources = '';
        for (var pi = 0; pi < parts.length; pi++) {
            var mesh = trisToMesh(parts[pi].tris);
            parts[pi].oid = pi + 1;
            parts[pi].uuid = uuid4();
            subResources += meshXML(mesh, parts[pi].oid, parts[pi].uuid);
        }

        var subModel = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<model unit="millimeter" xml:lang="en-US"\n' +
            '  xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"\n' +
            '  xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06">\n' +
            ' <resources>\n' + subResources + ' </resources>\n <build/>\n</model>';

        // Build root assembly model
        var assemblyUUID = uuid4();
        var components = '';
        var transform = '-1 0 0 0 -1 0 0 0 1 0 0 ' + zOff.toFixed(6);
        for (var pi = 0; pi < parts.length; pi++) {
            components += '    <component p:path="/3D/Objects/Object_1.model" objectid="' + parts[pi].oid +
                '" p:UUID="{' + uuid4() + '}" transform="' + transform + '"/>\n';
        }

        var rootModel = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<model unit="millimeter" xml:lang="en-US"\n' +
            '  xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"\n' +
            '  xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06"\n' +
            '  requiredextensions="p">\n' +
            ' <metadata name="Application">SetupAndHold PuzzleGenerator</metadata>\n' +
            ' <resources>\n' +
            '  <object id="100" p:UUID="{' + assemblyUUID + '}" type="model">\n' +
            '   <components>\n' + components + '   </components>\n' +
            '  </object>\n' +
            ' </resources>\n' +
            ' <build>\n' +
            '  <item objectid="100" p:UUID="{' + uuid4() + '}" printable="1"/>\n' +
            ' </build>\n</model>';

        // model_settings.config
        var settingsXML = '<?xml version="1.0" encoding="UTF-8"?>\n<config>\n' +
            '  <object id="100">\n    <metadata key="name" value="Puzzle"/>\n    <metadata key="extruder" value="1"/>\n';
        for (var pi = 0; pi < parts.length; pi++) {
            settingsXML += '    <part id="' + parts[pi].oid + '" subtype="normal_part">\n' +
                '      <metadata key="name" value="Part_' + parts[pi].oid + '"/>\n' +
                '      <metadata key="extruder" value="' + parts[pi].extruder + '"/>\n    </part>\n';
        }
        settingsXML += '  </object>\n  <plate>\n    <metadata key="plater_id" value="1"/>\n' +
            '    <metadata key="locked" value="false"/>\n    <model_instance>\n' +
            '      <metadata key="object_id" value="100"/>\n      <metadata key="instance_id" value="0"/>\n' +
            '    </model_instance>\n  </plate>\n</config>';

        // project_settings.config (JSON)
        var nFilaments = parts.length;
        var filColors = colors.slice(0, nFilaments);
        var filSettings = [];
        for (var i = 0; i < nFilaments; i++) filSettings.push('Bambu PLA Basic @BBL A1');
        var projectSettings = JSON.stringify({
            filament_colour: filColors,
            filament_settings_id: filSettings,
            printer_settings_id: 'Bambu Lab A1 0.4 nozzle',
            printer_model: 'Bambu Lab A1',
            printer_variant: '0.4',
            nozzle_diameter: ['0.4']
        });

        // Content types and rels
        var contentTypes = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n' +
            ' <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\n' +
            ' <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>\n' +
            '</Types>';

        var rootRels = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n' +
            ' <Relationship Target="/3D/3dmodel.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>\n' +
            '</Relationships>';

        var modelRels = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n' +
            ' <Relationship Target="/3D/Objects/Object_1.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>\n' +
            '</Relationships>';

        // Build ZIP using fflate
        var enc = new TextEncoder();
        var zipData = {
            '[Content_Types].xml': enc.encode(contentTypes),
            '_rels/.rels': enc.encode(rootRels),
            '3D/3dmodel.model': enc.encode(rootModel),
            '3D/_rels/3dmodel.model.rels': enc.encode(modelRels),
            '3D/Objects/Object_1.model': enc.encode(subModel),
            'Metadata/model_settings.config': enc.encode(settingsXML),
            'Metadata/project_settings.config': enc.encode(projectSettings),
        };
        var zipped = fflate.zipSync(zipData, {level: 6});
        return new Blob([zipped], {type: 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml'});
    }

    return { exportSTL: exportSTL, exportSTLSeparate: exportSTLSeparate, export3MF: export3MF,
             buildBinarySTL: buildBinarySTL, boxTriangles: boxTriangles, extrudePolygon: extrudePolygon, svgPathToPolygon: svgPathToPolygon };
})();
