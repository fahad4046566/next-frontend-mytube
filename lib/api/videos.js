import api from "@/lib/axios";

export const videosApi = {
  // Public list – supports page, limit, query, sortBy, sortType, userId
  list: (params) => api.get("/videos", { params }),
  // Watch: POST increments views + adds to watch history, returns populated video
  getById: (videoId) => api.post(`/videos/${videoId}`),
  getUploadConfig: () => api.get("/videos/get-upload-config"),
  // Publish expects Cloudinary URLs already uploaded by the client
  publish: (data) => api.post("/videos", data),
  update: (videoId, data) => api.patch(`/videos/update/${videoId}`, data),
  remove: (videoId) => api.delete(`/videos/delete/${videoId}`),
  // bool is the string "true" / "false" (URL param)
  toggleStatus: (videoId, bool) => api.patch(`/videos/status/${videoId}/${bool}`),
};
