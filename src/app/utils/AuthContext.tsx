import * as React from 'react';

interface User {
  email?: string;
  name?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => undefined,
  logout: () => undefined,
});

const clientId = process.env.GOOGLE_CLIENT_ID || '';

interface AuthProviderProps {
  children: React.ReactNode;
  mockAuthenticated?: boolean;
}

type GoogleId = {
  accounts: {
    id: {
      initialize: (opts: {
        client_id: string;
        callback: (res: { credential: string }) => void;
        use_fedcm_for_prompt?: boolean;
        ux_mode?: string;
        auto_select?: boolean;
        itp_support?: boolean;
      }) => void;
      prompt: (cb?: (notification: unknown) => void) => void;
    };
  };
};

const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({ children, mockAuthenticated }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (mockAuthenticated) {
      const mockUser = { name: 'Mock User', email: 'mock@example.com' };
      setUser(mockUser);
      setToken('mock-token');
      return;
    }
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, [mockAuthenticated]);

  const login = () => {
    const google = (window as Window & { google?: GoogleId }).google;
    if (google?.accounts.id) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (res: { credential: string }) => {
          console.log('[GIS] credential', res);
          try {
            const payload = JSON.parse(atob(res.credential.split('.')[1]));
            setUser(payload);
            setToken(res.credential);
            localStorage.setItem('auth_user', JSON.stringify(payload));
            localStorage.setItem('auth_token', res.credential);
            window.location.href = '/home';
          } catch {
            // ignore parsing errors
          }
        },
        use_fedcm_for_prompt: true,
        ux_mode: 'popup',
        auto_select: false,
        itp_support: true,
      });
      google.accounts.id.prompt((n: unknown) => console.log('[GIS] prompt', n));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => React.useContext(AuthContext);

export { AuthProvider, useAuth };
