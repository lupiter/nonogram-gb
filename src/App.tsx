import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Puzzle from './pages/Puzzle';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="puzzle/:category/:id" element={<Puzzle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
