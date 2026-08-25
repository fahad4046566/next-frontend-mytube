import api from "@/lib/axios";

export const dashboardApi = {
  // GET /dashboard/stats → { totalVideos, totalViews, totalSubscribers, totalLikes }
  stats: () => api.get("/dashboard/stats"),
  // GET /dashboard/videos → [ { _id, title, description, videoFile, thumbnail, views, createdAt } ]
  videos: () => api.get("/dashboard/videos"),
};
