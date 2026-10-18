// Server-only: import this from server components and server actions, never client code.

export type DemoRole = "TENANT" | "LANDLORD" | "ADMIN";

export const DEMO_ROLES: DemoRole[] = ["TENANT", "LANDLORD", "ADMIN"];

// The demo accounts created by the backend seed (`npm run seed`). They work
// with no setup; DEMO_<ROLE>_EMAIL / DEMO_<ROLE>_PASSWORD can override them.
// Only the server action reads these, so they never reach the browser.
const DEMO_PASSWORD = "RentNest@12345";

const DEMO_ACCOUNTS: Record<DemoRole, { email: string; password: string }> = {
  TENANT: { email: "demo.tenant@example.com", password: DEMO_PASSWORD },
  LANDLORD: { email: "demo.landlord@example.com", password: DEMO_PASSWORD },
  ADMIN: { email: "demo.admin@example.com", password: DEMO_PASSWORD },
};

export function getDemoCredentials(role: DemoRole) {
  return {
    email: process.env[`DEMO_${role}_EMAIL`] || DEMO_ACCOUNTS[role].email,
    password: process.env[`DEMO_${role}_PASSWORD`] || DEMO_ACCOUNTS[role].password,
  };
}
