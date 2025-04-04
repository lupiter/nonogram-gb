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
export function validatePuzzle(puzzle: PuzzleSolutionData): boolean {
  // Check if puzzle is empty
  if (!puzzle || puzzle.length === 0) {
    return false;
  }

  const height = puzzle.length;
  const width = puzzle[0]?.length ?? 0;

  // Check if width is valid
  if (width === 0) {
    return false;
  }

  // Check that all rows have the same width and valid cell values
  for (let i = 0; i < height; i++) {
    if (puzzle[i].length !== width) {
      return false;
    }
    for (let j = 0; j < width; j++) {
      if (
        puzzle[i][j] !== CellState.EMPTY &&
        puzzle[i][j] !== CellState.FILLED
      ) {
        return false;
      }
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
      if (
        gameState[i][j] === CellState.CROSSED_OUT &&
        solution[i][j] === CellState.FILLED
      ) {
        return false;
      }
      if (
        gameState[i][j] === CellState.FILLED &&
        solution[i][j] === CellState.EMPTY
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
  const hintWidth =
    hints.reduce((acc, hint) => acc + hint.hint, 0) + hints.length - 1;
    
  for (let i = 0; i < size - hintWidth; i++) {
    const solution = Array(i).fill(CellState.CROSSED_OUT);
    hints.forEach((hint, hintIndex) => {
      solution.push(Array(hint.hint).fill(CellState.FILLED));
      if (hintIndex < hints.length - 1) {
        solution.push(CellState.CROSSED_OUT);
      }
    });
    solution.push(Array(size - hintWidth - i).fill(CellState.CROSSED_OUT));
    solutions.push(solution);
  }
  // todo: what if gaps are not always one cell?
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
  let possibleSolutionsForRows = rowHints.map((row) =>
    generatePossibleDataForHints(row, width)
  );
  let possibleSolutionsForColumns = columnHints.map((column) =>
    generatePossibleDataForHints(column, height)
  );
  let progressedSolution = false;

  do {
    progressedSolution = false;
    possibleSolutionsForRows.forEach((solutionSet, rowIndex) => {
      if (solutionSet.length === 0) {
        return false;
      }
      for (let i = 0; i < width; i++) {
        if (solutionSet.every((x) => x[i] === solutionSet[0][i])) {
          gameState[rowIndex][i] = solutionSet[0][i];
          progressedSolution = true;
        }
      }
    });
    possibleSolutionsForColumns.forEach((solutionSet, columnIndex) => {
      if (solutionSet.length === 0) {
        return false;
      }
      for (let i = 0; i < height; i++) {
        if (solutionSet.every((x) => x[i] === solutionSet[0][i])) {
          gameState[i][columnIndex] = solutionSet[0][i];
          progressedSolution = true;
        }
      }
    });
    // cross-validate possible solutions
    possibleSolutionsForRows = possibleSolutionsForRows.map(
      (solutionSet, solutionRowIndex) => {
        return solutionSet.filter((solution) => {
          const row = gameState[solutionRowIndex];
          return row.every((cell, cellIndex) => {
            return cell === CellState.EMPTY || cell === solution[cellIndex];
          });
        });
      }
    );
    possibleSolutionsForColumns = possibleSolutionsForColumns.map(
      (solutionSet, solutionColumnIndex) => {
        return solutionSet.filter((solution) => {
          const column = gameState.map((row) => row[solutionColumnIndex]);
          return column.every((cell, cellIndex) => {
            return cell === CellState.EMPTY || cell === solution[cellIndex];
          });
        });
      }
    );
    console.log(gameState, progressedSolution);
  } while (progressedSolution);

  return gameState.every((row) =>
    row.every((cell) => cell !== CellState.EMPTY)
  );
}

// this attempts to solve the puzzle the same way I do it
export function hasUniqueSolution(solution: PuzzleSolutionData): boolean {
  const width = solution[0].length;
  const height = solution.length;
  const rowHints = deriveRowHints(solution);
  const columnHints = deriveColumnHints(solution);
  const gameState = createEmptyGameState(width, height);
  let hasEmpty = true;
  let filledSomething = false;
  let itterations = 0;

  do {
    itterations++;
    filledSomething = false;
    // fill in proscriptive hints
    rowHints.forEach((row, rowIndex) => {
      if (row.length === 0) {
        gameState[rowIndex] = Array(width).fill(CellState.CROSSED_OUT);
        filledSomething = true;
      }
      const remainingWidth = gameState[rowIndex].filter(
        (cell) => cell === CellState.EMPTY
      ).length;
      row.forEach((hint) => {
        if (hint.hint === remainingWidth) {
          const firstEmpty = gameState[rowIndex].findIndex(
            (cell) => cell === CellState.EMPTY
          );
          gameState[rowIndex].fill(
            CellState.FILLED,
            firstEmpty,
            firstEmpty + hint.hint
          );
          hint.used = true;
          filledSomething = true;
        } else if (hint.hint > width / 2) {
          const fillStart = width - hint.hint;
          const fillEnd = width;
          gameState[rowIndex].fill(CellState.FILLED, fillStart, fillEnd);
          filledSomething = true;
        }
      });
    });

    columnHints.forEach((column, columnIndex) => {
      if (column.length === 0) {
        for (let i = 0; i < height; i++) {
          gameState[i][columnIndex] = CellState.CROSSED_OUT;
        }
      }
      const remainingHeight = gameState
        .map((row) => row[columnIndex])
        .filter((cell) => cell === CellState.EMPTY).length;
      column.forEach((hint) => {
        if (hint.hint === remainingHeight) {
          const firstEmpty = gameState.findIndex(
            (row) => row[columnIndex] === CellState.EMPTY
          );
          gameState[firstEmpty][columnIndex] = CellState.FILLED;
          hint.used = true;
          filledSomething = true;
        } else if (hint.hint > height / 2) {
          const fillStart = height - hint.hint;
          const fillEnd = height;
          for (let i = fillStart; i < fillEnd; i++) {
            gameState[i][columnIndex] = CellState.FILLED;
          }
          hint.used = true;
          filledSomething = true;
        } else if (hint.hint > height / 2) {
          const fillStart = height - hint.hint;
          const fillEnd = height;
          for (let i = fillStart; i < fillEnd; i++) {
            gameState[i][columnIndex] = CellState.FILLED;
          }
          filledSomething = true;
        }
      });
    });

    // check if there are still any empty cells
    hasEmpty = gameState.some((row) =>
      row.some((cell) => cell === CellState.EMPTY)
    );
  } while (hasEmpty && filledSomething && itterations < 100);
  console.log(itterations);

  return !hasEmpty && filledSomething;
}
