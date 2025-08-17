import { keycloak } from '@app/utils/AuthContext';

export const apiFetch = async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
  try {
    await keycloak.updateToken(30);
  } catch (e) {
    keycloak.login();
    throw e;
  }

  const headers = new Headers(init.headers || {});
  if (keycloak.token) {
    headers.set('Authorization', `Bearer ${keycloak.token}`);
  }

  return fetch(input, { ...init, headers });
};
