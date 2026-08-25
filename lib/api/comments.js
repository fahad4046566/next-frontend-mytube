import api from "@/lib/axios";

// Sab comment routes auth-required hain (backend router.use(verifyJWT)).
export const commentsApi = {
  // GET /comments/:videoId?page&limit  → { comments, totalComments, totalPages, currentPage, limit }
  list: (videoId, params) => api.get(`/comments/${videoId}`, { params }),
  // POST /comments/:videoId  body { content } → created comment (owner sirf id, populated nahi)
  add: (videoId, content) => api.post(`/comments/${videoId}`, { content }),
  // PATCH /comments/c/:commentId  body { content }
  update: (commentId, content) => api.patch(`/comments/c/${commentId}`, { content }),
  // DELETE /comments/c/:commentId
  remove: (commentId) => api.delete(`/comments/c/${commentId}`),
};
