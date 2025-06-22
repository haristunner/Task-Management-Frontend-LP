import axios from "axios";
import { SERVER_BASE_URL } from "./vars";

const API = axios.create({
  baseURL: SERVER_BASE_URL,
  withCredentials: true, // Send cookies for refresh token
});

API.interceptors.request.use(
  (config) => {
    const accessToken = window.localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isRefreshExpired =
      error?.response?.data?.message ===
        "Refresh token: Authentication failure!" &&
      error?.response?.data?.error_msg === "jwt expired";

    if (isRefreshExpired) {
      window.localStorage.removeItem("accessToken");
      window.location.replace("/");
      return Promise.reject(error);
    }

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      error.response?.data?.message !== "Authentication failure!"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return API(originalRequest);
    } catch (refreshError) {
      window.localStorage.removeItem("accessToken");
      window.location.replace("/");
      return Promise.reject(refreshError);
    }
  }
);

const refreshToken = async () => {
  const response = await API.post("/auth/refresh_token");

  const accessToken = response?.data?.data?.access_token;

  if (accessToken) {
    window.localStorage.setItem("accessToken", accessToken);
    return accessToken;
  }

  throw new Error("No access token returned from refresh");
};

export { API, refreshToken };
