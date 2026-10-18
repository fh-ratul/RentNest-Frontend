import Image from "next/image";
import { BadgeCheck, KeyRound, ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/shared/logo";

const PANEL_IMAGE =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80";

const POINTS = [
  { icon: BadgeCheck, title: "Verified listings", text: "Every home comes from a registered landlord." },
  { icon: KeyRound, title: "Request in seconds", text: "Pick a move-in date and send a note. That's it." },
  { icon: ShieldCheck, title: "Secure payments", text: "Pay online through Stripe once you're approved." },
];

const AuthGroupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1">
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-stretch lg:py-12">
        <div className="flex items-center justify-center animate-page-in">{children}</div>

        <aside className="relative isolate hidden min-h-[600px] overflow-hidden rounded-2xl bg-[var(--navy)] p-10 text-white lg:flex lg:flex-col lg:justify-between animate-in fade-in fill-mode-both delay-150 duration-1000">
          <Image src={PANEL_IMAGE} alt="" fill sizes="50vw" className="-z-20 object-cover animate-hero-zoom" />
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-[oklch(0.15_0.04_258/0.95)] via-[oklch(0.17_0.04_258/0.7)] to-[oklch(0.17_0.04_258/0.35)]" />

          <div className="flex items-center gap-3">
            <LogoMark className="size-9" />
            <span className="font-heading text-2xl font-medium">RentNest</span>
          </div>

          <div className="space-y-9">
            <h2 className="max-w-md text-[2.75rem] font-normal leading-[1.08]">
              Your next home is <em className="font-light text-[oklch(0.84_0.08_80)]">a few clicks away.</em>
            </h2>
            <ul className="space-y-5 border-t border-white/15 pt-8">
              {POINTS.map((p, i) => (
                <li
                  key={p.title}
                  style={{ animationDelay: `${400 + i * 120}ms` }}
                  className="flex gap-4 animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700"
                >
                  <p.icon className="mt-0.5 size-5 shrink-0 text-[oklch(0.82_0.08_80)]" strokeWidth={1.5} />
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-sm text-white/70">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AuthGroupLayout;
