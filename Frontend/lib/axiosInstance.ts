import axios from "axios";
import { getAccessToken, setAccessToken } from "./utils/tokenUtils";
import { logout } from "@/redux/slices/userSlice";
import { store } from "@/redux/store/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const normalizeBaseURL = (url: string) => {
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is missing");
  const trimmed = url.endsWith("/") ? url.slice(0, -1) : url;
  new URL(trimmed); // validate format
  return trimmed;
};

const axiosInstance = axios.create({
  baseURL: normalizeBaseURL(API_URL),
  withCredentials: true,
});

// ✅ Request interceptor – Add Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    config.headers = config.headers || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor – Handle token refresh for protected routes only
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for these public routes
    const publicPaths = [
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/send-otp",
      "/auth/verify-otp",
      "/auth/register",
      "/auth/login",
    ];

    const isPublicRoute = publicPaths.some((path) =>
      originalRequest.url?.includes(path)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublicRoute
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post<{ accessToken: string }>(
          `${normalizeBaseURL(API_URL)}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;
        if (!newToken) throw new Error("Token refresh failed");

        setAccessToken(newToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest); // retry original request with new token
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
