import * as React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GitSSHKeys } from '@app/GitSSHKeys/GitSSHKeys';
import { __reset as resetKeys } from '@api/credentials/mock';
import '@testing-library/jest-dom';

// Use CommonJS require for Jest mock factory, with eslint-disable for linter
jest.mock('@api/credentials/service', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mock = require('@api/credentials/mock');
  return {
    createSshKey: mock.createSshKey,
    deleteSshKey: mock.deleteSshKey,
    listSshKeys: mock.listSshKeys,
  };
});

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/credentials']}>
      <Routes>
        <Route path="/credentials" element={<GitSSHKeys />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  resetKeys();
});

test('lists seeded keys', async () => {
  renderPage();
  expect(await screen.findByText('demo-key')).toBeInTheDocument();
});

test('add key flow', async () => {
  const user = userEvent.setup();
  renderPage();
  await user.click(await screen.findByRole('button', { name: /add key/i }));
  const modal = await screen.findByRole('dialog');
  await user.type(within(modal).getByLabelText(/name/i), 'new-key');
  await user.type(within(modal).getByLabelText(/private key/i), 'AAA');
  await user.click(within(modal).getByRole('button', { name: /^add$/i }));
  expect(await screen.findByText('new-key')).toBeInTheDocument();
});

test('delete selected key', async () => {
  const user = userEvent.setup();
  renderPage();
  const checkbox = await screen.findByLabelText('select-demo-key');
  await user.click(checkbox);
  await user.click(screen.getByRole('button', { name: /delete key/i }));
  const modal = await screen.findByRole('dialog');
  await user.click(within(modal).getByRole('button', { name: /^delete$/i }));
  await waitFor(() => expect(screen.queryByText('demo-key')).not.toBeInTheDocument());
});
