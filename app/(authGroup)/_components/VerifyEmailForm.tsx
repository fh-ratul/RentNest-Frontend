"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { verifyEmailAction, resendOtpAction, ActionState } from "../_actions/authActions";

const initialState: ActionState = null;

// Matches the OTP's lifetime on the backend.
const OTP_TTL_SECONDS = 60;

const VerifyEmailForm = ({ email: initialEmail }: { email: string }) => {
  const [state, action, pending] = useActionState(verifyEmailAction, initialState);
  const [email, setEmail] = useState(initialEmail);
  const [secondsLeft, setSecondsLeft] = useState(OTP_TTL_SECONDS);
  const [resending, startResend] = useTransition();

  useEffect(() => {
    if (state && !state.success && !state.fieldErrors) {
      toast.error(state.message || "Verification failed");
    }
  }, [state]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = () => {
    startResend(async () => {
      const result = await resendOtpAction(email);

      if (result?.success) {
        toast.success("A new code has been sent to your email");
        setSecondsLeft(OTP_TTL_SECONDS);
      } else {
        toast.error(result?.message || "Could not send a new code");
      }
    });
  };

  return (
    <form action={action} className="space-y-4">
      {initialEmail ? (
        <input type="hidden" name="email" value={email} />
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn("h-11", state?.fieldErrors?.email && "border-destructive focus-visible:ring-destructive/30")}
          />
          {state?.fieldErrors?.email && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.email}</p>}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="otp">Verification code</Label>
        <Input
          id="otp"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="123456"
          autoFocus
          className={cn(
            "h-14 text-center font-heading text-2xl font-semibold tracking-[0.5em]",
            state?.fieldErrors?.otp && "border-destructive focus-visible:ring-destructive/30"
          )}
        />
        {state?.fieldErrors?.otp && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.otp}</p>}
        <p className="text-xs text-muted-foreground">
          {secondsLeft > 0 ? `The code expires in ${secondsLeft}s` : "The code has expired. Request a new one."}
        </p>
      </div>
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Verifying..." : "Verify email"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        disabled={resending || secondsLeft > 0 || !email}
        onClick={handleResend}
      >
        {resending ? "Sending..." : secondsLeft > 0 ? `Resend code in ${secondsLeft}s` : "Resend code"}
      </Button>
    </form>
  );
};

export default VerifyEmailForm;
