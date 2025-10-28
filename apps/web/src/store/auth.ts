import { create } from 'zustand';

interface User {
  id: number;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setCredentials: (data: { accessToken: string; refreshToken: string; user: User }) => void;
  clear: () => void;
}

const STORAGE_KEY = 'frota-auth';

const initial = (() => {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null, user: null };
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { accessToken: null, refreshToken: null, user: null };
  try {
    return JSON.parse(raw) as { accessToken: string; refreshToken: string; user: User };
  } catch (error) {
    return { accessToken: null, refreshToken: null, user: null };
  }
})();

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: initial.accessToken,
  refreshToken: initial.refreshToken,
  user: initial.user ?? null,
  setCredentials: ({ accessToken, refreshToken, user }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken, refreshToken, user }));
    set({ accessToken, refreshToken, user });
  },
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
