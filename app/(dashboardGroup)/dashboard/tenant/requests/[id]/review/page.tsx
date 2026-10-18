import { notFound } from "next/navigation";
import { getRentalById } from "../../../_actions/rentalActions";
import ReviewForm from "@/components/dashboard/review-form";
import { MessageSquareText } from "lucide-react";
import EmptyState from "@/components/shared/empty-state";
import { PageHeader, Panel } from "@/components/dashboard/page-header";

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getRentalById(id);

  if (!result.success) notFound();

  const rental = result.data;

  if (rental.status !== "COMPLETED") {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="Not ready for a review"
        description="You can only review a completed rental."
        ctaLabel="Back to dashboard"
        ctaHref="/dashboard/tenant"
      />
    );
  }

  if (rental.review) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="Thanks for your review"
        description="You've already reviewed this rental."
        ctaLabel="Back to dashboard"
        ctaHref="/dashboard/tenant"
      />
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="Leave a review" description={rental.property.title} />
      <Panel className="p-6">
        <ReviewForm rentalRequestId={rental.id} />
      </Panel>
    </div>
  );
}