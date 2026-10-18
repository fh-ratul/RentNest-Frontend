"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ICategory, IProperty } from "@/lib/types";
import {
  ActionState,
  createPropertyAction,
  updatePropertyAction,
} from "@/app/(dashboardGroup)/dashboard/landlord/_actions/propertyActions";

const initialState: ActionState = null;

type Props = {
  categories: ICategory[];
  property?: IProperty; // presence = edit mode
};

export default function PropertyForm({ categories, property }: Props) {
  const isEdit = Boolean(property);

  const boundAction = isEdit
    ? updatePropertyAction.bind(null, property!.id)
    : createPropertyAction;

  const [state, action, pending] = useActionState(boundAction, initialState);

  useEffect(() => {
    if (state && !state.success && !state.fieldErrors) {
      toast.error(state.message || "Something went wrong");
    }
  }, [state]);

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" className="h-10" defaultValue={property?.title} />
          {state?.fieldErrors?.title && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.title}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} defaultValue={property?.description} />
          {state?.fieldErrors?.description && (
            <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" className="h-10" defaultValue={property?.address} />
          {state?.fieldErrors?.address && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.address}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" className="h-10" defaultValue={property?.city} />
          {state?.fieldErrors?.city && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($/mo)</Label>
          <Input id="price" name="price" className="h-10" type="number" defaultValue={property?.price} />
          {state?.fieldErrors?.price && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.price}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={property?.categoryId ?? categories[0]?.id ?? ""}
            disabled={!categories.length}
            className="select-native h-10 w-full rounded-2xl border border-transparent bg-input/50 px-3 text-sm outline-none transition-[box-shadow,border-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
          >
            {!categories.length && <option value="">No categories available</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {state?.fieldErrors?.categoryId && (
            <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.categoryId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" name="bedrooms" className="h-10" type="number" defaultValue={property?.bedrooms} />
          {state?.fieldErrors?.bedrooms && (
            <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.bedrooms}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" name="bathrooms" className="h-10" type="number" defaultValue={property?.bathrooms} />
          {state?.fieldErrors?.bathrooms && (
            <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.bathrooms}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="amenities">Amenities (comma-separated)</Label>
          <Input
            id="amenities"
            name="amenities"
            placeholder="Parking, Wifi, Air Conditioning"
            defaultValue={property?.amenities?.join(", ")}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="images">Image URLs (one per line, optional)</Label>
          <Textarea
            id="images"
            name="images"
            rows={3}
            placeholder={"https://images.unsplash.com/photo-...\nhttps://images.unsplash.com/photo-..."}
            defaultValue={property?.images?.join("\n")}
          />
          <p className="text-xs text-muted-foreground">
            Must be full URLs starting with https:// — leave blank if you don&apos;t have any yet.
          </p>
          {state?.fieldErrors?.images && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{state.fieldErrors.images}</p>}
        </div>
      </div>

      <div className="flex justify-end border-t pt-5">
        <Button type="submit" size="lg" disabled={pending} className="w-full px-6 sm:w-auto">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {pending ? "Saving..." : isEdit ? "Save changes" : "Create property"}
        </Button>
      </div>
    </form>
  );
}
