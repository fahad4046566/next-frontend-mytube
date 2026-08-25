"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { commentsApi } from "@/lib/api/comments";

const LIMIT = 10;

export function useComments(videoId, page = 1) {
  return useQuery({
    queryKey: ["comments", videoId, page],
    queryFn: async () => {
      const res = await commentsApi.list(videoId, { page, limit: LIMIT });
      return res.data; // { comments, totalComments, totalPages, currentPage, limit }
    },
    enabled: !!videoId,
    placeholderData: keepPreviousData,
  });
}

export function useAddComment(videoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => commentsApi.add(videoId, content),
    onSuccess: (res) => {
      // Prefix invalidate → is video ke saare comment pages refetch.
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
      toast.success(res.message || "Comment added");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add comment");
    },
  });
}

export function useUpdateComment(videoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }) => commentsApi.update(commentId, content),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
      toast.success(res.message || "Comment updated");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update comment");
    },
  });
}

export function useDeleteComment(videoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => commentsApi.remove(commentId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
      toast.success(res.message || "Comment deleted");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete comment");
    },
  });
}
