"use client";

import { useEffect, useState } from "react";
import { UserPlus, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToggleSubscription } from "@/hooks/useChannel";

// Optimistic toggle; count header se aata hai (toggle ke baad channel query refetch hoti hai).
export function SubscribeButton({ channelId, username, isSubscribed }) {
  const { mutate: toggle, isPending } = useToggleSubscription();
  const [subscribed, setSubscribed] = useState(!!isSubscribed);

  useEffect(() => {
    setSubscribed(!!isSubscribed);
  }, [isSubscribed]);

  const onClick = () => {
    const prev = subscribed;
    setSubscribed(!prev); // optimistic
    toggle({ channelId, username }, { onError: () => setSubscribed(prev) });
  };

  return (
    <Button
      variant={subscribed ? "outline" : "default"}
      onClick={onClick}
      disabled={isPending}
      aria-pressed={subscribed}
    >
      {subscribed ? (
        <>
          <UserCheck className="size-4" />
          Subscribed
        </>
      ) : (
        <>
          <UserPlus className="size-4" />
          Subscribe
        </>
      )}
    </Button>
  );
}
