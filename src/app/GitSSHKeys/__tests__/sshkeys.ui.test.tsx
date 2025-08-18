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
      downloadPublicKeyAsFile: async (userId: string, name: string) => {
        const { publicKey } = await mock.getPublicKey(userId, name);
        const blob = new Blob([publicKey.endsWith('\n') ? publicKey : publicKey + '\n'], {
          type: 'text/plain;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.pub`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      },
    }),
  };
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

test('download public key', async () => {
  const user = userEvent.setup();
  const createObjectURL = jest.fn(() => 'blob:mock');
  const revokeObjectURL = jest.fn();
  const gUrl = globalThis.URL as unknown as {
    createObjectURL: (b: Blob) => string;
    revokeObjectURL: (u: string) => void;
  };
  gUrl.createObjectURL = createObjectURL;
  gUrl.revokeObjectURL = revokeObjectURL;
  const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  renderPage();
  await user.click(await screen.findByLabelText('Download public key'));
  await waitFor(() => expect(createObjectURL).toHaveBeenCalled());
  expect(clickSpy).toHaveBeenCalled();
  clickSpy.mockRestore();
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
