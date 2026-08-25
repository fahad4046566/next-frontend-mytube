"use client";

import Link from "next/link";
import { useState } from "react";
import { ListVideo, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PlaylistFormDialog } from "@/components/playlists/PlaylistFormDialog";
import { useDeletePlaylist } from "@/hooks/usePlaylists";

export function PlaylistCard({ playlist }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deletePlaylist, isPending } = useDeletePlaylist();
  const count = playlist.videos?.length || 0;

  return (
    <div className="flex flex-col gap-3 rounded-xl border p-4">
      <Link
        href={`/playlists/${playlist._id}`}
        className="group flex items-center gap-3"
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
          <ListVideo className="size-5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold group-hover:text-primary">
            {playlist.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {count} {count === 1 ? "video" : "videos"}
          </p>
        </div>
      </Link>

      {playlist.description ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {playlist.description}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="size-3.5" /> Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive"
          onClick={() => setDeleteOpen(true)}
          disabled={isPending}
        >
          <Trash2 className="size-3.5" /> Delete
        </Button>
      </div>

      <PlaylistFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        playlist={playlist}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this playlist?"
        description="This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() =>
          deletePlaylist(playlist._id, { onSuccess: () => setDeleteOpen(false) })
        }
      />
    </div>
  );
}
