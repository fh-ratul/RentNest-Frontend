import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusScreen from "@/components/shared/status-screen";
import ConfirmPaymentStatus from "@/components/payment/confirm-payment-status";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <StatusScreen icon={XCircle} tone="danger" title="Missing session" description="No payment session was found.">
        <Button asChild size="lg">
          <Link href="/dashboard/tenant">Back to dashboard</Link>
        </Button>
      </StatusScreen>
    );
  }

  return <ConfirmPaymentStatus sessionId={session_id} />;
}
