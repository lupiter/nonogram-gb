import { PuzzleSolutionData } from '../types/nonogram';
import puzzles5x5 from '../puzzles/5x5';
import puzzles10x10 from '../puzzles/10x10';
import puzzles15x15 from '../puzzles/15x15';
import puzzles20x20 from '../puzzles/20x20';

export const puzzleMap = {
  '5x5': puzzles5x5,
  '10x10': puzzles10x10,
  '15x15': puzzles15x15,
  '20x20': puzzles20x20,
};

export function puzzle(category: string, id: string): PuzzleSolutionData {
  const puzzles = puzzleMap[category as keyof typeof puzzleMap];
  return puzzles[parseInt(id) - 1];
}

export function puzzlesByCategory(category: string): PuzzleSolutionData[] {
  return puzzleMap[category as keyof typeof puzzleMap];
}


