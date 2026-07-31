export interface DecodedToken {
  sub: string;
  companyId: number;
  userRole: string;
  exp: number;
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

export const isTokenValid = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const decoded = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);

    return decoded.exp > now;
  } catch {
    return false;
  }
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  return isTokenValid(token);
};
