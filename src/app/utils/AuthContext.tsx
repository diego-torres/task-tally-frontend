declare global {
  interface Window {
    _keycloakInitialized?: boolean;
  }
}
// src/app/utils/AuthContext.tsx
// Keycloak-backed AuthContext: drop-in replacement for the previous GIS-based context.
// Exports: AuthProvider, useAuth (same names & shape as before).

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import keycloak from './keycloak';

const SILENT_CHECK_PATH = (process.env.KEYCLOAK_SILENT_CHECK_PATH as string) || '/silent-check-sso.html';
const ONLOAD = (process.env.KEYCLOAK_ONLOAD as 'check-sso' | 'login-required') || 'check-sso';

type AuthUser = {
  email?: string;
  name?: string;
  preferred_username?: string;
  picture?: string;
  sub?: string;
  roles?: string[];
};

type AuthValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthCtx = createContext<AuthValue | undefined>(undefined);

// Map Keycloak token claims into our user shape
function mapUser(): AuthUser {
  const p = keycloak.tokenParsed || {};
  const realmRoles: string[] = p.realm_access?.roles || [];
  const resourceRoles: string[] = Object.values(p.resource_access || {}).flatMap((r: { roles?: string[] }) => r.roles || []);
  return {
    email: p.email,
    name: p.name,
    preferred_username: p.preferred_username,
    picture: p.picture,
    sub: p.sub,
    roles: [...realmRoles, ...resourceRoles],
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode; mockAuthenticated?: boolean }> = ({
  children,
  mockAuthenticated = false,
}) => {
  const [ready, setReady] = useState(mockAuthenticated);
  const [isAuthenticated, setIsAuthenticated] = useState(mockAuthenticated);
  const [token, setToken] = useState<string | null>(mockAuthenticated ? 'mock-token' : null);
  const refreshTimer = useRef<number | null>(null);
  const hasConfig = !!keycloak;

  const startRefreshLoop = useCallback(() => {
    const schedule = () => {
      if (!keycloak.tokenParsed || !keycloak.token) return;
      const now = Math.floor(Date.now() / 1000);
      const exp = keycloak.tokenParsed?.exp ?? now + 60;
      const secs = Math.max(exp - now - 30, 10); // refresh 30s before expiry (min 10s)
      refreshTimer.current = window.setTimeout(async () => {
        try {
          const refreshed = await keycloak.updateToken(30);
          if (refreshed) setToken(keycloak.token!);
        } catch (e) {
          console.warn('[auth] token refresh failed; forcing login', e);
          keycloak.login();
        } finally {
          schedule();
        }
      }, secs * 1000);
    };
    schedule();
  }, []);

  const stopRefreshLoop = useCallback(() => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (mockAuthenticated || !hasConfig) {
      setReady(true);
      return;
    }
    const silentUri = `${window.location.origin}${SILENT_CHECK_PATH}`;

    // Prevent double init in dev/HMR/StrictMode using a global flag
  if (window._keycloakInitialized) {
      setReady(true);
      setIsAuthenticated(!!keycloak.token);
      setToken(keycloak.token || null);
      return;
    }

    keycloak
      .init({
        onLoad: ONLOAD,
        pkceMethod: 'S256',
        checkLoginIframe: true,
        enableLogging: true,
        silentCheckSsoRedirectUri: silentUri,
      })
      .then((authenticated) => {
  window._keycloakInitialized = true;
        setIsAuthenticated(authenticated);
        setToken(keycloak.token || null);
        setReady(true);
        if (authenticated) startRefreshLoop();
        // eslint-disable-next-line no-console
        console.log('[auth] Keycloak init → authenticated:', authenticated);
      })
      .catch((err) => {
        console.error('[auth] Keycloak init error', err);
        setReady(true);
      });

    keycloak.onAuthSuccess = () => {
      setIsAuthenticated(true);
      setToken(keycloak.token || null);
      startRefreshLoop();
      // eslint-disable-next-line no-console
      console.log('[auth] onAuthSuccess');
    };
    keycloak.onAuthError = (e) => console.error('[auth] onAuthError', e);
    keycloak.onAuthRefreshSuccess = () => setToken(keycloak.token || null);
    keycloak.onAuthLogout = () => {
      setIsAuthenticated(false);
      setToken(null);
      stopRefreshLoop();
      // eslint-disable-next-line no-console
      console.log('[auth] onAuthLogout');
    };
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => keycloak.login());
    };

    return () => stopRefreshLoop();
  }, [mockAuthenticated, startRefreshLoop, stopRefreshLoop, hasConfig]);

  const login = useCallback(() => keycloak.login(), []);
  const logout = useCallback(() => keycloak.logout({ redirectUri: window.location.origin }), []);

  const value: AuthValue = useMemo(
    () => ({
      user: isAuthenticated ? mapUser() : null,
      token,
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated, token, login, logout],
  );

  if (!ready) return <div>Loading authentication…</div>;
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
