"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { usersApi } from "@/lib/api/users";

// Sabhi mutations ["currentUser"] cache update karte hain taake sidebar/profile refresh ho.
export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => usersApi.updateAccount(data),
    onSuccess: (res) => {
      queryClient.setQueryData(["currentUser"], res.data);
      toast.success(res.message || "Profile updated");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data) => usersApi.changePassword(data),
    onSuccess: (res) => {
      toast.success(res.message || "Password changed");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to change password");
    },
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => usersApi.updateAvatar(formData),
    onSuccess: (res) => {
      queryClient.setQueryData(["currentUser"], res.data);
      toast.success(res.message || "Avatar updated");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update avatar");
    },
  });
}

export function useUpdateCoverImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => usersApi.updateCoverImage(formData),
    onSuccess: (res) => {
      queryClient.setQueryData(["currentUser"], res.data);
      toast.success(res.message || "Cover image updated");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update cover image",
      );
    },
  });
}
