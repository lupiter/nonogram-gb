import { useEffect, useRef } from 'react';
import './VictoryPopup.css';

interface VictoryPopupProps {
  onClose: () => void;
}

export default function VictoryPopup({ onClose }: VictoryPopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
    }
  }, []);

  return (
    <dialog 
      ref={dialogRef}
      className="victory-dialog"
      aria-labelledby="victory-title"
      aria-describedby="victory-description"
    >
      <div className="victory-content">
        <h2 id="victory-title">🎉 Congratulations! 🎉</h2>
        <p id="victory-description">You've solved the puzzle!</p>
        <button onClick={onClose} aria-label="Close victory message">Close</button>
      </div>
    </dialog>
  );
} 