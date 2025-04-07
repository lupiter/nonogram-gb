import { useParams } from "react-router-dom";
import { puzzle as loadPuzzle } from "../utils/puzzleLoader";
import { useState, useEffect } from "react";
import { WorkingGrid, GameMode } from "../types/puzzle";
import { CellState as NonogramCellState, Hint } from "../types/nonogram";
import {
  deriveRowHints,
  deriveColumnHints,
  checkSolution,
} from "../utils/puzzleUtils";
import { errorSound } from "../utils/errorSound";
import { updateCell } from "../utils/updateCell";
import ToggleGroup from "../components/ToggleGroup";
import VictoryPopup from "../components/VictoryPopup";
import HintDisplay from "../components/HintDisplay";
import "./Puzzle.css";

export default function Puzzle() {
  const { category, id } = useParams() as { category: string, id: string };
  const puzzle = loadPuzzle(category, id);

  const [grid, setGrid] = useState<WorkingGrid>(
    puzzle.map((row) => row.map(() => NonogramCellState.EMPTY))
  );
  const [tool, setTool] = useState<NonogramCellState>(NonogramCellState.FILLED);
  const [mode, setMode] = useState<GameMode>(() => {
    const savedMode = localStorage.getItem('gameMode');
    return savedMode ? (savedMode as GameMode) : GameMode.Assisted;
  });
  const [isSolved, setIsSolved] = useState(false);
  const [errorCell, setErrorCell] = useState<[number, number] | null>(null);
  const [rowHints, setRowHints] = useState<Hint[][]>([]);
  const [columnHints, setColumnHints] = useState<Hint[][]>([]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      void errorSound.cleanup();
    };
  }, []);

  // Initialize hints when puzzle loads
  useEffect(() => {
    setRowHints(deriveRowHints(puzzle));
    setColumnHints(deriveColumnHints(puzzle));
  }, [puzzle]);

  useEffect(() => {
    const solved = checkSolution(puzzle, grid);
    setIsSolved(solved);
  }, [grid, puzzle]);

  const handleCellChange = async (row: number, col: number) => {
    const result = await updateCell({
      grid,
      puzzle,
      row,
      col,
      toolToUse: tool,
      mode,
      rowHints,
      columnHints
    });

    setGrid(result.newGrid);
    setRowHints(result.newRowHints);
    setColumnHints(result.newColumnHints);
    setErrorCell(result.errorCell);
  };

  const handleRightClick = async (
    row: number,
    col: number,
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const oppositeTool =
      tool === NonogramCellState.FILLED
        ? NonogramCellState.CROSSED_OUT
        : NonogramCellState.FILLED;
    
    const result = await updateCell({
      grid,
      puzzle,
      row,
      col,
      toolToUse: oppositeTool,
      mode,
      rowHints,
      columnHints
    });

    setGrid(result.newGrid);
    setRowHints(result.newRowHints);
    setColumnHints(result.newColumnHints);
    setErrorCell(result.errorCell);
  };

  // Reset error state after animation completes
  useEffect(() => {
    if (errorCell) {
      const timer = setTimeout(() => { setErrorCell(null); }, 200);
      return () => { clearTimeout(timer); };
    }
  }, [errorCell]);

  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
    localStorage.setItem('gameMode', newMode);
  };

  return (
    <>
      <h2>Puzzle {id}</h2>
      <div className="puzzle">
        <div className="controls">
          <ToggleGroup
            value={mode}
            onChange={(newMode) => {
              handleModeChange(newMode);
            }}
            options={[
              { value: GameMode.Free, label: "Free" },
              { value: GameMode.Assisted, label: "Assisted" },
            ]}
            name="mode"
            title="Game Mode"
          />
        </div>
        <table className="puzzle-grid" role="grid">
          <thead>
            <tr>
              <th></th>
              {columnHints.map((hints, colIndex) => (
                <th key={colIndex} role="columnheader">
                  <HintDisplay hints={hints} isVertical={true} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex} role="row">
                <th role="rowheader">
                  <HintDisplay hints={rowHints[rowIndex]} isVertical={false} />
                </th>
                {row.map((cell, colIndex) => (
                  <td key={`${String(rowIndex)}-${String(colIndex)}`} role="gridcell">
                    <input
                      type="checkbox"
                      id={`cell-${String(rowIndex)}-${String(colIndex)}`}
                      checked={cell === NonogramCellState.FILLED}
                      onChange={() => {
                        handleCellChange(rowIndex, colIndex).catch((error: unknown) => {
                          console.error('Error updating cell:', error);
                        });
                      }}
                      onContextMenu={(e) => {
                        handleRightClick(rowIndex, colIndex, e).catch((error: unknown) => {
                          console.error('Error handling right click:', error);
                        });
                      }}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate =
                            cell === NonogramCellState.EMPTY;
                        }
                      }}
                      className={
                        errorCell &&
                        errorCell[0] === rowIndex &&
                        errorCell[1] === colIndex
                          ? "shake"
                          : ""
                      }
                      aria-label={`Cell at row ${String(rowIndex + 1)}, column ${String(colIndex + 1)}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="controls">
          <ToggleGroup
            value={tool}
            onChange={setTool}
            options={[
              {
                value: NonogramCellState.FILLED,
                label: "■",
                ariaLabel: "Fill",
              },
              {
                value: NonogramCellState.CROSSED_OUT,
                label: "✕",
                ariaLabel: "Cross",
              },
            ]}
            name="tool"
            title="Tool"
          />
        </div>
        {isSolved && <VictoryPopup onClose={() => {
          setIsSolved(false);
        }} />}
      </div>
    </>
  );
}
