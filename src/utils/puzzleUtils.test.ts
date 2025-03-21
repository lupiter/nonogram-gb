import { Cell, GameState, PuzzleData } from '../types/nonogram';
import { createEmptyCell, createEmptyGameState, validatePuzzle, createPuzzle, checkSolution, deriveRowHints, deriveColumnHints } from './puzzleUtils';

describe('Puzzle Utilities', () => {
  describe('createEmptyCell', () => {
    it('should create an empty cell', () => {
      const cell = createEmptyCell();
      expect(cell).toBe(0);
    });
  });

  describe('createEmptyGameState', () => {
    it('should create an empty game state with correct dimensions', () => {
      const width = 3;
      const height = 2;
      const gameState = createEmptyGameState(width, height);

      expect(gameState.cells).toHaveLength(height);
      expect(gameState.cells[0]).toHaveLength(width);
      expect(gameState.cells[1]).toHaveLength(width);
      expect(gameState.errors).toHaveLength(height);

      // Check that all cells are empty
      for (let y = 0; y < height; y++) {
        expect(gameState.cells[y]).toHaveLength(width);
        expect(gameState.errors[y]).toHaveLength(width);
        for (let x = 0; x < width; x++) {
          expect(gameState.cells[y][x]).toBe(0);
          expect(gameState.errors[y][x]).toBe(false);
        }
      }
    });
  });

  describe('deriveHints', () => {
    const solution: Cell[][] = [
      [1, 1, 1],   // First row: 3
      [0, 0, 0],   // Second row: empty
      [1, 1, 1],   // Third row: 3
    ];

    it('derives correct row hints', () => {
      const rowHints = deriveRowHints(solution);
      expect(rowHints).toEqual([
        [3],  // First row
        [],   // Second row (empty)
        [3],  // Third row
      ]);
    });

    it('derives correct column hints', () => {
      const columnHints = deriveColumnHints(solution);
      expect(columnHints).toEqual([
        [1, 1],  // First column
        [1, 1],  // Second column
        [1, 1],  // Third column
      ]);
    });
  });

  describe('validatePuzzle', () => {
    it('should validate a valid puzzle', () => {
      const puzzle: PuzzleData = {
        width: 3,
        height: 2,
        solution: [
          [0, 1, 0],
          [1, 0, 1],
        ],
      };
      expect(validatePuzzle(puzzle)).toBe(true);
    });

    it('should reject invalid dimensions', () => {
      const puzzle: PuzzleData = {
        width: 0,
        height: 2,
        solution: [
          [0, 1, 0],
          [1, 0, 1],
        ],
      };
      expect(validatePuzzle(puzzle)).toBe(false);
    });
  });

  describe('createPuzzle', () => {
    it('should create a valid puzzle', () => {
      const width = 3;
      const height = 2;
      const solution: Cell[][] = [
        [0, 1, 0],
        [1, 0, 1],
      ];

      const puzzle = createPuzzle(width, height, solution);
      expect(puzzle.width).toBe(width);
      expect(puzzle.height).toBe(height);
      expect(puzzle.solution).toEqual(solution);
    });

    it('should throw on invalid dimensions', () => {
      const width = 0;
      const height = 2;
      const solution: Cell[][] = [
        [0, 1, 0],
        [1, 0, 1],
      ];

      expect(() => createPuzzle(width, height, solution)).toThrow();
    });
  });

  describe('checkSolution', () => {
    it('should correctly check a matching solution', () => {
      const puzzle: PuzzleData = {
        width: 3,
        height: 2,
        solution: [
          [0, 1, 0],
          [1, 0, 1],
        ],
      };

      const gameState: GameState = {
        cells: [
          [0, 1, 0],
          [1, 0, 1],
        ],
        errors: [
          [false, false, false],
          [false, false, false],
        ],
      };

      expect(checkSolution(puzzle, gameState)).toBe(true);
    });

    it('should correctly check a non-matching solution', () => {
      const puzzle: PuzzleData = {
        width: 3,
        height: 2,
        solution: [
          [0, 1, 0],
          [1, 0, 1],
        ],
      };

      const gameState: GameState = {
        cells: [
          [0, 0, 0],
          [1, 0, 1],
        ],
        errors: [
          [false, false, false],
          [false, false, false],
        ],
      };

      expect(checkSolution(puzzle, gameState)).toBe(false);
    });
  });
}); 