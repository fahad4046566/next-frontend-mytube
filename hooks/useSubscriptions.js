"use client";

import { useQuery } from "@tanstack/react-query";

import { subscriptionsApi } from "@/lib/api/subscriptions";

// Jin channels ko diya hua user follow karta hai.
export function useSubscribedChannels(subscriberId) {
  return useQuery({
    queryKey: ["subscribedChannels", subscriberId],
    queryFn: async () => {
      const res = await subscriptionsApi.channels(subscriberId);
      return res.data; // [ { _id, username, fullName, avatar } ]
    },
    enabled: !!subscriberId,
  });
}
