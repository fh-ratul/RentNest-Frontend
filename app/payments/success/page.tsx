import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmPaymentStatus from "@/components/payment/confirm-payment-status";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-xl font-semibold">Missing session</h1>
        <p className="text-muted-foreground">No payment session was found.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/tenant">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return <ConfirmPaymentStatus sessionId={session_id} />;
}