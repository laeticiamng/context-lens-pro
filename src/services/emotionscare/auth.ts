import type { AuthTokens, AuthUser } from './types';

const TOKEN_STORAGE_KEY = 'ec_access_token';
const REFRESH_STORAGE_KEY = 'ec_refresh_token';
const EXPIRY_STORAGE_KEY = 'ec_token_expiry';

const API_URL = import.meta.env.VITE_EMOTIONSCARE_API_URL || 'https://api.emotionscare.app';

// Token storage using sessionStorage for security (cleared on tab close)
// In production, consider using httpOnly cookies via backend proxy

export function storeTokens(tokens: AuthTokens): void {
  sessionStorage.setItem(TOKEN_STORAGE_KEY, tokens.access_token);
  sessionStorage.setItem(REFRESH_STORAGE_KEY, tokens.refresh_token);
  
  const expiryTime = Date.now() + tokens.expires_in * 1000;
  sessionStorage.setItem(EXPIRY_STORAGE_KEY, expiryTime.toString());
}

export function clearTokens(): void {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(REFRESH_STORAGE_KEY);
  sessionStorage.removeItem(EXPIRY_STORAGE_KEY);
}

export function getStoredAccessToken(): string | null {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_STORAGE_KEY);
}

export function isTokenExpired(): boolean {
  const expiry = sessionStorage.getItem(EXPIRY_STORAGE_KEY);
  if (!expiry) return true;
  
  // Consider expired 60 seconds before actual expiry for safety
  return Date.now() >= parseInt(expiry, 10) - 60000;
}

export async function getAccessToken(): Promise<string | null> {
  const token = getStoredAccessToken();
  
  if (!token) return null;
  
  // If token is about to expire, try to refresh
  if (isTokenExpired()) {
    try {
      const newToken = await refreshAccessToken();
      return newToken;
    } catch {
      clearTokens();
      return null;
    }
  }
  
  return token;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/context-lens/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  const data = await response.json();
  storeTokens(data.tokens);
  
  return data.user;
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getStoredRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await fetch(`${API_URL}/api/context-lens/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  
  if (!response.ok) {
    clearTokens();
    throw new Error('Token refresh failed');
  }
  
  const data = await response.json();
  storeTokens(data.tokens);
  
  return data.tokens.access_token;
}

export async function logout(): Promise<void> {
  const token = getStoredAccessToken();
  
  if (token) {
    try {
      await fetch(`${API_URL}/api/context-lens/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch {
      // Ignore errors on logout
    }
  }
  
  clearTokens();
}

export function isAuthenticated(): boolean {
  const token = getStoredAccessToken();
  return !!token && !isTokenExpired();
}

// Fallback mock authentication for demo mode
let mockToken: string | null = null;

export function setMockToken(token: string): void {
  mockToken = token;
}

export function getMockToken(): string | null {
  return mockToken || 'demo-token-context-lens-pro';
}
