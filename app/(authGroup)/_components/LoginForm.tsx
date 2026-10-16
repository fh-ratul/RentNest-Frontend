"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { loginAction, ActionState } from "../_actions/authActions";
import GoogleSignIn from "./GoogleSignIn";

const initialState: ActionState = null;

const LoginForm = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";
  const [state, action, pending] = useActionState(loginAction.bind(null, redirectTo), initialState);

  useEffect(() => {
    if (state && !state.success && !state.fieldErrors) {
      toast.error(state.message || "Login failed");
    }
  }, [state]);

  return (
    <>
      <form action={action} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className={cn(state?.fieldErrors?.email && "border-red-500 focus-visible:ring-red-500")}
          />
          {state?.fieldErrors?.email && <p className="text-xs text-red-500">{state.fieldErrors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className={cn(state?.fieldErrors?.password && "border-red-500 focus-visible:ring-red-500")}
          />
          {state?.fieldErrors?.password && <p className="text-xs text-red-500">{state.fieldErrors.password}</p>}
        </div>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Logging in..." : "Log in"}
        </Button>
      </form>
      <GoogleSignIn />
    </>
  );
};

export default LoginForm;