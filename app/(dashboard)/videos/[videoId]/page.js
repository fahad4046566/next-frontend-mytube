"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useVideo } from "@/hooks/useVideos";
import { useCurrentUser } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoOwnerActions } from "@/components/videos/VideoOwnerActions";
import { VideoLikeButton } from "@/components/videos/VideoLikeButton";
import { AddToPlaylistDialog } from "@/components/playlists/AddToPlaylistDialog";
import { CommentSection } from "@/components/comments/CommentSection";
import { formatViews, timeAgo } from "@/lib/format";

export default function WatchPage() {
  const { videoId } = useParams();
  const { data: video, isLoading, isError } = useVideo(videoId);
  const { data: currentUser } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-6">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    );
  }

  if (isError || !video) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-xl font-semibold">Video not found</h1>
        <p className="mt-2 text-muted-foreground">
          Ye video maujood nahi ya remove ho chuki hai.
        </p>
      </div>
    );
  }

  const owner = video.owner || {};
  const isOwner =
    currentUser?._id && owner?._id && currentUser._id === owner._id;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-6">
      <div className="aspect-video overflow-hidden rounded-xl bg-black">
        <video
          src={video.videoFile}
          poster={video.thumbnail}
          controls
          className="h-full w-full"
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-xl font-bold">{video.title}</h1>
          {!video.isPublished ? (
            <Badge variant="secondary">Unpublished</Badge>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/channel/${owner.username}`}
            className="flex items-center gap-3 rounded-lg transition-opacity hover:opacity-80"
          >
            <Avatar className="size-10">
              <AvatarImage src={owner.avatar} alt={owner.username} />
              <AvatarFallback>
                {owner.fullName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{owner.fullName || owner.username}</p>
              <p className="text-xs text-muted-foreground">@{owner.username}</p>
            </div>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <VideoLikeButton videoId={video._id} />
            <AddToPlaylistDialog videoId={video._id} />
            {isOwner ? <VideoOwnerActions video={video} /> : null}
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm font-medium">
            {formatViews(video.views)} views • {timeAgo(video.createdAt)}
          </p>
          <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
            {video.description}
          </p>
        </div>
      </div>

      <CommentSection videoId={video._id} />
    </div>
  );
}
