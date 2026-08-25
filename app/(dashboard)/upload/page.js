"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { videoDetailsSchema } from "@/lib/validation/video";
import { useUploadConfig, usePublishVideo } from "@/hooks/useVideos";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function UploadPage() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(videoDetailsSchema),
    defaultValues: { title: "", description: "" },
    mode: "all",
  });

  const { data: config } = useUploadConfig();
  const { mutate: publishVideo, isPending: isPublishing } = usePublishVideo();

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [fileErrors, setFileErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ thumb: 0, video: 0 });

  const onSubmit = async (values) => {
    const errs = {};
    if (!videoFile) errs.video = "Video file is required";
    if (!thumbnail) errs.thumb = "Thumbnail is required";
    setFileErrors(errs);
    if (Object.keys(errs).length) return;

    if (!config?.cloudName || !config?.uploadPreset) {
      toast.error("Upload config not ready — thodi der baad try karein.");
      return;
    }

    try {
      setUploading(true);
      setProgress({ thumb: 0, video: 0 });

      // 1) Thumbnail (image)
      const thumbRes = await uploadToCloudinary(thumbnail, {
        cloudName: config.cloudName,
        uploadPreset: config.uploadPreset,
        resourceType: "image",
        onProgress: (p) => setProgress((s) => ({ ...s, thumb: p })),
      });

      // 2) Video file
      const videoRes = await uploadToCloudinary(videoFile, {
        cloudName: config.cloudName,
        uploadPreset: config.uploadPreset,
        resourceType: "video",
        onProgress: (p) => setProgress((s) => ({ ...s, video: p })),
      });

      // 3) Publish – Cloudinary URLs backend ko bhejo
      publishVideo({
        title: values.title,
        description: values.description,
        thumbnail: thumbRes.secure_url,
        videoFile: videoRes.secure_url,
        duration: String(videoRes.duration ?? 0),
      });
    } catch (e) {
      toast.error(
        e?.response?.data?.error?.message || e?.message || "Upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  const busy = uploading || isPublishing;

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload a video</CardTitle>
          <CardDescription>
            Share your video with the MyTube community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Controller
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input id="title" placeholder="My awesome video" {...field} />
                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="What's this video about?"
                    {...field}
                  />
                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </Field>
              )}
            />

            <Field data-invalid={!!fileErrors.video}>
              <FieldLabel htmlFor="videoFile">
                Video file <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="videoFile"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  setVideoFile(e.target.files?.[0] || null);
                  setFileErrors((s) => ({ ...s, video: "" }));
                }}
              />
              {fileErrors.video ? (
                <p className="text-sm text-destructive">{fileErrors.video}</p>
              ) : null}
              {uploading ? <Progress value={progress.video} className="mt-1" /> : null}
            </Field>

            <Field data-invalid={!!fileErrors.thumb}>
              <FieldLabel htmlFor="thumbnail">
                Thumbnail <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setThumbnail(e.target.files?.[0] || null);
                  setFileErrors((s) => ({ ...s, thumb: "" }));
                }}
              />
              {fileErrors.thumb ? (
                <p className="text-sm text-destructive">{fileErrors.thumb}</p>
              ) : null}
              {uploading ? <Progress value={progress.thumb} className="mt-1" /> : null}
            </Field>

            <Button type="submit" className="mt-2 w-full" disabled={busy}>
              <UploadCloud className="size-4" />
              {uploading
                ? "Uploading..."
                : isPublishing
                  ? "Publishing..."
                  : "Publish video"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
