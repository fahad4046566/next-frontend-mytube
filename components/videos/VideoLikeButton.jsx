"use client";

import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLikedVideoIds, useToggleVideoLike } from "@/hooks/useLikes";

export function VideoLikeButton({ videoId }) {
  const { data: likedIds } = useLikedVideoIds();
  const { mutate: toggleLike, isPending } = useToggleVideoLike();
  const [liked, setLiked] = useState(false);

  // Liked list aane par initial state set karo.
  useEffect(() => {
    if (likedIds) setLiked(likedIds.includes(videoId));
  }, [likedIds, videoId]);

  const onClick = () => {
    const prev = liked;
    setLiked(!prev); // optimistic
    toggleLike(videoId, { onError: () => setLiked(prev) }); // fail ho to revert
  };

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      disabled={isPending}
      aria-pressed={liked}
    >
      <ThumbsUp className={cn("size-4", liked && "fill-current")} />
      {liked ? "Liked" : "Like"}
    </Button>
  );
}
