import { cn } from "@/lib/utils";
import { RENTAL_STATUS_TONE, Tone, TONE_DOT, TONES } from "@/lib/tones";

type Props = {
  status: string;
  /** Overrides the tone looked up from the rental status map. */
  tone?: Tone;
  label?: string;
  className?: string;
};

export default function StatusBadge({ status, tone, label, className }: Props) {
  const resolved = tone ?? RENTAL_STATUS_TONE[status] ?? "neutral";
  const text = label ?? status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold whitespace-nowrap",
        TONES[resolved],
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", TONE_DOT[resolved])} />
      {text}
    </span>
  );
}
