import type { UpdateProfileInput, ChangePasswordInput } from "@repo/schemas";
import { apiClient } from "./client";

export interface UserProfileResponse {
  userId: number;
  name: string;
  profileImage: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const userApi = {
  getProfile: () =>
    apiClient.get<UserProfileResponse>("/users/me").then((r) => r.data),

  updateProfile: (data: UpdateProfileInput) =>
    apiClient.patch<UserProfileResponse>("/users/me", data).then((r) => r.data),

  changePassword: (data: ChangePasswordInput) =>
    apiClient.patch<void>("/auth/password", data).then((r) => r.data),
};
