"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare } from "lucide-react";

import { commentSchema } from "@/lib/validation/comment";
import { useComments, useAddComment } from "@/hooks/useComments";
import { useCurrentUser } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { CommentItem } from "@/components/comments/CommentItem";

export function CommentSection({ videoId }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useComments(videoId, page);
  const { data: currentUser } = useCurrentUser();
  const { mutate: addComment, isPending: isAdding } = useAddComment(videoId);

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  const comments = data?.comments || [];
  const totalComments = data?.totalComments || 0;
  const totalPages = data?.totalPages || 0;

  const onSubmit = ({ content }) => {
    addComment(content, {
      onSuccess: () => {
        reset({ content: "" });
        setPage(1); // naya comment page 1 par aata hai
      },
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        {totalComments} {totalComments === 1 ? "Comment" : "Comments"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
        <Avatar className="size-9">
          <AvatarImage src={currentUser?.avatar} alt={currentUser?.username} />
          <AvatarFallback>
            {currentUser?.fullName?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Controller
            control={control}
            name="content"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea placeholder="Add a comment..." rows={2} {...field} />
                <FieldError errors={fieldState.error ? [fieldState.error] : []} />
              </Field>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isAdding}>
              {isAdding ? "Posting..." : "Comment"}
            </Button>
          </div>
        </div>
      </form>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No comments yet"
          description="Be the first to comment."
        />
      ) : (
        <>
          <div className="space-y-5">
            {comments.map((c) => (
              <CommentItem key={c._id} comment={c} videoId={videoId} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
