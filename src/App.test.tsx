import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders main page', () => {
    render(<App />);
    expect(screen.getByText(/nonogram/i)).toBeInTheDocument();
  });
}); 