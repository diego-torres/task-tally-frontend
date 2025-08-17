export default class Keycloak {
  token?: string;
  tokenParsed?: Record<string, unknown>;
  init = jest.fn().mockResolvedValue(false);
  login = jest.fn();
  logout = jest.fn();
  updateToken = jest.fn().mockResolvedValue(true);
  onAuthSuccess?: () => void;
  onAuthError?: () => void;
  onAuthRefreshSuccess?: () => void;
  onAuthLogout?: () => void;
  onTokenExpired?: () => void;
}

