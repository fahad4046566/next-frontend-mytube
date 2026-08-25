"use client";

import { useQuery } from "@tanstack/react-query";

import { usersApi } from "@/lib/api/users";

export function useWatchHistory() {
  return useQuery({
    queryKey: ["watchHistory"],
    queryFn: async () => {
      const res = await usersApi.watchHistory();
      return res.data; // array of video objects (owner populated)
    },
  });
}
