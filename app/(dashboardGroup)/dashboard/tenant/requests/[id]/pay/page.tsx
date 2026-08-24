import { notFound } from "next/navigation";
import { getRentalById } from "../../../_actions/rentalActions";
import PayButton from "@/components/dashboard/pay-button";
import PropertyImage from "@/components/shared/property-image";
import { Card, CardContent } from "@/components/ui/card";

export default async function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getRentalById(id);

  if (!result.success) notFound();

  const rental = result.data;

  if (rental.status !== "APPROVED") {
    return (
      <div className="mx-auto max-w-md py-16 text-center text-muted-foreground">
        This rental request is not awaiting payment.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-8">
      <h1 className="text-2xl font-semibold">Complete Payment</h1>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="relative h-40 overflow-hidden rounded-lg bg-muted">
            <PropertyImage src={rental.property.images?.[0]} alt={rental.property.title} />
          </div>
          <div>
            <h2 className="font-semibold">{rental.property.title}</h2>
            <p className="text-sm text-muted-foreground">
              {rental.property.address}, {rental.property.city}
            </p>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-muted-foreground">Amount due</span>
            <span className="text-xl font-bold">${rental.property.price}</span>
          </div>
          <PayButton rentalRequestId={rental.id} />
        </CardContent>
      </Card>
    </div>
  );
}