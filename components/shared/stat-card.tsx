import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  colorClass?: string;
};

export default function StatCard({ icon: Icon, label, value, colorClass = "text-primary bg-primary/10" }: Props) {
  return (
    <Card className="flex min-w-0 flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11", colorClass)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground sm:text-sm">{label}</p>
        <p className="truncate text-xl font-semibold sm:text-2xl">{value}</p>
      </div>
    </Card>
  );
}
