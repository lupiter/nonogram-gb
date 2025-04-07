import { CellState as NonogramCellState } from './nonogram';

export enum GameMode {
  Free = 'free',
  Assisted = 'assisted'
}

export type PuzzleGrid = number[][];  // For stored puzzle solutions (0 or 1)
export type WorkingGrid = NonogramCellState[][];  // For the grid being worked on 