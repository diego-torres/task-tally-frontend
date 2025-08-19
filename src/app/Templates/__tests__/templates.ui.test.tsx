import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Templates } from '@app/Templates/Templates';
import { __reset as resetTemplates } from '@api/templates/mock';
import '@testing-library/jest-dom';
import { AuthProvider } from '@app/utils/AuthContext';
import keycloak from '@app/utils/keycloak';


jest.mock('@api/credentials/service', () => ({
  useCredentialService: () => ({
    listSshKeys: jest.fn().mockResolvedValue([]),
  }),
}));

jest.mock('@api/templates/service', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mock = require('@api/templates/mock');
  return {
    useTemplateService: () => ({
      listTemplates: mock.listTemplates,
      getTemplate: mock.getTemplate,
      createTemplate: mock.createTemplate,
      updateTemplate: mock.updateTemplate,
      deleteTemplate: mock.deleteTemplate,
      validateGitSsh: jest.fn().mockResolvedValue(undefined),
    }),
  };
});

const renderTemplates = (initial = '/templates') =>
  render(
    <AuthProvider mockAuthenticated>
      <MemoryRouter initialEntries={[initial]}>
        <Routes>
          <Route path="/templates/*" element={<Templates />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );

beforeEach(() => {
  resetTemplates();
  const kc = keycloak as unknown as { token?: string; tokenParsed?: { preferred_username: string } };
  kc.token = 'mock-token';
  kc.tokenParsed = { preferred_username: 'testuser' };
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
  await user.type(screen.getByLabelText(/repository url/i), 'git@github.com:foo/bar.git');
  await user.click(screen.getByRole('button', { name: /create/i }));
  // Look for the template name in the table, not the button
  expect(await screen.findByText('New Template', { selector: 'td' })).toBeInTheDocument();
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

test('shows error alert when template creation fails due to duplicate repository', async () => {
  const user = userEvent.setup();
  
  // First, create a template with the same repository URL to trigger the duplicate error
  renderTemplates('/templates/new');
  const name = await screen.findByLabelText(/name/i);
  await user.type(name, 'First Template');
  await user.type(screen.getByLabelText(/repository url/i), 'git@github.com:test/repo.git');
  await user.click(screen.getByRole('button', { name: /create/i }));
  
  // Wait for navigation back to list
  await screen.findByText('First Template', { selector: 'td' });
  
  // Now try to create another template with the same repository URL
  await user.click(screen.getByRole('button', { name: 'New Template' }));
  const newName = await screen.findByLabelText(/name/i);
  await user.type(newName, 'Second Template');
  await user.type(screen.getByLabelText(/repository url/i), 'git@github.com:test/repo.git');
  await user.click(screen.getByRole('button', { name: /create/i }));
  
  // Should show error alert
  expect(await screen.findByText('Error creating template')).toBeInTheDocument();
  expect(await screen.findByText('Template for repository already exists')).toBeInTheDocument();
});
