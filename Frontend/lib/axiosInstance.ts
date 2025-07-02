import axios from "axios";
import { getAccessToken, setAccessToken } from "./utils/tokenUtils";
import { logout } from "@/redux/slices/userSlice";
import { store } from "@/redux/store/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const normalizeBaseURL = (url: string) => {
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is missing");
  const trimmed = url.endsWith("/") ? url.slice(0, -1) : url;
  new URL(trimmed);
  return trimmed;
};

const axiosInstance = axios.create({
  baseURL: normalizeBaseURL(API_URL),
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    config.headers = config.headers || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

type RefreshResponse = {
  accessToken: string;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.get<RefreshResponse>(
          `${normalizeBaseURL(API_URL)}/api/auth/refresh-token`,
          { withCredentials: true },
        );

        const newToken = res.data.accessToken;
        if (!newToken) throw new Error("Token refresh failed");

        setAccessToken(newToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
