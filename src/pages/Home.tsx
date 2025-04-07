import { Link } from 'react-router-dom';
import './Home.css';
import { puzzleMap } from '../utils/puzzleLoader';

export default function Home() {


  return (
    <div className="home">
      <h1>Nonogram 🧩</h1>
      <div className="puzzle-categories">
        {Object.entries(puzzleMap).map(([category, puzzles]) => (
          <div key={category} className="puzzle-category">
            <h2>{category}</h2>
            <div className="puzzle-links">
              {puzzles.map((_, index) => (
                <Link key={index} to={`/puzzle/${category}/${String(index + 1)}`}>
                  {index + 1}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 