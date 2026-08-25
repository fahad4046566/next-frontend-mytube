"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/constants/navLinks";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";

export function Sidebar({ onClose }) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const { mutate: logout, isPending } = useLogout();

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={onClose}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Play className="h-4 w-4 fill-current" />
          </span>
          MyTube
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_LINKS.map((link) => {
          const active =
            pathname === link.href || pathname?.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.id}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User + actions */}
      <div className="flex items-center gap-3 p-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.avatar} alt={user?.username} />
          <AvatarFallback>
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user?.fullName || "User"}</p>
          <p className="truncate text-xs text-muted-foreground">
            @{user?.username || "username"}
          </p>
        </div>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          title="Log out"
          disabled={isPending}
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
