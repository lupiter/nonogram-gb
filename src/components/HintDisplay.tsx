import { Hint } from "../types/nonogram";
import "./HintDisplay.css";

interface HintDisplayProps {
  hints: Hint[] | undefined;
  isVertical?: boolean;
}

export default function HintDisplay({ hints, isVertical = true }: HintDisplayProps) {
  if (!hints) {
    return <div className={`hint-numbers ${isVertical ? 'vertical' : 'horizontal'}`} />;
  }

  return (
    <div className={`hint-numbers ${isVertical ? 'vertical' : 'horizontal'}`}>
      {hints.map((hint, i) => (
        <span key={i} className={hint.used ? "used" : ""}>
          {hint.hint}
        </span>
      ))}
    </div>
  );
} 