import * as React from 'react';
import { useAuth } from '@app/utils/AuthContext';


// Custom hook to use apiFetch inside React components
export function useApiFetch() {
  const { token, login } = useAuth();

  const apiFetch = React.useCallback(async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
    // Token refresh logic should be handled by AuthProvider
    const headers = new Headers(init.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      login();
      throw new Error('Not authenticated');
    }
    return fetch(input, { ...init, headers });
  }, [token, login]);

  return apiFetch;
}
