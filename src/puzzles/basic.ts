import { PuzzleData } from '../types/nonogram';

// A 5x5 star pattern
export const starPuzzle: PuzzleData = {
  width: 5,
  height: 5,
  solution: [
    [0, 0, 1, 0, 0],  // ..#..
    [0, 1, 1, 1, 0],  // .###.
    [1, 1, 1, 1, 1],  // #####
    [0, 1, 1, 1, 0],  // .###.
    [0, 0, 1, 0, 0],  // ..#..
  ],
}; 