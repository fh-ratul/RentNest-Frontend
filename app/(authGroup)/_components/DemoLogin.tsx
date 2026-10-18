"use client";

import { ArrowRight, Building2, House, Loader2, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { DemoRole } from "@/lib/demo-accounts";
import { demoLoginAction } from "../_actions/authActions";

const DEMOS: { role: DemoRole; title: string; body: string; icon: typeof House }[] = [
  { role: "TENANT", title: "Tenant", body: "Browse, request and pay for homes", icon: House },
  { role: "LANDLORD", title: "Landlord", body: "List properties and manage requests", icon: Building2 },
  { role: "ADMIN", title: "Admin", body: "Users, listings and all rentals", icon: ShieldCheck },
];

/**
 * One-click logins for the three roles. The button only names a role; the
 * server looks up that role's demo credentials and logs in.
 */
const DemoLogin = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";
  const [isPending, startTransition] = useTransition();
  const [activeRole, setActiveRole] = useState<DemoRole | null>(null);

  const login = (role: DemoRole) => {
    setActiveRole(role);
    startTransition(async () => {
      const result = await demoLoginAction(role, redirectTo);
      if (result && !result.success) {
        toast.error(result.message || "Demo login failed");
        setActiveRole(null);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        Or try a demo account
        <span className="h-px flex-1 bg-border" />
      </div>
      <ul className="grid gap-2">
        {DEMOS.map(({ role, title, body, icon: Icon }) => {
          const isLoading = isPending && activeRole === role;
          return (
            <li key={role}>
              <button
                type="button"
                disabled={isPending}
                onClick={() => login(role)}
                aria-label={`Demo login as ${title.toLowerCase()}`}
                className="group flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-60"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                  {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Icon className="size-5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{body}</span>
                </span>
                <span className="shrink-0 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                  {isLoading ? (
                    "Signing in…"
                  ) : (
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DemoLogin;
