import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isGuest: false,
  loading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setGuest: (isGuest) => set({ isGuest }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  login: (user, token) => set({ user, token, isGuest: false, error: null }),
  logout: () => set({ user: null, token: null, isGuest: false, error: null }),
  guestMode: () => set({ isGuest: true, user: { name: 'Guest' }, error: null }),
}));
