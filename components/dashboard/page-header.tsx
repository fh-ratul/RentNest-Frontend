import { cn } from "@/lib/utils";

type Props = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, description, actions, className }: Props) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h1 className="text-2xl font-medium sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}

// Elevated surface for tables and forms inside the dashboard.
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("overflow-hidden rounded-2xl border bg-card shadow-soft", className)} {...props} />;
}
