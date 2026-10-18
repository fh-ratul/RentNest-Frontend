import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/properties", label: "All homes" },
      { href: "/properties?city=Dhaka", label: "Homes in Dhaka" },
      { href: "/properties?city=Chattogram", label: "Homes in Chattogram" },
      { href: "/properties?city=Sylhet", label: "Homes in Sylhet" },
    ],
  },
  {
    title: "Landlords",
    links: [
      { href: "/register", label: "List your property" },
      { href: "/#landlords", label: "Why RentNest" },
      { href: "/login", label: "Landlord sign in" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/register", label: "Create an account" },
      { href: "/dashboard/settings", label: "Settings" },
    ],
  },
];

// Always dark: a midnight band that anchors every page.
export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--navy)] text-[oklch(0.8_0.012_85)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-14 pt-16 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-5">
          <Logo inverted />
          <p className="max-w-xs text-sm leading-relaxed text-[oklch(0.72_0.015_85)]">
            Verified homes, direct conversations with landlords and secure online payments. Renting, handled
            properly.
          </p>
          <div className="space-y-2.5 text-sm">
            <p className="flex items-center gap-2.5">
              <MapPin className="size-4 text-brass" /> Dhaka, Bangladesh
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="size-4 text-brass" /> hello@rentnest.app
            </p>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brass">{col.title}</h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[oklch(0.8_0.012_85)] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-[oklch(0.68_0.015_85)] sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} RentNest. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-brass" /> Payments secured by Stripe
          </p>
        </div>
      </div>
    </footer>
  );
}
