"use client";

import { useState } from "react";
import { ListVideo, Plus } from "lucide-react";

import { useCurrentUser } from "@/hooks/useAuth";
import { useUserPlaylists } from "@/hooks/usePlaylists";
import { PlaylistCard } from "@/components/playlists/PlaylistCard";
import { PlaylistFormDialog } from "@/components/playlists/PlaylistFormDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

export default function PlaylistsPage() {
  const { data: currentUser } = useCurrentUser();
  const { data: playlists, isLoading } = useUserPlaylists(currentUser?._id);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Playlists</h1>
        <Button variant="crm" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" /> New playlist
        </Button>
      </div>

      {isLoading || !currentUser ? (
        <div className={GRID}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : !playlists?.length ? (
        <EmptyState
          icon={ListVideo}
          title="No playlists yet"
          description="Create your first playlist to organize videos."
        />
      ) : (
        <div className={GRID}>
          {playlists.map((p) => (
            <PlaylistCard key={p._id} playlist={p} />
          ))}
        </div>
      )}

      <PlaylistFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
