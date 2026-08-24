import { Search, FileCheck2, KeyRound } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Browse Listings",
    description: "Explore verified rental properties filtered by city, price, and amenities.",
  },
  {
    icon: FileCheck2,
    title: "Request & Get Approved",
    description: "Submit a rental request and hear back directly from the landlord.",
  },
  {
    icon: KeyRound,
    title: "Pay & Move In",
    description: "Complete secure payment online and get the keys to your new place.",
  },
];

export default function HowItWorks() {
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      {STEPS.map((step, i) => (
        <div key={step.title} className="relative text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <step.icon className="h-6 w-6" />
          </div>
          <p className="mt-4 text-xs font-semibold text-muted-foreground">STEP {i + 1}</p>
          <h3 className="mt-1 font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
        </div>
      ))}
    </div>
  );
}