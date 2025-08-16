import * as React from 'react';
import App from '@app/index';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('App tests', () => {
  test('should render default App component', () => {
    const { asFragment } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render a nav-toggle button', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: 'Global navigation' })).toBeVisible();
  });

  it('should expand the sidebar on larger viewports', () => {
    render(<App />);

    window.dispatchEvent(new Event('resize'));

    expect(screen.getByRole('link', { name: 'Home' })).toBeVisible();
  });

  it('should hide the sidebar when clicking the nav-toggle button', async () => {
    const user = userEvent.setup();

    render(<App />);

    window.dispatchEvent(new Event('resize'));
    const button = screen.getByRole('button', { name: 'Global navigation' });
    expect(screen.getByRole('link', { name: 'Home' })).toBeVisible();

    await user.click(button);

    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
  });
});
