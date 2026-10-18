"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Building2, House } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { registerAction, ActionState } from "../_actions/authActions";
import GoogleSignIn from "./GoogleSignIn";

const initialState: ActionState = null;

const ROLES = [
  { value: "TENANT", label: "Tenant", hint: "Looking for a home", icon: House },
  { value: "LANDLORD", label: "Landlord", hint: "Renting out a place", icon: Building2 },
] as const;

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
            className={cn("h-11", state?.fieldErrors?.name && "border-destructive focus-visible:ring-destructive/30")}
          />
          {state?.fieldErrors?.name && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className={cn("h-11", state?.fieldErrors?.email && "border-destructive focus-visible:ring-destructive/30")}
          />
          {state?.fieldErrors?.email && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className={cn("h-11", state?.fieldErrors?.password && "border-destructive focus-visible:ring-destructive/30")}
          />
          {state?.fieldErrors?.password && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.password}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>I am a</Label>
          <div className="grid grid-cols-2 gap-2" role="radiogroup">
            {ROLES.map(({ value, label, hint, icon: Icon }) => (
              <label
                key={value}
                className={cn(
                  "group relative flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all duration-300 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/40",
                  role === value
                    ? "border-primary bg-primary/5 ring-3 ring-primary/15"
                    : "hover:border-primary/40 hover:bg-muted/50"
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={role === value}
                  onChange={() => setRole(value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                    role === value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{hint}</span>
                </span>
              </label>
            ))}
          </div>
          {state?.fieldErrors?.role && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.role}</p>}
        </div>
        <Button type="submit" size="lg" disabled={pending} className="w-full">
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <GoogleSignIn role={role} text="signup_with" />
    </>
  );
};

export default RegisterForm;