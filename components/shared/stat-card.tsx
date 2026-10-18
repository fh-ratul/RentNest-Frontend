import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tone, TONES } from "@/lib/tones";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: Tone;
  hint?: string;
  /** Position in a row of cards, used to stagger the entrance. */
  index?: number;
};

export default function StatCard({ icon: Icon, label, value, tone = "brand", hint, index = 0 }: Props) {
  return (
    <div
      style={{ animationDelay: `${index * 70}ms` }}
      className="group relative min-w-0 overflow-hidden rounded-xl border bg-card p-4 shadow-soft transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-3 fill-mode-both hover:shadow-lift sm:p-5"
    >
      <div className="relative flex items-start justify-between gap-3">
        <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">{label}</p>
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg border", TONES[tone])}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="relative mt-2 truncate font-heading text-3xl font-normal tracking-tight tabular-nums sm:text-4xl">
        {value}
      </p>
      {hint && <p className="relative mt-1 truncate text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
