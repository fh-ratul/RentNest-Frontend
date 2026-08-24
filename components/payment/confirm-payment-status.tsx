"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmPayment } from "@/app/payments/_actions/confirmPaymentActions";

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
      <div className="mx-auto max-w-md py-24 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">Confirming payment...</h1>
        <p className="text-muted-foreground">This will only take a moment.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-24 text-center">
      {result.success ? (
        <>
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="mt-4 text-xl font-semibold">Payment Successful</h1>
          <p className="text-muted-foreground">Your rental is now active.</p>
        </>
      ) : (
        <>
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-xl font-semibold">Payment Not Confirmed</h1>
          <p className="text-muted-foreground">{result.message}</p>
        </>
      )}
      <Button asChild className="mt-6">
        <Link href="/dashboard/tenant">Back to Dashboard</Link>
      </Button>
    </div>
  );
}