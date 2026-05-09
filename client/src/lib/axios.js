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

let refreshPromise = null;

API.interceptors.response.use(
  (response) => response,
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

    try {
      // ✅ POST instead of GET, send refreshToken in body for iOS fallback
      refreshPromise ??= refreshClient.post("/auth/refresh", {
        refreshToken: localStorage.getItem("refreshToken") ?? "",
      });

      const refreshResponse = await refreshPromise;

      // ✅ Save new refreshToken if server rotated it
      const newRefreshToken = refreshResponse.data?.refreshToken;
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      return API(originalRequest);
    } catch (refreshError) {
      // ✅ Clear stored token on refresh failure
      localStorage.removeItem("refreshToken");
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

export default API;