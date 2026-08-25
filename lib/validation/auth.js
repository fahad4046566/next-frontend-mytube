import { z } from "zod";

// Login: aik hi field "email ya username" + password.
export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

// Register: sirf text fields yahan validate hote hain.
// avatar/coverImage files register page me alag se handle hoti hain (FormData).
export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscore allowed"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
