import * as React from 'react';
import App from '@app/index';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('App tests', () => {
  test('should render landing page when unauthenticated', () => {
    const { asFragment } = render(<App />);

    expect(screen.getByRole('heading', { name: 'Task Tally' })).toBeVisible();
    expect(screen.getByRole('link', { name: /sign in with google/i })).toBeVisible();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render a nav-toggle button when authenticated', () => {
    render(<App mockAuthenticated />);

    expect(screen.getByRole('button', { name: 'Global navigation' })).toBeVisible();
  });

  it('should expand the sidebar on larger viewports when authenticated', () => {
    render(<App mockAuthenticated />);

    window.dispatchEvent(new Event('resize'));

    expect(screen.getByRole('link', { name: 'Home' })).toBeVisible();
  });

  it('should include Git SSH keys in the navigation when authenticated', () => {
    render(<App mockAuthenticated />);

    window.dispatchEvent(new Event('resize'));

    expect(screen.getByRole('link', { name: 'Git SSH keys' })).toBeVisible();
  });

  it('should hide the sidebar when clicking the nav-toggle button', async () => {
    const user = userEvent.setup();

    render(<App mockAuthenticated />);

    window.dispatchEvent(new Event('resize'));
    const button = screen.getByRole('button', { name: 'Global navigation' });
    expect(screen.getByRole('link', { name: 'Home' })).toBeVisible();

    await user.click(button);

    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
  });
});
