"use client";

import Link from "next/link";
import { Eye, ThumbsUp, Users, Video } from "lucide-react";

import { useChannelStats, useChannelVideos } from "@/hooks/useDashboard";
import { useCurrentUser } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatViews, timeAgo } from "@/lib/format";

function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: user } = useCurrentUser();
  const { data: stats, isLoading: statsLoading } = useChannelStats();
  const { data: videos, isLoading: videosLoading } = useChannelVideos();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back{user?.fullName ? `, ${user.fullName}` : ""}
        </h1>
        <p className="text-muted-foreground">Here&apos;s your channel overview.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Video}
          label="Videos"
          value={formatViews(stats?.totalVideos || 0)}
          loading={statsLoading}
        />
        <StatCard
          icon={Eye}
          label="Views"
          value={formatViews(stats?.totalViews || 0)}
          loading={statsLoading}
        />
        <StatCard
          icon={Users}
          label="Subscribers"
          value={formatViews(stats?.totalSubscribers || 0)}
          loading={statsLoading}
        />
        <StatCard
          icon={ThumbsUp}
          label="Likes"
          value={formatViews(stats?.totalLikes || 0)}
          loading={statsLoading}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Your videos</h2>

        {videosLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : !videos?.length ? (
          <EmptyState
            icon={Video}
            title="No videos yet"
            description="Upload your first video to see it here."
          />
        ) : (
          <div className="space-y-3">
            {videos.map((v) => (
              <Link
                key={v._id}
                href={`/videos/${v._id}`}
                className="flex gap-3 rounded-xl border p-2 transition-colors hover:bg-accent"
              >
                <div className="aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-40">
                  {v.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <p className="line-clamp-2 text-sm font-semibold">{v.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatViews(v.views)} views • {timeAgo(v.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
