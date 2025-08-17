// src/app/utils/AuthContext.tsx
// Keycloak-backed AuthContext: drop-in replacement for the previous GIS-based context.
// Exports: AuthProvider, useAuth (same names & shape as before).

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Keycloak from 'keycloak-js';

// ---- Environment (provided via webpack dotenv plugin) ----
const KEYCLOAK_URL = process.env.KEYCLOAK_URL as string; // e.g. http://localhost:8080
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM as string; // e.g. task-tally
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID as string; // e.g. task-tally-frontend
const SILENT_CHECK_PATH = (process.env.KEYCLOAK_SILENT_CHECK_PATH as string) || '/silent-check-sso.html';
const ONLOAD = (process.env.KEYCLOAK_ONLOAD as 'check-sso' | 'login-required') || 'check-sso';

if (!KEYCLOAK_URL || !KEYCLOAK_REALM || !KEYCLOAK_CLIENT_ID) {
  // eslint-disable-next-line no-console
  console.warn('[auth] Missing Keycloak env vars. Check .env: KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID');
}

// ---- Keycloak singleton ----
const keycloak = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID,
});

export { keycloak };

interface TokenParsed extends Keycloak.KeycloakTokenParsed {
  email?: string;
  name?: string;
  preferred_username?: string;
  picture?: string;
  sub?: string;
  realm_access?: Keycloak.KeycloakRoles;
  resource_access?: Record<string, Keycloak.KeycloakRoles>;
}

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
  const p: TokenParsed = (keycloak.tokenParsed || {}) as TokenParsed;
  const realmRoles = p.realm_access?.roles || [];
  const resourceRoles = Object.values(p.resource_access || {}).flatMap((r) => r.roles || []);
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
  const hasConfig = KEYCLOAK_URL && KEYCLOAK_REALM && KEYCLOAK_CLIENT_ID;

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

    keycloak
      .init({
        onLoad: ONLOAD,
        pkceMethod: 'S256',
        checkLoginIframe: true,
        enableLogging: true,
        silentCheckSsoRedirectUri: silentUri,
      })
      .then((authenticated) => {
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
