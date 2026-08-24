"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ActionState, createReviewAction } from "@/app/(dashboardGroup)/dashboard/tenant/_actions/reviewActions";

const initialState: ActionState = null;

export default function ReviewForm({ rentalRequestId }: { rentalRequestId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [state, action, pending] = useActionState(
    createReviewAction.bind(null, rentalRequestId),
    initialState
  );

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("Review submitted!");
      router.push("/dashboard/tenant");
    } else {
      toast.error(state.message || "Failed to submit review");
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label>Rating</Label>
        <input type="hidden" name="rating" value={rating} />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  (hovered || rating) >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">Comment (optional)</Label>
        <Textarea id="comment" name="comment" rows={4} placeholder="Share your experience..." />
      </div>
      <Button type="submit" disabled={pending || rating === 0} className="w-full">
        {pending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}