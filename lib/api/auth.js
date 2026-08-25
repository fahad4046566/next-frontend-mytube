import api from "@/lib/axios";

// Auth endpoints – base URL me already /api/v1 hai, isliye yahan sirf resource path.
export const authApi = {
  register: (formData) => api.post("/users/register", formData), // multipart FormData
  login: (data) => api.post("/users/login", data), // { username|email, password }
  logout: () => api.post("/users/logout"),
  refresh: (refreshToken) => api.post("/users/refresh-token", { refreshToken }),
  currentUser: () => api.get("/users/current-user"),
};
