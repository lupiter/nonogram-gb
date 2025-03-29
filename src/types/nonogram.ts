// Represents a single cell in the puzzle
export type Cell = 0 | 1;

// Represents a hint for a row or column
export type Hint = number;

// Represents the raw puzzle data
export type PuzzleData = Cell[][];

// Represents the current state of the game
export interface GameState {
  cells: Cell[][];
  errors: boolean[][];
}

// Represents a complete puzzle with its current state
export interface Puzzle {
  data: PuzzleData;
  state: GameState;
  rowHints: Hint[][];    // Derived from solution
  columnHints: Hint[][]; // Derived from solution
} 