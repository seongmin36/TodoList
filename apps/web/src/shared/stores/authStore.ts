import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  setToken: (token: string) => void;
}

interface AuthActions {
  clearToken: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  setToken: (token) => {
    localStorage.setItem("accessToken", token);
    set({ accessToken: token });
  },
  clearToken: () => {
    localStorage.removeItem("accessToken");
    set({ accessToken: null });
  },
}));
