import { GridConfig } from '@slide-agent/shared';

export const DEFAULT_GRID_CONFIG: GridConfig = {
  columns: 12,
  rows: 8,
  gutterX: 16,
  gutterY: 16,
  marginTop: 60,
  marginBottom: 40,
  marginLeft: 40,
  marginRight: 40,
};

// Standard slide dimensions (16:9)
export const SLIDE_WIDTH = 1280;
export const SLIDE_HEIGHT = 720;

export interface GridCell {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

export class Grid {
  private config: GridConfig;
  private cellWidth: number;
  private cellHeight: number;

  constructor(config: GridConfig = DEFAULT_GRID_CONFIG) {
    this.config = config;

    const contentWidth = SLIDE_WIDTH - this.config.marginLeft - this.config.marginRight;
    const contentHeight = SLIDE_HEIGHT - this.config.marginTop - this.config.marginBottom;

    this.cellWidth = (contentWidth - (this.config.columns - 1) * this.config.gutterX) / this.config.columns;
    this.cellHeight = (contentHeight - (this.config.rows - 1) * this.config.gutterY) / this.config.rows;
  }

  cellToPosition(cell: GridCell): { x: number; y: number; width: number; height: number } {
    const x = this.config.marginLeft + cell.col * (this.cellWidth + this.config.gutterX);
    const y = this.config.marginTop + cell.row * (this.cellHeight + this.config.gutterY);
    const width = cell.colSpan * this.cellWidth + (cell.colSpan - 1) * this.config.gutterX;
    const height = cell.rowSpan * this.cellHeight + (cell.rowSpan - 1) * this.config.gutterY;

    return { x, y, width, height };
  }

  // Convert percentage-based position to pixels
  percentToPixels(percent: { x: number; y: number; width: number; height: number }): { x: number; y: number; width: number; height: number } {
    return {
      x: (percent.x / 100) * SLIDE_WIDTH,
      y: (percent.y / 100) * SLIDE_HEIGHT,
      width: (percent.width / 100) * SLIDE_WIDTH,
      height: (percent.height / 100) * SLIDE_HEIGHT,
    };
  }

  // Snap position to nearest grid cell
  snapToGrid(position: { x: number; y: number }): GridCell {
    const col = Math.round((position.x - this.config.marginLeft) / (this.cellWidth + this.config.gutterX));
    const row = Math.round((position.y - this.config.marginTop) / (this.cellHeight + this.config.gutterY));

    return {
      row: Math.max(0, Math.min(row, this.config.rows - 1)),
      col: Math.max(0, Math.min(col, this.config.columns - 1)),
      rowSpan: 1,
      colSpan: 1,
    };
  }
}
