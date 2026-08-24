import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
      <h1 className="mt-4 text-xl font-semibold">Payment Cancelled</h1>
      <p className="text-muted-foreground">You can try again anytime from your dashboard.</p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/tenant">Back to Dashboard</Link>
      </Button>
    </div>
  );
}