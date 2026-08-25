"use client";

import { useEffect, useState } from "react";
import { Search, Video as VideoIcon } from "lucide-react";

import { useVideos } from "@/hooks/useVideos";
import useDebounce from "@/hooks/useDebounce";
import { VIDEO_SORT, DEFAULT_SORT } from "@/constants/videoSort";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VideoCard } from "@/components/videos/VideoCard";
import { VideoCardSkeleton } from "@/components/videos/VideoCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";

const LIMIT = 12;
const GRID = "grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function VideosPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  // Search/sort change par pehle page par wapas.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort]);

  const sortOption = VIDEO_SORT.find((o) => o.value === sort) || VIDEO_SORT[0];
  const params = {
    page,
    limit: LIMIT,
    sortBy: sortOption.sortBy,
    sortType: sortOption.sortType,
    ...(debouncedSearch ? { query: debouncedSearch } : {}),
  };

  const { data, isLoading, isFetching } = useVideos(params);
  const videos = data?.videos || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Explore</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-8 sm:w-64"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[150px]">
              <SelectValue>
                {(v) => VIDEO_SORT.find((o) => o.value === v)?.label || "Sort"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {VIDEO_SORT.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className={GRID}>
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <EmptyState
          icon={VideoIcon}
          title="No videos found"
          description={
            debouncedSearch
              ? "Try a different search term."
              : "Be the first to upload a video."
          }
        />
      ) : (
        <>
          <div className={`${GRID} ${isFetching ? "opacity-60" : ""}`}>
            {videos.map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
