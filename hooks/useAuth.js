"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";

import { authApi } from "@/lib/api/auth";
import { setAuthCookies, clearAuthCookies, ACCESS_TOKEN } from "@/lib/axios";

// Logged-in user – tabhi chalti hai jab access token cookie mojood ho.
export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await authApi.currentUser();
      return res.data; // envelope se user object
    },
    enabled: typeof window !== "undefined" && !!Cookies.get(ACCESS_TOKEN),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data;
      setAuthCookies({ accessToken, refreshToken });
      queryClient.setQueryData(["currentUser"], user);
      toast.success(res.message || "Logged in successfully");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (formData) => authApi.register(formData),
    onSuccess: (res) => {
      toast.success(res.message || "Account created successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Registration failed");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const finish = () => {
    clearAuthCookies();
    queryClient.clear();
    router.push("/login");
    router.refresh();
  };

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      toast.success("Logged out");
      finish();
    },
    onError: () => {
      // Server logout fail ho bhi jaye to client state saaf kar do.
      finish();
    },
  });
}
