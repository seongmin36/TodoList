import axios from "axios";

// API 요청 중 발생할 수 있는 에러를 처리하는 커스텀 에러 클래스
// TODO: 서버 에러 형식 구현 시에 리팩토링
export class ApiError extends Error {
  public readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL:
    (import.meta.env.VITE_API_URL as string | undefined) ?? "/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const status = error.response?.status ?? 0;

    if (status === 401 && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }

    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      "요청에 실패했습니다.";

    return Promise.reject(new ApiError(message, status));
  },
);
