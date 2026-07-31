import { getToken, setToken, removeToken, isTokenValid, decodeToken, isAuthenticated } from '@/lib/auth';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Auth Utilities', () => {
  beforeEach(() => { localStorageMock.clear(); });

  it('stores and retrieves token', () => {
    const token = 'test.token.value';
    setToken(token);
    expect(getToken()).toBe(token);
  });

  it('removes token from localStorage', () => {
    setToken('test.token.value');
    removeToken();
    expect(getToken()).toBeNull();
  });

  it('returns false for invalid token format', () => {
    expect(isTokenValid('invalid')).toBe(false);
  });

  it('returns false for expired token', () => {
    const expiredPayload = { sub: '1', exp: Math.floor(Date.now() / 1000) - 3600 };
    const expiredToken = `header.${btoa(JSON.stringify(expiredPayload))}.signature`;
    expect(isTokenValid(expiredToken)).toBe(false);
  });

  it('returns true for valid token', () => {
    const validPayload = { sub: '1', exp: Math.floor(Date.now() / 1000) + 3600 };
    const validToken = `header.${btoa(JSON.stringify(validPayload))}.signature`;
    expect(isTokenValid(validToken)).toBe(true);
  });

  it('decodes token correctly', () => {
    const payload = { sub: '1', companyId: 123, userRole: 'admin' };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    const decoded = decodeToken(token);
    expect(decoded?.sub).toBe('1');
    expect(decoded?.companyId).toBe(123);
  });
});