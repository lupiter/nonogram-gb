import { validatePuzzle } from '../utils/puzzleUtils';
import { starPuzzle } from './basic';

describe('Basic Puzzles', () => {
  describe('starPuzzle', () => {
    it('is a valid puzzle definition', () => {
      expect(() => { validatePuzzle(starPuzzle); }).not.toThrow();
    });
  });
}); 