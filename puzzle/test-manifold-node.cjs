// Node.js test for sliding puzzle manifold analysis
// Usage: node test-manifold-node.js

// Set up browser-like globals
global.window = global;
global.self = global;
global.document = { createElement: function() { return { getContext: function() { return null; } }; } };

// earcut — must be on window before stl-export.js loads
var _earcutMod = require('earcut');
var _earcut = (typeof _earcutMod === 'function') ? _earcutMod : _earcutMod.default;
global.earcut = _earcut;

// ClipperLib — npm package assigns to global differently
var _clipperLib = require('clipper-lib');
if (!global.ClipperLib && _clipperLib) global.ClipperLib = _clipperLib;

// Load dependencies
require('./engine/utils.js');

// Load engine
require('./engine/grid.js');
require('./engine/solver.js');
require('./engine/stl-export.js');

// ═══════════════════════════════════════
//  TEST: Sliding puzzle manifold analysis
// ═══════════════════════════════════════
console.log('=== Sliding Puzzle Manifold Test ===\n');

var slidingGrid = [[1,2,3],[4,5,6],[7,8,0]];
var slidingPieces = [];
for (var sr = 0; sr < 3; sr++)
    for (var sc = 0; sc < 3; sc++)
        if (slidingGrid[sr][sc] > 0)
            slidingPieces.push({id: slidingGrid[sr][sc], row: sr, col: sc});

var slidingData = {
    puzzle_type: 'sliding',
    grid: slidingGrid,
    pieces: slidingPieces,
    sliding_rows: 3,
    sliding_cols: 3,
    sliding_empty_row: 2,
    sliding_empty_col: 2
};

var slidingOpts = {
    return_raw: true,
    include_base: true,
    include_pieces: false
};

var rawResult = PuzzleSTL.exportSTL(slidingData, slidingOpts);
var baseTris = rawResult.base;
console.log('Triangles: ' + baseTris.length);

// Edge manifold analysis
function edgeKey(v1, v2) {
    var q = 10000;
    var ax = Math.round(v1[0]*q), ay = Math.round(v1[1]*q), az = Math.round(v1[2]*q);
    var bx = Math.round(v2[0]*q), by = Math.round(v2[1]*q), bz = Math.round(v2[2]*q);
    var ka = ax+','+ay+','+az;
    var kb = bx+','+by+','+bz;
    return ka < kb ? ka+'|'+kb : kb+'|'+ka;
}

var edgeCount = {};
for (var ti = 0; ti < baseTris.length; ti++) {
    var tri = baseTris[ti];
    for (var ei = 0; ei < 3; ei++) {
        var ej = (ei + 1) % 3;
        var ek = edgeKey(tri[ei], tri[ej]);
        edgeCount[ek] = (edgeCount[ek] || 0) + 1;
    }
}

var totalEdges = Object.keys(edgeCount).length;
var boundary = 0, manifold = 0, nonManifold = 0;
var nmExamples = [];
for (var ek2 in edgeCount) {
    var cnt = edgeCount[ek2];
    if (cnt === 2) manifold++;
    else if (cnt === 1) boundary++;
    else { nonManifold++; if (nmExamples.length < 10) nmExamples.push({edge: ek2, count: cnt}); }
}

console.log('Edges: ' + totalEdges + ' total');
console.log('  Manifold (×2): ' + manifold);
console.log('  Boundary (×1): ' + boundary);
console.log('  Non-manifold (×3+): ' + nonManifold);

if (nmExamples.length > 0) {
    // Analyze ALL non-manifold edge Z values
    var allNmZvals = {};
    for (var ek3 in edgeCount) {
        if (edgeCount[ek3] <= 2) continue;
        var parts3 = ek3.split('|');
        var v1z3 = parseFloat(parts3[0].split(',')[2]) / 10000;
        var v2z3 = parseFloat(parts3[1].split(',')[2]) / 10000;
        var zMin = Math.min(v1z3, v2z3), zMax = Math.max(v1z3, v2z3);
        if (Math.abs(zMin - zMax) < 0.001) {
            // horizontal edge
            var zk3 = zMin.toFixed(4);
            allNmZvals[zk3] = (allNmZvals[zk3] || 0) + 1;
        } else {
            var zk3a = 'vert:' + zMin.toFixed(4) + '-' + zMax.toFixed(4);
            allNmZvals[zk3a] = (allNmZvals[zk3a] || 0) + 1;
        }
    }
    console.log('\nALL non-manifold edges by Z level:');
    var sortedZ = Object.keys(allNmZvals).sort();
    for (var zi = 0; zi < sortedZ.length; zi++) {
        console.log('  z=' + sortedZ[zi] + ': ' + allNmZvals[sortedZ[zi]] + ' edges');
    }
}

// Bottom face analysis
var minZ = Infinity;
for (var ti2 = 0; ti2 < baseTris.length; ti2++) {
    for (var vi = 0; vi < 3; vi++) {
        if (baseTris[ti2][vi][2] < minZ) minZ = baseTris[ti2][vi][2];
    }
}

var botTris = [];
var eps = 0.001;
for (var ti3 = 0; ti3 < baseTris.length; ti3++) {
    var t3 = baseTris[ti3];
    if (Math.abs(t3[0][2] - minZ) < eps && Math.abs(t3[1][2] - minZ) < eps && Math.abs(t3[2][2] - minZ) < eps) {
        botTris.push(t3);
    }
}

var botArea = 0;
for (var bt = 0; bt < botTris.length; bt++) {
    var ba = botTris[bt][0], bb = botTris[bt][1], bc = botTris[bt][2];
    var ux = bb[0]-ba[0], uy = bb[1]-ba[1];
    var vx = bc[0]-ba[0], vy = bc[1]-ba[1];
    botArea += Math.abs(ux*vy - uy*vx) / 2;
}

var meshMinX = Infinity, meshMaxX = -Infinity;
var meshMinY = Infinity, meshMaxY = -Infinity;
for (var ti4 = 0; ti4 < baseTris.length; ti4++) {
    for (var vi2 = 0; vi2 < 3; vi2++) {
        var vv = baseTris[ti4][vi2];
        if (vv[0] < meshMinX) meshMinX = vv[0];
        if (vv[0] > meshMaxX) meshMaxX = vv[0];
        if (vv[1] < meshMinY) meshMinY = vv[1];
        if (vv[1] > meshMaxY) meshMaxY = vv[1];
    }
}
var fullArea = (meshMaxX - meshMinX) * (meshMaxY - meshMinY);
var botRatio = botArea / fullArea;

console.log('\nBottom face analysis:');
console.log('  Bottom tris: ' + botTris.length);
console.log('  Bottom area: ' + botArea.toFixed(2));
console.log('  Full XY area: ' + fullArea.toFixed(2));
console.log('  Ratio: ' + (botRatio * 100).toFixed(1) + '%');
console.log('  ' + (botRatio < 0.85 ? 'PASS' : 'FAIL') + ': Bottom face is annular (not solid)');

console.log('\n=== RESULT: ' + (nonManifold === 0 && boundary === 0 ? 'PASS' : 'FAIL') + ' ===');

// ═══════════════════════════════════════
//  TEST 2: Default settings (chamfer enabled)
// ═══════════════════════════════════════
console.log('\n=== Test 2: with outer chamfer (default UI settings) ===');
var opts2 = {
    return_raw: true,
    include_base: true,
    include_pieces: false,
    base_chamfer_top_outer: '1.0',
    base_chamfer_bottom_outer: '1.0'
};
var raw2 = PuzzleSTL.exportSTL(slidingData, opts2);
var base2 = raw2.base;
var ec2 = {};
for (var t2i = 0; t2i < base2.length; t2i++) {
    var tri2 = base2[t2i];
    for (var e2i = 0; e2i < 3; e2i++) {
        var e2j = (e2i + 1) % 3;
        var ek2 = edgeKey(tri2[e2i], tri2[e2j]);
        ec2[ek2] = (ec2[ek2] || 0) + 1;
    }
}
var nm2 = 0, bd2 = 0;
for (var k2 in ec2) { if (ec2[k2] > 2) nm2++; else if (ec2[k2] === 1) bd2++; }
console.log('Triangles: ' + base2.length + ', Non-manifold: ' + nm2 + ', Boundary: ' + bd2);
console.log('RESULT: ' + (nm2 === 0 && bd2 === 0 ? 'PASS' : 'FAIL'));

// ═══════════════════════════════════════
//  TEST 3: All chamfers enabled
// ═══════════════════════════════════════
console.log('\n=== Test 3: all chamfers (outer + inner) ===');
var opts3 = {
    return_raw: true,
    include_base: true,
    include_pieces: false,
    base_chamfer_top_outer: '1.0',
    base_chamfer_bottom_outer: '1.0',
    base_chamfer_top_inner: '0.5',
    base_chamfer_bottom_inner: '0.5'
};
var raw3 = PuzzleSTL.exportSTL(slidingData, opts3);
var base3 = raw3.base;
var ec3 = {};
for (var t3i = 0; t3i < base3.length; t3i++) {
    var tri3 = base3[t3i];
    for (var e3i = 0; e3i < 3; e3i++) {
        var e3j = (e3i + 1) % 3;
        var ek3 = edgeKey(tri3[e3i], tri3[e3j]);
        ec3[ek3] = (ec3[ek3] || 0) + 1;
    }
}
var nm3 = 0, bd3 = 0;
for (var k3 in ec3) { if (ec3[k3] > 2) nm3++; else if (ec3[k3] === 1) bd3++; }
console.log('Triangles: ' + base3.length + ', Non-manifold: ' + nm3 + ', Boundary: ' + bd3);
console.log('RESULT: ' + (nm3 === 0 && bd3 === 0 ? 'PASS' : 'FAIL'));

// ═══════════════════════════════════════
//  TEST 4: bevelH=0 (no bevel zones)
// ═══════════════════════════════════════
console.log('\n=== Test 4: bevelH=0 (pieceHeight=6) ===');
var opts4 = {
    return_raw: true,
    include_base: true,
    include_pieces: false,
    sliding_piece_height: '6',
    base_chamfer_top_outer: '1.0',
    base_chamfer_bottom_outer: '1.0'
};
var raw4 = PuzzleSTL.exportSTL(slidingData, opts4);
var base4 = raw4.base;
var ec4 = {};
for (var t4i = 0; t4i < base4.length; t4i++) {
    var tri4 = base4[t4i];
    for (var e4i = 0; e4i < 3; e4i++) {
        var e4j = (e4i + 1) % 3;
        var ek4 = edgeKey(tri4[e4i], tri4[e4j]);
        ec4[ek4] = (ec4[ek4] || 0) + 1;
    }
}
var nm4 = 0, bd4 = 0;
for (var k4 in ec4) { if (ec4[k4] > 2) nm4++; else if (ec4[k4] === 1) bd4++; }
console.log('Triangles: ' + base4.length + ', Non-manifold: ' + nm4 + ', Boundary: ' + bd4);
console.log('RESULT: ' + (nm4 === 0 && bd4 === 0 ? 'PASS' : 'FAIL'));

// ═══════════════════════════════════════
//  TEST 5: 4x4 grid with chamfer
// ═══════════════════════════════════════
console.log('\n=== Test 5: 4x4 grid with chamfer ===');
var grid5 = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
var pieces5 = [];
for (var r5 = 0; r5 < 4; r5++)
    for (var c5 = 0; c5 < 4; c5++)
        if (grid5[r5][c5] > 0)
            pieces5.push({id: grid5[r5][c5], row: r5, col: c5});
var data5 = {
    puzzle_type: 'sliding',
    grid: grid5,
    pieces: pieces5,
    sliding_rows: 4,
    sliding_cols: 4,
    sliding_empty_row: 3,
    sliding_empty_col: 3
};
var raw5 = PuzzleSTL.exportSTL(data5, { return_raw: true, include_base: true, include_pieces: false, base_chamfer_top_outer: '1.0', base_chamfer_bottom_outer: '1.0' });
var base5 = raw5.base;
var ec5 = {};
for (var t5i = 0; t5i < base5.length; t5i++) {
    var tri5 = base5[t5i];
    for (var e5i = 0; e5i < 3; e5i++) {
        var e5j = (e5i + 1) % 3;
        var ek5 = edgeKey(tri5[e5i], tri5[e5j]);
        ec5[ek5] = (ec5[ek5] || 0) + 1;
    }
}
var nm5 = 0, bd5 = 0;
for (var k5 in ec5) { if (ec5[k5] > 2) nm5++; else if (ec5[k5] === 1) bd5++; }
console.log('Triangles: ' + base5.length + ', Non-manifold: ' + nm5 + ', Boundary: ' + bd5);
console.log('RESULT: ' + (nm5 === 0 && bd5 === 0 ? 'PASS' : 'FAIL'));

// ═══════════════════════════════════════
//  TEST 6: shift=0 with chamfer
// ═══════════════════════════════════════
console.log('\n=== Test 6: shift=0 with chamfer ===');
var opts6 = {
    return_raw: true,
    include_base: true,
    include_pieces: false,
    sliding_overhang: '0',
    base_chamfer_top_outer: '1.0',
    base_chamfer_bottom_outer: '1.0'
};
var raw6 = PuzzleSTL.exportSTL(slidingData, opts6);
var base6 = raw6.base;
var ec6 = {};
for (var t6i = 0; t6i < base6.length; t6i++) {
    var tri6 = base6[t6i];
    for (var e6i = 0; e6i < 3; e6i++) {
        var e6j = (e6i + 1) % 3;
        var ek6 = edgeKey(tri6[e6i], tri6[e6j]);
        ec6[ek6] = (ec6[ek6] || 0) + 1;
    }
}
var nm6 = 0, bd6 = 0;
for (var k6 in ec6) { if (ec6[k6] > 2) nm6++; else if (ec6[k6] === 1) bd6++; }
console.log('Triangles: ' + base6.length + ', Non-manifold: ' + nm6 + ', Boundary: ' + bd6);
console.log('RESULT: ' + (nm6 === 0 && bd6 === 0 ? 'PASS' : 'FAIL'));

// ═══════════════════════════════════════
//  TEST 7: Large chamfer > flatH
// ═══════════════════════════════════════
console.log('\n=== Test 7: chamfer > flatH ===');
var opts7 = {
    return_raw: true,
    include_base: true,
    include_pieces: false,
    base_chamfer_top_outer: '3.0',
    base_chamfer_bottom_outer: '3.0'
};
var raw7 = PuzzleSTL.exportSTL(slidingData, opts7);
var base7 = raw7.base;
var ec7 = {};
for (var t7i = 0; t7i < base7.length; t7i++) {
    var tri7 = base7[t7i];
    for (var e7i = 0; e7i < 3; e7i++) {
        var e7j = (e7i + 1) % 3;
        var ek7 = edgeKey(tri7[e7i], tri7[e7j]);
        ec7[ek7] = (ec7[ek7] || 0) + 1;
    }
}
var nm7 = 0, bd7 = 0;
for (var k7 in ec7) { if (ec7[k7] > 2) nm7++; else if (ec7[k7] === 1) bd7++; }
console.log('Triangles: ' + base7.length + ', Non-manifold: ' + nm7 + ', Boundary: ' + bd7);
console.log('RESULT: ' + (nm7 === 0 && bd7 === 0 ? 'PASS' : 'FAIL'));

// Bottom face area check for default chamfer case
var minZ2 = Infinity;
for (var ti2b = 0; ti2b < base2.length; ti2b++)
    for (var vi2b = 0; vi2b < 3; vi2b++)
        if (base2[ti2b][vi2b][2] < minZ2) minZ2 = base2[ti2b][vi2b][2];
var botTris2 = [];
for (var ti2c = 0; ti2c < base2.length; ti2c++) {
    var t2c = base2[ti2c];
    if (Math.abs(t2c[0][2]-minZ2) < 0.001 && Math.abs(t2c[1][2]-minZ2) < 0.001 && Math.abs(t2c[2][2]-minZ2) < 0.001)
        botTris2.push(t2c);
}
var botArea2 = 0;
for (var bt2 = 0; bt2 < botTris2.length; bt2++) {
    var ba2 = botTris2[bt2][0], bb2 = botTris2[bt2][1], bc2 = botTris2[bt2][2];
    botArea2 += Math.abs((bb2[0]-ba2[0])*(bc2[1]-ba2[1])-(bc2[0]-ba2[0])*(bb2[1]-ba2[1])) / 2;
}
var meshMinX2 = Infinity, meshMaxX2 = -Infinity, meshMinY2 = Infinity, meshMaxY2 = -Infinity;
for (var ti2d = 0; ti2d < base2.length; ti2d++)
    for (var vi2d = 0; vi2d < 3; vi2d++) {
        var vv2 = base2[ti2d][vi2d];
        if (vv2[0] < meshMinX2) meshMinX2 = vv2[0];
        if (vv2[0] > meshMaxX2) meshMaxX2 = vv2[0];
        if (vv2[1] < meshMinY2) meshMinY2 = vv2[1];
        if (vv2[1] > meshMaxY2) meshMaxY2 = vv2[1];
    }
var fullArea2 = (meshMaxX2-meshMinX2)*(meshMaxY2-meshMinY2);
var botRatio2 = botArea2 / fullArea2;
console.log('\nDefault chamfer bottom face:');
console.log('  Bottom tris: ' + botTris2.length + ', Area: ' + botArea2.toFixed(2) + ', Full: ' + fullArea2.toFixed(2) + ', Ratio: ' + (botRatio2*100).toFixed(1) + '%');
console.log('  ' + (botRatio2 < 0.85 ? 'PASS' : 'FAIL') + ': Bottom is annular');

// ═══════════════════════════════════════
//  SUMMARY
// ═══════════════════════════════════════
var allPass = nonManifold === 0 && boundary === 0 && nm2 === 0 && bd2 === 0 && nm3 === 0 && bd3 === 0 && nm4 === 0 && bd4 === 0 && nm5 === 0 && bd5 === 0 && nm6 === 0 && bd6 === 0 && nm7 === 0 && bd7 === 0 && botRatio2 < 0.85;
console.log('\n══════════════════════════════');
console.log('ALL TESTS: ' + (allPass ? 'PASS ✓' : 'FAIL ✗'));
console.log('══════════════════════════════');
