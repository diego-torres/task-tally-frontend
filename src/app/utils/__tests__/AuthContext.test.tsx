import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import keycloak from '../keycloak';

jest.mock('keycloak-js');

describe('AuthProvider', () => {
  beforeEach(() => {
    delete (window as Window & { _keycloakInitialized?: boolean })._keycloakInitialized;
  });

  afterEach(() => {
    delete (window as Window & { _keycloakInitialized?: boolean })._keycloakInitialized;
  });

  it('initializes Keycloak only once', async () => {
    render(
      <React.StrictMode>
        <AuthProvider>
          <div />
        </AuthProvider>
      </React.StrictMode>,
    );

    await waitFor(() => {
      expect(keycloak.init).toHaveBeenCalledTimes(1);
    });
  });
});
