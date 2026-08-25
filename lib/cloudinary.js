import axios from "axios";

// File ko seedha Cloudinary par unsigned upload karta hai.
// Hamari `api` instance use NAHI karte (alag host + koi auth header nahi).
export async function uploadToCloudinary(
  file,
  { cloudName, uploadPreset, resourceType = "auto", onProgress } = {},
) {
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary config missing");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const { data } = await axios.post(url, form, {
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });

  return data; // { secure_url, public_id, duration, ... }
}
