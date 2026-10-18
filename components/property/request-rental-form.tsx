"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ActionState, createRentalRequestAction } from "@/app/properties/_actions/rentalRequestActions";

const initialState: ActionState = null;

export default function RequestRentalForm({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    createRentalRequestAction.bind(null, propertyId),
    initialState
  );

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("Rental request submitted!");
      router.push("/dashboard/tenant");
    } else {
      toast.error(state.message || "Failed to submit request");
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="moveInDate">Move-in date</Label>
        <Input id="moveInDate" name="moveInDate" type="date" required className="h-10" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message to landlord (optional)</Label>
        <Textarea id="message" name="message" rows={3} placeholder="Tell the landlord a bit about yourself..." />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {pending ? "Submitting..." : "Request to rent"}
      </Button>
    </form>
  );
}
