import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Templates } from '@app/Templates/Templates';
import { __reset as resetTemplates } from '@api/templates/mock';
import '@testing-library/jest-dom';

const renderTemplates = (initial = '/templates') =>
  render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/templates/*" element={<Templates />} />
      </Routes>
    </MemoryRouter>,
  );

describe('Templates CRUD flow', () => {
  beforeEach(() => {
    resetTemplates();
  });
  it('renders seeded templates', async () => {
    renderTemplates();
    expect(await screen.findByText('Starter Template')).toBeInTheDocument();
    expect(await screen.findByText('Backend Template')).toBeInTheDocument();
  });

  it('creates a template', async () => {
    const user = userEvent.setup();
    renderTemplates();
    await screen.findByText('Starter Template');
    await user.click(screen.getByRole('button', { name: /create template/i }));
    await user.type(screen.getByLabelText(/name/i), 'New Template');
    await user.type(
      screen.getByLabelText(/repository/i),
      'git@github.com:foo/bar.git',
    );
    await user.type(screen.getByLabelText(/credential/i), 'gh');
    await user.click(screen.getByRole('button', { name: /create/i }));
    expect(await screen.findByText('New Template')).toBeInTheDocument();
  });

  it('edits a template', async () => {
    const user = userEvent.setup();
    renderTemplates();
    await screen.findByText('Starter Template');
    const edit = screen.getAllByRole('button', { name: 'Edit' })[0];
    await user.click(edit);
    const nameInput = await screen.findByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Template');
    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByText('Updated Template')).toBeInTheDocument();
  });

  it('deletes a template', async () => {
    const user = userEvent.setup();
    renderTemplates();
    await screen.findByText('Starter Template');
    const del = screen.getAllByRole('button', { name: 'Delete' })[0];
    await user.click(del);
    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() =>
      expect(screen.queryByText('Starter Template')).not.toBeInTheDocument(),
    );
  });
});
