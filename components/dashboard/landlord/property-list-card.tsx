"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { IProperty } from "@/lib/types";
import PropertyImage from "@/components/shared/property-image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Pencil, Trash2 } from "lucide-react";
import { deletePropertyAction } from "@/app/(dashboardGroup)/dashboard/landlord/_actions/propertyActions";

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-800 hover:bg-green-100",
  RENTED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  INACTIVE: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

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
    <Card className="overflow-hidden py-0">
      <div className="relative h-40 w-full bg-muted">
        <PropertyImage src={property.images?.[0]} alt={property.title} />
        <Badge className={`absolute right-3 top-3 ${STATUS_STYLES[property.status]}`}>
          {property.status}
        </Badge>
      </div>
      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 font-semibold">{property.title}</h3>
          <p className="text-sm text-muted-foreground">{property.city} · ${property.price}/mo</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
            </Link>
          </Button>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
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
                <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700">
                  {isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}