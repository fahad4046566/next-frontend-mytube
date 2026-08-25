"use client";

import { useState } from "react";
import { Check, ListPlus, Plus } from "lucide-react";

import { useCurrentUser } from "@/hooks/useAuth";
import {
  useUserPlaylists,
  useAddVideoToPlaylist,
  useRemoveVideoFromPlaylist,
} from "@/hooks/usePlaylists";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Watch page ka "Save to playlist". Dialog khulne par hi playlists fetch hoti hain.
export function AddToPlaylistDialog({ videoId }) {
  const [open, setOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const { data: playlists, isLoading } = useUserPlaylists(
    open ? currentUser?._id : undefined,
  );
  const { mutate: addVideo } = useAddVideoToPlaylist();
  const { mutate: removeVideo } = useRemoveVideoFromPlaylist();

  const isIn = (playlist) =>
    playlist.videos?.some((v) => String(v) === String(videoId));

  const toggle = (playlist) => {
    if (isIn(playlist)) removeVideo({ videoId, playlistId: playlist._id });
    else addVideo({ videoId, playlistId: playlist._id });
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <ListPlus className="size-4" /> Save
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to playlist</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : !playlists?.length ? (
            <p className="text-sm text-muted-foreground">
              No playlists yet. Create one from the Playlists page.
            </p>
          ) : (
            <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
              {playlists.map((p) => {
                const inList = isIn(p);
                return (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => toggle(p)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
                  >
                    <span className="truncate">{p.name}</span>
                    {inList ? (
                      <Check className="size-4 shrink-0 text-primary" />
                    ) : (
                      <Plus className="size-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
