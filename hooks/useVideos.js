"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { videosApi } from "@/lib/api/videos";

// List (search/sort/pagination). Purana data dikhta rahe jab tak naya aaye.
// options.enabled se query ko gate kar sakte hain (jaise channel._id aane ka wait).
export function useVideos(params, options = {}) {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: async () => {
      const res = await videosApi.list(params);
      return res.data; // { videos, totalVideos, totalPages, currentPage, limit }
    },
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

// Watch – POST se views badhte hain, isliye ek hi baar fetch (staleTime Infinity).
export function useVideo(videoId) {
  return useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const res = await videosApi.getById(videoId);
      return res.data;
    },
    enabled: !!videoId,
    staleTime: Infinity,
    refetchOnMount: false,
    retry: false,
  });
}

export function useUploadConfig() {
  return useQuery({
    queryKey: ["uploadConfig"],
    queryFn: async () => {
      const res = await videosApi.getUploadConfig();
      return res.data; // { cloudName, uploadPreset }
    },
    staleTime: Infinity,
  });
}

export function usePublishVideo() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => videosApi.publish(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success(res.message || "Video published");
      const id = res.data?._id;
      router.push(id ? `/videos/${id}` : "/videos");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to publish video");
    },
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, data }) => videosApi.update(videoId, data),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["video", vars.videoId] });
      toast.success(res.message || "Video updated");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update video");
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId) => videosApi.remove(videoId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success(res.message || "Video deleted");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete video");
    },
  });
}

export function useTogglePublish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, publish }) => videosApi.toggleStatus(videoId, publish),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["video", vars.videoId] });
      toast.success(res.message || "Status updated");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });
}
