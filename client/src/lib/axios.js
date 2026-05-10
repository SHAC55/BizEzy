// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

// const refreshClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

// let refreshPromise = null;

// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const statusCode = error.response?.status;
//     const requestUrl = originalRequest?.url || "";

//     if (!originalRequest || statusCode !== 401 || originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     const isRefreshRequest = requestUrl.includes("/auth/refresh");
//     const isAuthMutation =
//       requestUrl.includes("/auth/login") ||
//       requestUrl.includes("/auth/register") ||
//       requestUrl.includes("/auth/logout");

//     if (isRefreshRequest || isAuthMutation) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     try {
//       refreshPromise ??= refreshClient.get("/auth/refresh");
//       await refreshPromise;
//       return API(originalRequest);
//     } catch (refreshError) {
//       return Promise.reject(refreshError);
//     } finally {
//       refreshPromise = null;
//     }
//   },
// );

// export default API;
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let refreshPromise;

// ✅ Attach tokens from localStorage on every request (iOS Safari fallback)
API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
  if (refreshToken) config.headers["x-refresh-token"] = refreshToken;
  return config;
});

API.interceptors.response.use(
  (response) => {
    // ✅ Save tokens whenever backend sends them
    const { accessToken, refreshToken } = response.data || {};
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;
    const requestUrl = originalRequest?.url || "";

    if (!originalRequest || statusCode !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const isRefreshRequest = requestUrl.includes("/auth/refresh");
    const isAuthMutation =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/logout");

    if (isRefreshRequest || isAuthMutation) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshClient
        .get("/auth/refresh", {
          headers: {
            // ✅ Send refresh token in header for iOS
            "x-refresh-token": localStorage.getItem("refreshToken") || "",
          },
        })
        .then((res) => {
          const { accessToken, refreshToken } = res.data || {};
          if (accessToken) localStorage.setItem("accessToken", accessToken);
          if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
          return res;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    try {
      await refreshPromise;
      return API(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return Promise.reject(refreshError);
    }
  },
);

export default API;