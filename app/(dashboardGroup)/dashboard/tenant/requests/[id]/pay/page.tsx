import { notFound } from "next/navigation";
import { CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import { getRentalById } from "../../../_actions/rentalActions";
import PayButton from "@/components/dashboard/pay-button";
import PropertyImage from "@/components/shared/property-image";
import EmptyState from "@/components/shared/empty-state";
import { PageHeader, Panel } from "@/components/dashboard/page-header";

export default async function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getRentalById(id);

  if (!result.success) notFound();

  const rental = result.data;

  if (rental.status !== "APPROVED") {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="Nothing to pay"
        description="This rental request is not awaiting payment."
        ctaLabel="Back to dashboard"
        ctaHref="/dashboard/tenant"
      />
    );
  }

  const price = Number(rental.property.price).toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="Complete payment" description="Your request was approved — one last step." />
      <Panel className="shadow-lift">
        <div className="relative h-48 overflow-hidden bg-muted">
          <PropertyImage src={rental.property.images?.[0]} alt={rental.property.title} sizes="512px" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <h2 className="text-lg font-semibold">{rental.property.title}</h2>
            <p className="flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="size-3.5" /> {rental.property.address}, {rental.property.city}
            </p>
          </div>
        </div>
        <div className="space-y-5 p-6">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="size-4" /> Move-in
              </dt>
              <dd className="font-medium">{new Date(rental.moveInDate).toLocaleDateString()}</dd>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <dt className="text-muted-foreground">Amount due</dt>
              <dd className="font-heading text-3xl font-medium tracking-tight">${price}</dd>
            </div>
          </dl>
          <PayButton rentalRequestId={rental.id} />
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-success" /> You&apos;ll be redirected to Stripe&apos;s secure checkout
          </p>
        </div>
      </Panel>
    </div>
  );
}
