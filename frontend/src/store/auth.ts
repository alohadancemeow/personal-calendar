import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string; email: string } | null;
  token: string | null;
  login: (user: { username: string; email: string }, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  login: (user, token) => set({ isAuthenticated: true, user, token }),
  logout: () => set({ isAuthenticated: false, user: null, token: null }),
}));