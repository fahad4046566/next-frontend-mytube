import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Main instance – iske through saari authenticated calls jati hain.
// NOTE: Content-Type set nahi kar rahe taake FormData (register) pe axios
// khud multipart boundary laga sake; JSON body pe axios khud application/json laga deta hai.
const api = axios.create({ baseURL });

// Refresh ke liye alag plain instance – iske upar koi interceptor nahi,
// isliye 401 refresh loop nahi banega.
const refreshClient = axios.create({ baseURL });

export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";

// Frontend-domain cookies (non-httpOnly) taake axios aur Next middleware dono parh saken.
export function setAuthCookies({ accessToken, refreshToken }) {
  if (accessToken)
    Cookies.set(ACCESS_TOKEN, accessToken, { expires: 1, sameSite: "lax", path: "/" });
  if (refreshToken)
    Cookies.set(REFRESH_TOKEN, refreshToken, { expires: 7, sameSite: "lax", path: "/" });
}

export function clearAuthCookies() {
  Cookies.remove(ACCESS_TOKEN, { path: "/" });
  Cookies.remove(REFRESH_TOKEN, { path: "/" });
}

// Har request pe Bearer token laga do (agar mojood hai).
api.interceptors.request.use((config) => {
  const token = Cookies.get(ACCESS_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Response interceptor: success pe envelope unwrap, 401 pe auto-refresh + single retry ---
let isRefreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

const redirectToLogin = () => {
  clearAuthCookies();
  if (typeof window !== "undefined") window.location.href = "/login";
};

api.interceptors.response.use(
  // crm-app jaisa: hooks ko seedha backend ka envelope milta hai { statusCode, data, message, success }
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 401 ke ilawa, ya pehle se retry ho chuka, ya refresh-call khud fail hui → aage bhej do
    if (
      status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url?.includes("refresh-token")
    ) {
      return Promise.reject(error);
    }

    const refreshToken = Cookies.get(REFRESH_TOKEN);
    if (!refreshToken) {
      redirectToLogin();
      return Promise.reject(error);
    }

    // Agar refresh already chal raha hai to is request ko queue kar do.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(() => {
        originalRequest._retry = true;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await refreshClient.post("/users/refresh-token", { refreshToken });
      const data = res.data?.data || {};
      setAuthCookies({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      processQueue(null, data.accessToken);
      return api(originalRequest); // retry – request interceptor naya token laga dega
    } catch (refreshError) {
      processQueue(refreshError, null);
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
