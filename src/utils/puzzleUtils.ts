import { Cell, GameState, Hint, PuzzleData } from '../types/nonogram';

/**
 * Creates an empty cell
 */
export function createEmptyCell(): Cell {
  return 0;
}

/**
 * Creates an empty game state for a puzzle of given dimensions
 */
export function createEmptyGameState(width: number, height: number): GameState {
  const cells = Array.from({ length: height }, () => 
    Array.from({ length: width }, () => 0 as Cell)
  );
  const errors = Array.from({ length: height }, () => 
    Array.from({ length: width }, () => false)
  );
  return { cells, errors };
}

/**
 * Derives hints for all rows in a puzzle
 */
export function deriveRowHints(solution: Cell[][]): Hint[][] {
  return solution.map(row => {
    const hints: Hint[] = [];
    let currentCount = 0;

    for (const cell of row) {
      if (cell === 1) {
        currentCount++;
      } else if (currentCount > 0) {
        hints.push(currentCount);
        currentCount = 0;
      }
    }

    if (currentCount > 0) {
      hints.push(currentCount);
    }

    return hints.length > 0 ? hints : [0];
  });
}

/**
 * Derives hints for all columns in a puzzle
 */
export function deriveColumnHints(solution: Cell[][]): Hint[][] {
  const width = solution[0]?.length ?? 0;
  const height = solution.length;
  const hints: Hint[][] = [];

  for (let col = 0; col < width; col++) {
    const columnHints: Hint[] = [];
    let currentCount = 0;

    for (let row = 0; row < height; row++) {
      if (solution[row][col] === 1) {
        currentCount++;
      } else if (currentCount > 0) {
        columnHints.push(currentCount);
        currentCount = 0;
      }
    }

    if (currentCount > 0) {
      columnHints.push(currentCount);
    }

    hints.push(columnHints.length > 0 ? columnHints : [0]);
  }

  return hints;
}

/**
 * Validates that a puzzle definition is valid
 * Returns true if the puzzle is valid, throws an error if not
 */
export function validatePuzzle(puzzle: PuzzleData): boolean {
  const height = puzzle.length;
  const width = puzzle[0]?.length ?? 0;

  // Check dimensions
  if (width <= 0 || height <= 0) {
    return false;
  }

  // Check solution dimensions
  if (puzzle.length !== height) {
    return false;
  }

  for (const row of puzzle) {
    if (row.length !== width) {
      return false;
    }
  }

  return true;
}

/**
 * Checks if the current game state matches the solution
 */
export function checkSolution(puzzle: PuzzleData, gameState: GameState): boolean {
  const height = puzzle.length;
  const width = puzzle[0]?.length ?? 0;

  // Check dimensions
  if (gameState.cells.length !== height || gameState.cells.some(row => row.length !== width)) {
    return false;
  }

  // Check each cell
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (gameState.cells[i][j] !== puzzle[i][j]) {
        return false;
      }
    }
  }

  return true;
} 