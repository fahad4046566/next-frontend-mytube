"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { playlistsApi } from "@/lib/api/playlists";

export function useUserPlaylists(userId) {
  return useQuery({
    queryKey: ["playlists", userId],
    queryFn: async () => {
      const res = await playlistsApi.byUser(userId);
      return res.data; // [ playlists ]
    },
    enabled: !!userId,
  });
}

export function usePlaylist(playlistId) {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async () => {
      const res = await playlistsApi.byId(playlistId);
      return res.data; // playlist (videos = ID array)
    },
    enabled: !!playlistId,
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => playlistsApi.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast.success(res.message || "Playlist created");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create playlist");
    },
  });
}

export function useUpdatePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, data }) => playlistsApi.update(playlistId, data),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", vars.playlistId] });
      toast.success(res.message || "Playlist updated");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update playlist");
    },
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playlistId) => playlistsApi.remove(playlistId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast.success(res.message || "Playlist deleted");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete playlist");
    },
  });
}

export function useAddVideoToPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ videoId, playlistId }) =>
      playlistsApi.addVideo(videoId, playlistId),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", vars.playlistId] });
      toast.success(res.message || "Added to playlist");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add to playlist");
    },
  });
}

export function useRemoveVideoFromPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ videoId, playlistId }) =>
      playlistsApi.removeVideo(videoId, playlistId),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", vars.playlistId] });
      toast.success(res.message || "Removed from playlist");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove from playlist",
      );
    },
  });
}
