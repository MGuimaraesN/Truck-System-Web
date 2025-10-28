import { create } from 'zustand';

import type { components } from '@/api/generated';

type AuthTokens = components['schemas']['AuthTokens'];
type User = AuthTokens['user'];

type Credentials = {
  accessToken: AuthTokens['accessToken'] | null;
  refreshToken: AuthTokens['refreshToken'] | null;
  user: User | null;
};

interface AuthState extends Credentials {
  setCredentials: (data: AuthTokens) => void;
  clear: () => void;
}

const STORAGE_KEY = 'frota-auth';

const emptyCredentials: Credentials = { accessToken: null, refreshToken: null, user: null };

const initial = (() => {
  if (typeof window === 'undefined') return emptyCredentials;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyCredentials;
  try {
    const parsed = JSON.parse(raw) as AuthTokens;
    return { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken, user: parsed.user } satisfies Credentials;
  } catch {
    return emptyCredentials;
  }
})();

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: initial.accessToken,
  refreshToken: initial.refreshToken,
  user: initial.user ?? null,
  setCredentials: ({ accessToken, refreshToken, user }) => {
    const payload: AuthTokens = { accessToken, refreshToken, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    set({ accessToken, refreshToken, user });
  },
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
    set(emptyCredentials);
  },
}));
