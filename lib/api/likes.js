import api from "@/lib/axios";

// Sab like routes auth-required hain (backend router.use(verifyJWT)).
export const likesApi = {
  // Toggle karta hai: data null => ab unliked, object => ab liked (message "Liked"/"Unliked").
  toggleVideo: (videoId) => api.post(`/likes/toggle/v/${videoId}`),
  toggleComment: (commentId) => api.post(`/likes/toggle/c/${commentId}`),
  // Current user ki liked videos list (paginated).
  likedVideos: (params) => api.get("/likes/videos", { params }),
};
