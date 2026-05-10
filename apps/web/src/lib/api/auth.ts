import type { LoginInput, SignupInput } from "@repo/schemas";
import { apiClient } from "./client";

export interface LoginResponse {
  ok: true;
}

export interface SignupResponse {
  id: number;
  name: string;
}

export const authApi = {
  login: (data: LoginInput) =>
    apiClient.post<LoginResponse>("/auth/login", data).then((r) => r.data),

  signup: (data: SignupInput) =>
    apiClient.post<SignupResponse>("/auth/signup", data).then((r) => r.data),
};
