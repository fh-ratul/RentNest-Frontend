import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  {
    title: "Find the right home",
    description: "Browse verified listings and filter by city, budget and property type.",
  },
  {
    title: "Request and get approved",
    description: "Pick a move-in date, introduce yourself, and hear back directly from the landlord.",
  },
  {
    title: "Pay securely and move in",
    description: "Complete payment online through Stripe once you're approved. No cash, no surprises.",
  },
];

export default function HowItWorks() {
  return (
    <ol className="grid gap-10 md:grid-cols-3 md:gap-12">
      {STEPS.map((step, i) => (
        <li key={step.title}>
          <Reveal delay={i * 120} className="group border-t border-foreground/15 pt-6">
            <p className="font-heading text-5xl font-light italic text-brass-ink transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1">
              0{i + 1}
            </p>
            <h3 className="mt-6 text-2xl font-medium">{step.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{step.description}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
