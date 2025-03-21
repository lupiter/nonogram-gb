import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders hello world', () => {
    render(<App />);
    expect(screen.getByText(/vite \+ react/i)).toBeInTheDocument();
  });
}); 