"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useCurrentUser } from "@/hooks/useAuth";
import { useUpdateComment, useDeleteComment } from "@/hooks/useComments";
import { timeAgo } from "@/lib/format";

export function CommentItem({ comment, videoId }) {
  const { data: currentUser } = useCurrentUser();
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(videoId);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(videoId);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const owner = comment.owner || {};
  const isOwner =
    currentUser?._id && owner?._id && currentUser._id === owner._id;

  const onSave = () => {
    const content = draft.trim();
    if (!content) return;
    updateComment(
      { commentId: comment._id, content },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const onCancel = () => {
    setDraft(comment.content);
    setIsEditing(false);
  };

  const onDelete = () => {
    deleteComment(comment._id, { onSuccess: () => setDeleteOpen(false) });
  };

  return (
    <div className="flex gap-3">
      <Avatar className="size-9">
        <AvatarImage src={owner.avatar} alt={owner.username} />
        <AvatarFallback>
          {owner.fullName?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-x-2">
          <span className="text-sm font-medium">
            {owner.fullName || owner.username}
          </span>
          <span className="text-xs text-muted-foreground">
            @{owner.username} • {timeAgo(comment.createdAt)}
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={onSave} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save"}
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
        )}

        {isOwner && !isEditing ? (
          <div className="flex gap-1 pt-0.5">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-muted-foreground"
              onClick={() => {
                setDraft(comment.content);
                setIsEditing(true);
              }}
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-destructive"
              onClick={() => setDeleteOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this comment?"
        description="This cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={onDelete}
      />
    </div>
  );
}
