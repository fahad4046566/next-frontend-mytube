import api from "@/lib/axios";

export const playlistsApi = {
  // POST /playlist { name, description } → created playlist
  create: (data) => api.post("/playlist", data),
  // GET /playlist/user/:userId → [ playlists ] (owner populated, videos = ID array)
  byUser: (userId) => api.get(`/playlist/user/${userId}`),
  // GET /playlist/:playlistId → playlist (videos = ID array, NOT populated)
  byId: (playlistId) => api.get(`/playlist/${playlistId}`),
  // PATCH /playlist/:playlistId { name, description } → updated
  update: (playlistId, data) => api.patch(`/playlist/${playlistId}`, data),
  // DELETE /playlist/:playlistId
  remove: (playlistId) => api.delete(`/playlist/${playlistId}`),
  // PATCH /playlist/add/:videoId/:playlistId → $addToSet
  addVideo: (videoId, playlistId) =>
    api.patch(`/playlist/add/${videoId}/${playlistId}`),
  // PATCH /playlist/remove/:videoId/:playlistId → $pull
  removeVideo: (videoId, playlistId) =>
    api.patch(`/playlist/remove/${videoId}/${playlistId}`),
};
