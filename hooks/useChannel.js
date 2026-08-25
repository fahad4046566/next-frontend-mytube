"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { usersApi } from "@/lib/api/users";
import { subscriptionsApi } from "@/lib/api/subscriptions";

// Channel profile – isme subscribersCount + isSubscribed already aata hai.
export function useChannel(username) {
  return useQuery({
    queryKey: ["channel", username],
    queryFn: async () => {
      const res = await usersApi.channelProfile(username);
      return res.data;
    },
    enabled: !!username,
  });
}

export function useToggleSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId }) => subscriptionsApi.toggle(channelId),
    onSuccess: (res, vars) => {
      // Channel profile (counts/isSubscribed) + subscriptions list re-sync.
      if (vars.username)
        queryClient.invalidateQueries({ queryKey: ["channel", vars.username] });
      queryClient.invalidateQueries({ queryKey: ["subscribedChannels"] });
      toast.success(res.message || "Subscription updated");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update subscription",
      );
    },
  });
}
