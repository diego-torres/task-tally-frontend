import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Templates } from '@app/Templates/Templates';
import { __reset as resetTemplates } from '@api/templates/mock';
import '@testing-library/jest-dom';

jest.mock('@api/credentials/service', () => ({
  useCredentialService: () => ({
    listSshKeys: jest.fn().mockResolvedValue([]),
  }),
}));

const renderTemplates = (initial = '/templates') =>
  render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/templates/*" element={<Templates />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  resetTemplates();
});

test('list page renders seeded templates', async () => {
  renderTemplates();
  expect(await screen.findByText('Starter Template')).toBeInTheDocument();
  expect(await screen.findByText('Backend Template')).toBeInTheDocument();
});

test('create flow adds template and returns to list', async () => {
  const user = userEvent.setup();
  renderTemplates('/templates/new');
  const name = await screen.findByLabelText(/name/i);
  await user.type(name, 'New Template');
  await user.type(screen.getByLabelText(/repository/i), 'git@github.com:foo/bar.git');
  await user.click(screen.getByRole('button', { name: /create/i }));
  expect(await screen.findByText('New Template')).toBeInTheDocument();
});

test('edit flow updates name and navigates to view', async () => {
  const user = userEvent.setup();
  renderTemplates('/templates/1/edit');
  const nameInput = await screen.findByLabelText(/name/i);
  await user.clear(nameInput);
  await user.type(nameInput, 'Updated Template');
  await user.click(screen.getByRole('button', { name: /save/i }));
  expect(await screen.findByText('Updated Template')).toBeInTheDocument();
});

test('name input is visible and enabled', async () => {
  renderTemplates('/templates/new');
  const input = await screen.findByLabelText(/name/i);
  expect(input).toBeVisible();
  expect(input).toBeEnabled();
});
