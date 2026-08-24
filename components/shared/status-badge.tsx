import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  APPROVED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
  ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
  COMPLETED: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

export default function StatusBadge({ status }: { status: string }) {
  return <Badge className={cn("font-medium", STATUS_STYLES[status])}>{status}</Badge>;
}