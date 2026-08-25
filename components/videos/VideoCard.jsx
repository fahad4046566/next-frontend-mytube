import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDuration, formatViews, timeAgo } from "@/lib/format";

export function VideoCard({ video }) {
  const owner = video?.owner || {};

  return (
    <Link href={`/videos/${video?._id}`} className="group flex flex-col gap-2">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        {video?.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : null}
        <span className="absolute right-1.5 bottom-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(video?.duration)}
        </span>
      </div>
      <div className="flex gap-3">
        <Avatar className="mt-0.5 size-9 shrink-0">
          <AvatarImage src={owner.avatar} alt={owner.username} />
          <AvatarFallback>{owner.fullName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold group-hover:text-primary">
            {video?.title}
          </h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {owner.fullName || owner.username}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatViews(video?.views)} views • {timeAgo(video?.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
