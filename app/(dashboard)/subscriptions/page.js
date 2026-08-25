"use client";

import { Users } from "lucide-react";

import { useSubscribedChannels } from "@/hooks/useSubscriptions";
import { useCurrentUser } from "@/hooks/useAuth";
import { ChannelCard } from "@/components/channel/ChannelCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

export default function SubscriptionsPage() {
  const { data: currentUser } = useCurrentUser();
  const { data: channels, isLoading } = useSubscribedChannels(currentUser?._id);

  return (
    <div className="space-y-5 p-4 md:p-6">
      <h1 className="text-2xl font-bold">Subscriptions</h1>

      {isLoading || !currentUser ? (
        <div className={GRID}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-xl border p-4"
            >
              <Skeleton className="size-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      ) : !channels?.length ? (
        <EmptyState
          icon={Users}
          title="No subscriptions yet"
          description="Channels you subscribe to will appear here."
        />
      ) : (
        <div className={GRID}>
          {channels.map((c) => (
            <ChannelCard key={c._id} channel={c} />
          ))}
        </div>
      )}
    </div>
  );
}
