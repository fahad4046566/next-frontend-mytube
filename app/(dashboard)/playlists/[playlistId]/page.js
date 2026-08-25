"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ListVideo, Trash2 } from "lucide-react";

import { usePlaylist, useRemoveVideoFromPlaylist } from "@/hooks/usePlaylists";
import { useVideos } from "@/hooks/useVideos";
import { useCurrentUser } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDuration, formatViews, timeAgo } from "@/lib/format";

export default function PlaylistDetailPage() {
  const { playlistId } = useParams();
  const { data: playlist, isLoading, isError } = usePlaylist(playlistId);
  const { data: currentUser } = useCurrentUser();
  const { mutate: removeVideo, isPending: removing } =
    useRemoveVideoFromPlaylist();

  // Backend playlist videos ko populate nahi karta (sirf IDs) aur multi-get endpoint
  // nahi hai → published videos list se cross-reference karte hain.
  const { data: videosData } = useVideos({
    limit: 1000,
    sortBy: "createdAt",
    sortType: "desc",
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !playlist) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Playlist not found</h1>
        <p className="mt-2 text-muted-foreground">
          Ye playlist maujood nahi ya remove ho chuki hai.
        </p>
      </div>
    );
  }

  const ids = (playlist.videos || []).map(String);
  const byId = new Map((videosData?.videos || []).map((v) => [String(v._id), v]));
  const videos = ids.map((id) => byId.get(id)).filter(Boolean); // order preserve
  const missing = ids.length - videos.length;
  const isOwner =
    currentUser?._id && String(currentUser._id) === String(playlist.owner);

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        {playlist.description ? (
          <p className="mt-1 text-muted-foreground">{playlist.description}</p>
        ) : null}
        <p className="mt-1 text-sm text-muted-foreground">
          {ids.length} {ids.length === 1 ? "video" : "videos"}
        </p>
      </div>

      {videos.length === 0 ? (
        <EmptyState
          icon={ListVideo}
          title="No videos to show"
          description="Add videos to this playlist from any video's Save button."
        />
      ) : (
        <div className="space-y-3">
          {videos.map((v) => (
            <div key={v._id} className="flex gap-3 rounded-xl border p-2">
              <Link
                href={`/videos/${v._id}`}
                className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-44"
              >
                {v.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
                {v.duration ? (
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] text-white">
                    {formatDuration(v.duration)}
                  </span>
                ) : null}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
                <div className="min-w-0">
                  <Link href={`/videos/${v._id}`}>
                    <p className="line-clamp-2 text-sm font-semibold hover:text-primary">
                      {v.title}
                    </p>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {v.owner?.fullName || v.owner?.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatViews(v.views)} views • {timeAgo(v.createdAt)}
                  </p>
                </div>

                {isOwner ? (
                  <div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-destructive"
                      disabled={removing}
                      onClick={() =>
                        removeVideo({ videoId: v._id, playlistId })
                      }
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {missing > 0 ? (
        <p className="text-xs text-muted-foreground">
          {missing} video{missing > 1 ? "s" : ""} not shown (unpublished or
          unavailable).
        </p>
      ) : null}
    </div>
  );
}
