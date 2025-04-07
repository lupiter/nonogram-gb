import {
  GameState,
  Hint,
  PuzzleSolutionData,
  CellState,
  Cell,
} from "../types/nonogram";

/**
 * Creates an empty game state for a puzzle of given dimensions
 */
export function createEmptyGameState(width: number, height: number): GameState {
  const cells = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => CellState.EMPTY)
  );
  return cells;
}

/**
 * Derives hints for all rows in a puzzle
 */
export function deriveRowHints(solution: PuzzleSolutionData): Hint[][] {
  return solution.map((row) => {
    const hints: Hint[] = [];
    let currentCount = 0;

    for (const cell of row) {
      if (cell === CellState.FILLED) {
        currentCount++;
      } else if (currentCount > 0) {
        hints.push({ hint: currentCount, used: false });
        currentCount = 0;
      }
    }

    if (currentCount > 0) {
      hints.push({ hint: currentCount, used: false });
    }

    return hints;
  });
}

/**
 * Derives hints for all columns in a puzzle
 */
export function deriveColumnHints(solution: PuzzleSolutionData): Hint[][] {
  const width = solution[0]?.length ?? 0;
  const height = solution.length;
  const hints: Hint[][] = [];

  for (let col = 0; col < width; col++) {
    const columnHints: Hint[] = [];
    let currentCount = 0;

    for (let row = 0; row < height; row++) {
      if (solution[row][col] === CellState.FILLED) {
        currentCount++;
      } else if (currentCount > 0) {
        columnHints.push({ hint: currentCount, used: false });
        currentCount = 0;
      }
    }

    if (currentCount > 0) {
      columnHints.push({ hint: currentCount, used: false });
    }

    hints.push(columnHints);
  }

  return hints;
}

/**
 * Validates that a puzzle has valid dimensions and cell values
 */
export function validatePuzzle(solution: PuzzleSolutionData): boolean {
  if (solution.length === 0) {
    return false;
  }

  const width = solution[0]?.length ?? 0;

  if (width === 0) {
    return false;
  }

  // Check that all rows have the same width and valid cell values
  for (const row of solution) {
    if (row.length !== width) {
      return false;
    }
  }

  return true;
}

/**
 * Checks if the current game state matches the solution
 */
export function checkSolution(
  solution: PuzzleSolutionData,
  gameState: GameState
): boolean {
  const height = solution.length;
  const width = solution[0]?.length ?? 0;

  // Check dimensions
  if (
    gameState.length !== height ||
    gameState.some((row) => row.length !== width)
  ) {
    return false;
  }

  // Check each cell
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const gameCell = gameState[i][j];
      const solutionCell = solution[i][j];

      if (
        (gameCell === CellState.CROSSED_OUT && solutionCell === CellState.FILLED) ||
        (gameCell === CellState.FILLED && solutionCell === CellState.EMPTY) ||
        (gameCell === CellState.EMPTY && solutionCell === CellState.FILLED)
      ) {
        return false;
      }
    }
  }

  return true;
}

export function generatePossibleDataForHints(
  hints: Hint[],
  size: number
): Cell[][] {
  const solutions: Cell[][] = [];
  const hintWidth = hints.reduce((acc, hint) => acc + hint.hint, 0) + hints.length - 1;
    
  for (let i = 0; i < size - hintWidth; i++) {
    const solution: Cell[] = Array.from({ length: i }, () => CellState.CROSSED_OUT);
    hints.forEach((hint, hintIndex) => {
      solution.push(...Array.from({ length: hint.hint }, () => CellState.FILLED));
      if (hintIndex < hints.length - 1) {
        solution.push(CellState.CROSSED_OUT);
      }
    });
    solution.push(...Array.from({ length: size - hintWidth - i }, () => CellState.CROSSED_OUT));
    solutions.push(solution);
  }
  return solutions;
}

export function checkPuzzleHasUniqueSolution(
  solution: PuzzleSolutionData
): boolean {
  const width = solution[0].length;
  const height = solution.length;
  const rowHints = deriveRowHints(solution);
  const columnHints = deriveColumnHints(solution);
  const gameState = createEmptyGameState(width, height);
  const possibleSolutionsForRows = rowHints.map((row) =>
    generatePossibleDataForHints(row, width)
  );
  const possibleSolutionsForColumns = columnHints.map((column) =>
    generatePossibleDataForHints(column, height)
  );
  let progressedSolution = false;

  do {
    progressedSolution = false;
    possibleSolutionsForRows.forEach((solutionSet, rowIndex) => {
      if (solutionSet.length === 0) {
        return;
      }
      for (let i = 0; i < width; i++) {
        const allSolutionsAgree = solutionSet.every(
          (solution) => solution[i] === solutionSet[0][i]
        );
        if (allSolutionsAgree) {
          gameState[rowIndex][i] = solutionSet[0][i];
          progressedSolution = true;
        }
      }
    });

    possibleSolutionsForColumns.forEach((solutionSet, colIndex) => {
      if (solutionSet.length === 0) {
        return;
      }
      for (let i = 0; i < height; i++) {
        const allSolutionsAgree = solutionSet.every(
          (solution) => solution[i] === solutionSet[0][i]
        );
        if (allSolutionsAgree) {
          gameState[i][colIndex] = solutionSet[0][i];
          progressedSolution = true;
        }
      }
    });
  } while (progressedSolution);

  return checkSolution(solution, gameState);
}

export function isRowOrColumnComplete(
  solution: PuzzleSolutionData,
  gameState: GameState,
  isRow: boolean,
  index: number
): boolean {
  const line = isRow ? gameState[index] : gameState.map(row => row[index]);
  const solutionLine = isRow ? solution[index] : solution.map(row => row[index]);

  for (let i = 0; i < line.length; i++) {
    if (
      (line[i] === CellState.CROSSED_OUT && solutionLine[i] === CellState.FILLED) ||
      (line[i] === CellState.FILLED && solutionLine[i] === CellState.EMPTY) ||
      (line[i] === CellState.EMPTY && solutionLine[i] === CellState.FILLED)
    ) {
      return false;
    }
  }

  return true;
}
