"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/useAuth";
import { SubscribeButton } from "@/components/subscriptions/SubscribeButton";
import { formatViews } from "@/lib/format";

export function ChannelHeader({ channel }) {
  const { data: currentUser } = useCurrentUser();
  const isOwn =
    currentUser?._id && channel?._id && currentUser._id === channel._id;

  return (
    <div className="space-y-4">
      <div className="h-32 w-full overflow-hidden rounded-xl bg-muted sm:h-44">
        {channel.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={channel.coverImage}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 sm:size-20">
            <AvatarImage src={channel.avatar} alt={channel.username} />
            <AvatarFallback className="text-xl">
              {channel.fullName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{channel.fullName}</h1>
            <p className="text-sm text-muted-foreground">@{channel.username}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatViews(channel.subscribersCount)} subscribers •{" "}
              {formatViews(channel.channelToSubscribedCount)} subscribed
            </p>
          </div>
        </div>

        {!isOwn ? (
          <SubscribeButton
            channelId={channel._id}
            username={channel.username}
            isSubscribed={channel.isSubscribed}
          />
        ) : null}
      </div>
    </div>
  );
}
