import { z } from "zod";

// Files (video/thumbnail) alag se handle hote hain (state), yahan sirf text fields.
export const videoDetailsSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Title is too long"),
  description: z.string().min(1, "Description is required"),
});
