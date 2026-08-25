"use client";

import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "@/lib/api/dashboard";

// Current user ke channel ki stats.
export function useChannelStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await dashboardApi.stats();
      return res.data; // { totalVideos, totalViews, totalSubscribers, totalLikes }
    },
  });
}

// Current user ki saari videos (published + unpublished).
export function useChannelVideos() {
  return useQuery({
    queryKey: ["dashboardVideos"],
    queryFn: async () => {
      const res = await dashboardApi.videos();
      return res.data; // [ videos ] – NOTE: duration/owner/isPublished nahi aate
    },
  });
}
