import * as React from 'react';
import { useAuth } from '@app/utils/AuthContext';


// Custom hook to use apiFetch inside React components
export function useApiFetch() {
  const { token, login, isAuthenticated } = useAuth();

  const apiFetch = React.useCallback(async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      // Try to login if not authenticated
      login();
      throw new Error('Authentication required. Please log in.');
    }

    // Token refresh logic should be handled by AuthProvider
    const headers = new Headers(init.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    
    try {
      const response = await fetch(input, { ...init, headers });
      
      // Handle authentication errors
      if (response.status === 401) {
        // Token might be expired, try to login again
        login();
        throw new Error('Authentication required. Please log in again.');
      }
      
      return response;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  }, [token, login, isAuthenticated]);

  return apiFetch;
}
