"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Video as VideoIcon } from "lucide-react";

import { useChannel } from "@/hooks/useChannel";
import { useVideos } from "@/hooks/useVideos";
import { ChannelHeader } from "@/components/channel/ChannelHeader";
import { VideoCard } from "@/components/videos/VideoCard";
import { VideoCardSkeleton } from "@/components/videos/VideoCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

const LIMIT = 12;
const GRID =
  "grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function ChannelPage() {
  const { username } = useParams();
  const { data: channel, isLoading, isError } = useChannel(username);
  const [page, setPage] = useState(1);

  // Videos tabhi fetch karo jab channel._id mil jaye.
  const { data: videosData, isLoading: videosLoading } = useVideos(
    {
      page,
      limit: LIMIT,
      sortBy: "createdAt",
      sortType: "desc",
      userId: channel?._id,
    },
    { enabled: !!channel?._id },
  );

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-32 w-full rounded-xl sm:h-44" />
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full sm:size-20" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !channel) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Channel not found</h1>
        <p className="mt-2 text-muted-foreground">
          Ye channel maujood nahi hai.
        </p>
      </div>
    );
  }

  const videos = videosData?.videos || [];
  const totalPages = videosData?.totalPages || 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ChannelHeader channel={channel} />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Videos</h2>
        {videosLoading ? (
          <div className={GRID}>
            {Array.from({ length: 4 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <EmptyState
            icon={VideoIcon}
            title="No videos yet"
            description="This channel hasn't published any videos."
          />
        ) : (
          <>
            <div className={GRID}>
              {videos.map((v) => (
                <VideoCard key={v._id} video={v} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
