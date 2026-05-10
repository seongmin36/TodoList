import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
}

interface AuthActions {
  setLoggedIn: (value: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  isLoggedIn: false,
  setLoggedIn: (value) => set({ isLoggedIn: value }),
}));
