"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { registerAction, ActionState } from "../_actions/authActions";
import GoogleSignIn from "./GoogleSignIn";

const initialState: ActionState = null;

const RegisterForm = () => {
  const [state, action, pending] = useActionState(registerAction, initialState);
  const [role, setRole] = useState<"TENANT" | "LANDLORD">("TENANT");

  useEffect(() => {
    if (state && !state.success && !state.fieldErrors) {
      toast.error(state.message || "Registration failed");
    }
  }, [state]);

  return (
    <>
      <form action={action} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Jane Doe"
            className={cn(state?.fieldErrors?.name && "border-red-500 focus-visible:ring-red-500")}
          />
          {state?.fieldErrors?.name && <p className="text-xs text-red-500">{state.fieldErrors.name}</p>}
        </div>
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
        <div className="space-y-1.5">
          <Label>I am a</Label>
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="TENANT"
                checked={role === "TENANT"}
                onChange={() => setRole("TENANT")}
              />
              Tenant
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="LANDLORD"
                checked={role === "LANDLORD"}
                onChange={() => setRole("LANDLORD")}
              />
              Landlord
            </label>
          </div>
          {state?.fieldErrors?.role && <p className="text-xs text-red-500">{state.fieldErrors.role}</p>}
        </div>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <GoogleSignIn role={role} text="signup_with" />
    </>
  );
};

export default RegisterForm;