"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionState, updateProfileAction } from "./_actions/settingsActions";

const initialState: ActionState = null;

export default function UpdateProfileForm({ currentName }: { currentName: string }) {
  const [state, action, pending] = useActionState(updateProfileAction, initialState);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message || "Profile updated");
    else toast.error(state.message || "Update failed");
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" defaultValue={currentName} required minLength={2} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}