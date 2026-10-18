"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatusScreen from "@/components/shared/status-screen";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      icon={AlertTriangle}
      tone="danger"
      title="Something went wrong"
      description="An unexpected error occurred. You can try again, or head back home."
    >
      <Button variant="outline" size="lg" onClick={() => reset()}>
        <RotateCw className="size-4" /> Try again
      </Button>
      <Button asChild size="lg">
        <Link href="/">
          <Home className="size-4" /> Go home
        </Link>
      </Button>
    </StatusScreen>
  );
}
