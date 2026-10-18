"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmPayment } from "@/app/payments/_actions/confirmPaymentActions";
import StatusScreen from "@/components/shared/status-screen";

type Result = { success: boolean; message?: string } | null;

export default function ConfirmPaymentStatus({ sessionId }: { sessionId: string }) {
  const [result, setResult] = useState<Result>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await confirmPayment(sessionId);
      setResult(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (isPending || !result) {
    return (
      <StatusScreen icon={Loader2} spin title="Confirming payment..." description="This will only take a moment." />
    );
  }

  return (
    <StatusScreen
      icon={result.success ? CheckCircle2 : XCircle}
      tone={result.success ? "success" : "danger"}
      title={result.success ? "Payment successful" : "Payment not confirmed"}
      description={result.success ? "Your rental is now active. Welcome home!" : result.message}
    >
      <Button asChild size="lg">
        <Link href="/dashboard/tenant">Back to dashboard</Link>
      </Button>
    </StatusScreen>
  );
}
