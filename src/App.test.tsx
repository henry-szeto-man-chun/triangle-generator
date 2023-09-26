import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  const titleEle = screen.getByText(/Triangle Generator/i);
  expect(titleEle).toBeInTheDocument();
});
