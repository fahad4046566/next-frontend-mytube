import api from "@/lib/axios";

export const usersApi = {
  // GET /users/c/:username → { _id, fullName, username, subscribersCount,
  //   channelToSubscribedCount, isSubscribed, avatar, coverImage }
  channelProfile: (username) => api.get(`/users/c/${username}`),
  // GET /users/history → [ video objects with owner populated ]
  watchHistory: () => api.get("/users/history"),

  // PATCH /users/update-account { fullName, email } → updated user
  updateAccount: (data) => api.patch("/users/update-account", data),
  // POST /users/change-password { oldPassword, newPassword } → {}
  changePassword: (data) => api.post("/users/change-password", data),
  // PATCH /users/avatar (multipart: avatar) → updated user
  updateAvatar: (formData) => api.patch("/users/avatar", formData),
  // PATCH /users/cover-image (multipart: coverImage) → updated user
  updateCoverImage: (formData) => api.patch("/users/cover-image", formData),
};
