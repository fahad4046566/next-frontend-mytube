"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Cookies from "js-cookie";

import { likesApi } from "@/lib/api/likes";
import { ACCESS_TOKEN } from "@/lib/axios";

// Backend video object me isLiked/likeCount nahi hota, isliye "liked" state hum
// current user ki liked-videos list se derive karte hain (bade limit se ek hi baar le aate hain).
export function useLikedVideoIds() {
  return useQuery({
    queryKey: ["likedVideos"],
    queryFn: async () => {
      const res = await likesApi.likedVideos({ limit: 1000 });
      return (res.data?.videos || []).map((v) => v._id);
    },
    enabled: typeof window !== "undefined" && !!Cookies.get(ACCESS_TOKEN),
    staleTime: 60 * 1000,
  });
}

export function useToggleVideoLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId) => likesApi.toggleVideo(videoId),
    onSuccess: () => {
      // liked list re-sync (button apna optimistic state khud handle karta hai).
      queryClient.invalidateQueries({ queryKey: ["likedVideos"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update like");
    },
  });
}
