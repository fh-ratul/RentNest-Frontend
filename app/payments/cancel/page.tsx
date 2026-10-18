import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusScreen from "@/components/shared/status-screen";

export default function PaymentCancelPage() {
  return (
    <StatusScreen
      icon={XCircle}
      tone="neutral"
      title="Payment cancelled"
      description="No charge was made. You can try again anytime from your dashboard."
    >
      <Button asChild size="lg">
        <Link href="/dashboard/tenant">Back to dashboard</Link>
      </Button>
    </StatusScreen>
  );
}
