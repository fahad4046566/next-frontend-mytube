import { Home, Compass, Users, Upload, ListVideo, History, User } from "lucide-react";

// Sidebar nav.
export const NAV_LINKS = [
  { id: 1, name: "Home", href: "/dashboard", icon: Home },
  { id: 2, name: "Explore", href: "/videos", icon: Compass },
  { id: 7, name: "Subscriptions", href: "/subscriptions", icon: Users },
  { id: 3, name: "Upload", href: "/upload", icon: Upload },
  { id: 4, name: "Playlists", href: "/playlists", icon: ListVideo },
  { id: 5, name: "History", href: "/history", icon: History },
  { id: 6, name: "Profile", href: "/profile", icon: User },
];
