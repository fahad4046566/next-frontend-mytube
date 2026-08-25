import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ChannelCard({ channel }) {
  return (
    <Link
      href={`/channel/${channel.username}`}
      className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors hover:bg-accent"
    >
      <Avatar className="size-16">
        <AvatarImage src={channel.avatar} alt={channel.username} />
        <AvatarFallback className="text-lg">
          {channel.fullName?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">
          {channel.fullName || channel.username}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          @{channel.username}
        </p>
      </div>
    </Link>
  );
}
