import { Outlet, Link } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
} 