import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function EmptyState({ icon: Icon, title, description, ctaLabel, ctaHref }: Props) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-dashed bg-card px-6 py-16 text-center animate-in fade-in zoom-in-[0.98] duration-500">
      <div className="flex size-14 items-center justify-center rounded-full border bg-background">
        <Icon className="size-6 text-brass-ink" strokeWidth={1.5} />
      </div>
      <div className="relative max-w-sm">
        <p className="font-heading text-xl font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {ctaLabel && ctaHref && (
        <Button asChild size="sm" className="relative mt-1 px-4">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
