"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { playlistSchema } from "@/lib/validation/playlist";
import { useCreatePlaylist, useUpdatePlaylist } from "@/hooks/usePlaylists";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Create + edit dono. `playlist` diya to edit mode.
export function PlaylistFormDialog({ open, onOpenChange, playlist }) {
  const isEdit = !!playlist;
  const { mutate: create, isPending: creating } = useCreatePlaylist();
  const { mutate: update, isPending: updating } = useUpdatePlaylist();
  const pending = creating || updating;

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(playlistSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: playlist?.name || "",
        description: playlist?.description || "",
      });
    }
  }, [open, playlist, reset]);

  const onSubmit = (values) => {
    const data = { name: values.name, description: values.description || "" };
    if (isEdit) {
      update(
        { playlistId: playlist._id, data },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      create(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit playlist" : "New playlist"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="pl-name">Name</FieldLabel>
                <Input id="pl-name" placeholder="My playlist" {...field} />
                <FieldError errors={fieldState.error ? [fieldState.error] : []} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="pl-desc">Description</FieldLabel>
                <Textarea
                  id="pl-desc"
                  rows={3}
                  placeholder="Optional"
                  {...field}
                />
                <FieldError errors={fieldState.error ? [fieldState.error] : []} />
              </Field>
            )}
          />
          <DialogFooter>
            <Button type="submit" variant="crm" disabled={pending}>
              {pending ? "Saving..." : isEdit ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
