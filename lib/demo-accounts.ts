// Server-only: import this from server components and server actions, never client code.

export type DemoRole = "TENANT" | "LANDLORD" | "ADMIN";

export const DEMO_ROLES: DemoRole[] = ["TENANT", "LANDLORD", "ADMIN"];

// Demo credentials live in server env vars (DEMO_TENANT_EMAIL, DEMO_TENANT_PASSWORD, ...)
// so they never ship to the browser. The accounts are created by the backend seed.
export function getDemoCredentials(role: DemoRole) {
  const email = process.env[`DEMO_${role}_EMAIL`];
  const password = process.env[`DEMO_${role}_PASSWORD`];
  return email && password ? { email, password } : null;
}
