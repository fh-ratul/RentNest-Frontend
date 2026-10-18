"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { IProperty } from "@/lib/types";
import PropertyImage from "@/components/shared/property-image";
import StatusBadge from "@/components/shared/status-badge";
import { PROPERTY_STATUS_TONE } from "@/lib/tones";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Bath, Bed, MapPin, Pencil, Trash2 } from "lucide-react";
import { deletePropertyAction } from "@/app/(dashboardGroup)/dashboard/landlord/_actions/propertyActions";
import { formatBDT } from "@/lib/utils";

export default function PropertyListCard({ property }: { property: IProperty }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePropertyAction(property.id);
      if (result.success) {
        toast.success("Property deleted");
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to delete");
      }
    });
  };

  return (
    <article className="group h-full overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        <PropertyImage
          src={property.images?.[0]}
          alt={property.title}
          className="transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        <StatusBadge
          status={property.status}
          tone={PROPERTY_STATUS_TONE[property.status]}
          className="absolute right-3 top-3 border-white/20 bg-white/90 backdrop-blur-md dark:bg-black/60"
        />
        <p className="absolute bottom-3 left-3 rounded-xl bg-black/55 px-2.5 py-1 font-heading text-sm font-medium text-white backdrop-blur-md">
          {formatBDT(property.price)}
          <span className="font-sans text-xs font-normal text-white/75"> /mo</span>
        </p>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <div className="space-y-1">
          <h3 className="line-clamp-1 font-semibold">{property.title}</h3>
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {property.city}</span>
            <span className="flex items-center gap-1"><Bed className="size-3.5" /> {property.bedrooms}</span>
            <span className="flex items-center gap-1"><Bath className="size-3.5" /> {property.bathrooms}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
              <Pencil className="size-3.5" /> Edit
            </Link>
          </Button>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={`Delete ${property.title}`}
                className="text-destructive hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this property?</AlertDialogTitle>
                <AlertDialogDescription>
                  This can&apos;t be undone. &quot;{property.title}&quot; will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending} variant="destructive">
                  {isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </article>
  );
}