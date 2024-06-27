import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Ant Design ©2018 Created by Ant UED/i);
  expect(linkElement).toBeInTheDocument();
});
