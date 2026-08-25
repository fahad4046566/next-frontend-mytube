import api from "@/lib/axios";

// Sab subscription routes auth-required hain (backend router.use(verifyJWT)).
export const subscriptionsApi = {
  // Toggle: data null => ab unsubscribed, object => ab subscribed.
  toggle: (channelId) => api.post(`/subscriptions/c/${channelId}`),
  // Channel ke subscribers (list of users).
  subscribers: (channelId) => api.get(`/subscriptions/c/${channelId}/subscribers`),
  // Jin channels ko subscriberId follow karta hai.
  channels: (subscriberId) => api.get(`/subscriptions/c/${subscriberId}/channels`),
};
