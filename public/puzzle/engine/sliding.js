/* =====================================================
 *  PuzzleSliding — Sliding Puzzle Generator
 *  Generates a simple rows×cols sliding puzzle grid
 *  where one corner tile is removed (empty space).
 * ===================================================== */
"use strict";

window.PuzzleSliding = (function () {

    /**
     * Generate a sliding puzzle grid.
     * @param {Object} params
     *   - rows: number of rows (default 3)
     *   - cols: number of columns (default 3)
     *   - empty_corner: 'br' | 'bl' | 'tr' | 'tl' (default 'br')
     * @returns {Object} { success, grid, pieces, piece_count, rows, cols, empty_corner, empty_row, empty_col }
     *
     * grid[r][c]: 1-based piece ID, or 0 for the empty cell
     * pieces: array of { id, row, col } — one entry per tile (excluding the empty)
     */
    function generate(params) {
        var rows = Math.max(2, Math.min(10, parseInt(params.rows) || 3));
        var cols = Math.max(2, Math.min(10, parseInt(params.cols) || 3));
        var emptyCorner = String(params.empty_corner || 'br').toLowerCase();

        // Determine empty cell position
        var emptyRow, emptyCol;
        switch (emptyCorner) {
            case 'tl': emptyRow = 0;        emptyCol = 0;        break;
            case 'tr': emptyRow = 0;        emptyCol = cols - 1; break;
            case 'bl': emptyRow = rows - 1; emptyCol = 0;        break;
            case 'br':
            default:   emptyRow = rows - 1; emptyCol = cols - 1; break;
        }

        // Build grid with sequential numbering (1-based), 0 for empty
        var grid = [];
        var pieces = [];
        var id = 1;
        for (var r = 0; r < rows; r++) {
            var row = [];
            for (var c = 0; c < cols; c++) {
                if (r === emptyRow && c === emptyCol) {
                    row.push(0);
                } else {
                    row.push(id);
                    pieces.push({ id: id, row: r, col: c });
                    id++;
                }
            }
            grid.push(row);
        }

        return {
            success: true,
            grid: grid,
            pieces: pieces,
            piece_count: pieces.length,
            rows: rows,
            cols: cols,
            empty_corner: emptyCorner,
            empty_row: emptyRow,
            empty_col: emptyCol
        };
    }

    return { generate: generate };
})();
