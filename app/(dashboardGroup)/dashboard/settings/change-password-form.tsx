"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionState, changePasswordAction } from "./_actions/settingsActions";

const initialState: ActionState = null;

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message || "Password changed");
      formRef.current?.reset();
    } else {
      toast.error(state.message || "Failed to change password");
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="oldPassword">Current password</Label>
        <Input id="oldPassword" name="oldPassword" className="h-10" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input id="newPassword" name="newPassword" className="h-10" type="password" required minLength={6} />
      </div>
      <Button type="submit" disabled={pending} className="px-5">
        {pending ? "Updating..." : "Change password"}
      </Button>
    </form>
  );
}