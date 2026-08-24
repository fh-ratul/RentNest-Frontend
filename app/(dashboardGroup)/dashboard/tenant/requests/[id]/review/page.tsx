import { notFound } from "next/navigation";
import { getRentalById } from "../../../_actions/rentalActions";
import ReviewForm from "@/components/dashboard/review-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getRentalById(id);

  if (!result.success) notFound();

  const rental = result.data;

  if (rental.status !== "COMPLETED") {
    return (
      <div className="mx-auto max-w-md py-16 text-center text-muted-foreground">
        You can only review a completed rental.
      </div>
    );
  }

  if (rental.review) {
    return (
      <div className="mx-auto max-w-md py-16 text-center text-muted-foreground">
        You&apos;ve already reviewed this rental.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Leave a Review</h1>
        <p className="text-muted-foreground">{rental.property.title}</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <ReviewForm rentalRequestId={rental.id} />
        </CardContent>
      </Card>
    </div>
  );
}