"use client";

import { History as HistoryIcon } from "lucide-react";

import { useWatchHistory } from "@/hooks/useWatchHistory";
import { VideoCard } from "@/components/videos/VideoCard";
import { VideoCardSkeleton } from "@/components/videos/VideoCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";

const GRID =
  "grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function HistoryPage() {
  const { data: videos, isLoading } = useWatchHistory();

  return (
    <div className="space-y-5 p-4 md:p-6">
      <h1 className="text-2xl font-bold">Watch History</h1>

      {isLoading ? (
        <div className={GRID}>
          {Array.from({ length: 4 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : !videos?.length ? (
        <EmptyState
          icon={HistoryIcon}
          title="No watch history"
          description="Videos you watch will show up here."
        />
      ) : (
        <div className={GRID}>
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
