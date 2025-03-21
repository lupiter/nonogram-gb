import { validatePuzzle, createPuzzle } from '../utils/puzzleUtils';
import { starPuzzle } from './basic';

describe('Basic Puzzles', () => {
  describe('starPuzzle', () => {
    it('is a valid puzzle definition', () => {
      expect(() => { validatePuzzle(starPuzzle); }).not.toThrow();
    });

    it('has correct dimensions', () => {
      expect(starPuzzle.width).toBe(5);
      expect(starPuzzle.height).toBe(5);
      expect(starPuzzle.solution.length).toBe(5);
      expect(starPuzzle.solution[0].length).toBe(5);
    });

    it('has correct hints', () => {
      const puzzle = createPuzzle(starPuzzle);
      
      // Check row hints
      expect(puzzle.rowHints).toEqual([
        [1],      // Middle dot of top
        [3],      // Three cells in second row
        [5],      // Full row in middle
        [3],      // Three cells in fourth row
        [1],      // Middle dot at bottom
      ]);

      // Check column hints
      expect(puzzle.columnHints).toEqual([
        [1],      // Middle dot on left
        [3],      // Three cells in second column
        [5],      // Full column in middle
        [3],      // Three cells in fourth column
        [1],      // Middle dot on right
      ]);
    });

    it('forms a star pattern', () => {
      // Check middle column is all filled
      expect(starPuzzle.solution.every(row => row[2] === 1)).toBe(true);
      
      // Check middle row is all filled
      expect(starPuzzle.solution[2].every(cell => cell === 1)).toBe(true);
      
      // Check corners are empty
      expect(starPuzzle.solution[0][0]).toBe(0); // Top-left
      expect(starPuzzle.solution[0][4]).toBe(0); // Top-right
      expect(starPuzzle.solution[4][0]).toBe(0); // Bottom-left
      expect(starPuzzle.solution[4][4]).toBe(0); // Bottom-right
    });
  });
}); 