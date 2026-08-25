"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, Globe, EyeOff } from "lucide-react";

import { videoDetailsSchema } from "@/lib/validation/video";
import {
  useUpdateVideo,
  useDeleteVideo,
  useTogglePublish,
} from "@/hooks/useVideos";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export function VideoOwnerActions({ video }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutate: updateVideo, isPending: isUpdating } = useUpdateVideo();
  const { mutate: deleteVideo, isPending: isDeleting } = useDeleteVideo();
  const { mutate: togglePublish, isPending: isToggling } = useTogglePublish();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(videoDetailsSchema),
    defaultValues: {
      title: video.title || "",
      description: video.description || "",
    },
  });

  const openEdit = () => {
    reset({ title: video.title || "", description: video.description || "" });
    setEditOpen(true);
  };

  const onSave = (values) => {
    updateVideo(
      { videoId: video._id, data: values },
      { onSuccess: () => setEditOpen(false) },
    );
  };

  const onDelete = () => {
    deleteVideo(video._id, {
      onSuccess: () => {
        setDeleteOpen(false);
        router.push("/videos");
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={openEdit}>
        <Pencil className="size-4" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={isToggling}
        onClick={() =>
          togglePublish({ videoId: video._id, publish: String(!video.isPublished) })
        }
      >
        {video.isPublished ? (
          <>
            <EyeOff className="size-4" />
            Unpublish
          </>
        ) : (
          <>
            <Globe className="size-4" />
            Publish
          </>
        )}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={isDeleting}
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="size-4" />
        Delete
      </Button>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit video</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
            <Controller
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-title">Title</FieldLabel>
                  <Input id="edit-title" {...field} />
                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-desc">Description</FieldLabel>
                  <Textarea id="edit-desc" rows={4} {...field} />
                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </Field>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this video?"
        description="This permanently removes the video and its files from Cloudinary. This cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={onDelete}
      />
    </div>
  );
}
