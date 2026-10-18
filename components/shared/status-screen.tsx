import { cn } from "@/lib/utils";
import { Tone, TONES } from "@/lib/tones";

type Props = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tone?: Tone;
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  spin?: boolean;
};

// Centered full-page message used by 404, errors and payment results.
export default function StatusScreen({ icon: Icon, tone = "brand", eyebrow, title, description, children, spin }: Props) {
  return (
    <div className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-24 text-center animate-page-in">
      <span
        className={cn(
          "flex size-14 items-center justify-center rounded-full border animate-in zoom-in-75 duration-700 ease-(--ease-out-expo)",
          TONES[tone]
        )}
      >
        <Icon className={cn("size-6", spin && "animate-spin")} strokeWidth={1.75} />
      </span>
      {eyebrow && (
        <p className="mt-8 font-heading text-8xl font-light italic tracking-tight text-brass-ink sm:text-9xl">{eyebrow}</p>
      )}
      <h1 className={cn("text-3xl font-normal sm:text-4xl", eyebrow ? "mt-2" : "mt-6")}>{title}</h1>
      {description && <p className="mt-2 max-w-md text-muted-foreground">{description}</p>}
      {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
