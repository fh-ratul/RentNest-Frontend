"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPaymentAction } from "@/app/(dashboardGroup)/dashboard/tenant/_actions/paymentActions";

export default function PayButton({ rentalRequestId }: { rentalRequestId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const result = await createPaymentAction(rentalRequestId);

    if (result.success && result.data?.paymentUrl) {
      window.location.href = result.data.paymentUrl;
    } else {
      toast.error(result.message || "Could not start payment");
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={loading} size="lg" className="w-full">
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
      {loading ? "Redirecting to checkout..." : "Pay securely"}
    </Button>
  );
}