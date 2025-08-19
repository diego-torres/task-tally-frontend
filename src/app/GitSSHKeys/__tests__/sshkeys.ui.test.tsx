import * as React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GitSSHKeys } from '@app/GitSSHKeys/GitSSHKeys';
import { __reset as resetKeys } from '@api/credentials/mock';
import '@testing-library/jest-dom';
import { AuthProvider } from '@app/utils/AuthContext';
import keycloak from '@app/utils/keycloak';

// Use CommonJS require for Jest mock factory, with eslint-disable for linter
jest.mock('@api/credentials/service', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mock = require('@api/credentials/mock');
  return {
    useCredentialService: () => ({
      generateSshKey: mock.generateSshKey,
      deleteSshKey: mock.deleteSshKey,
      listSshKeys: mock.listSshKeys,
      getPublicKey: mock.getPublicKey,
    }),
  };
});

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

const renderPage = () =>
  render(
    <AuthProvider mockAuthenticated>
      <MemoryRouter initialEntries={['/credentials']}>
        <Routes>
          <Route path="/credentials" element={<GitSSHKeys />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );

beforeEach(() => {
  resetKeys();
  const kc = keycloak as unknown as { token?: string; tokenParsed?: { preferred_username: string } };
  kc.token = 'tkn';
  kc.tokenParsed = { preferred_username: 'me' };
});

test('lists seeded keys', async () => {
  renderPage();
  expect(await screen.findByText('demo-key')).toBeInTheDocument();
});

test('generate key flow', async () => {
  const user = userEvent.setup();
  renderPage();
  await user.click(await screen.findByRole('button', { name: /generate key/i }));
  const modal = await screen.findByRole('dialog');
  await user.type(within(modal).getByLabelText(/name/i), 'new-key');
  await user.click(within(modal).getByRole('button', { name: /^generate$/i }));
  expect(await screen.findByText('new-key')).toBeInTheDocument();
});

test('copy public key to clipboard', async () => {
  const user = userEvent.setup();
  const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
  renderPage();
  await user.click(await screen.findByLabelText('Copy public key to clipboard'));
  await waitFor(() => expect(writeTextSpy).toHaveBeenCalled());
  expect(writeTextSpy).toHaveBeenCalledWith(expect.stringContaining('ssh-ed25519'));
  writeTextSpy.mockRestore();
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
