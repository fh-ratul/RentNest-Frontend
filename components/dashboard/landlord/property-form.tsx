"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
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
          <Input id="title" name="title" defaultValue={property?.title} />
          {state?.fieldErrors?.title && <p className="text-xs text-red-500">{state.fieldErrors.title}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} defaultValue={property?.description} />
          {state?.fieldErrors?.description && (
            <p className="text-xs text-red-500">{state.fieldErrors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" defaultValue={property?.address} />
          {state?.fieldErrors?.address && <p className="text-xs text-red-500">{state.fieldErrors.address}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={property?.city} />
          {state?.fieldErrors?.city && <p className="text-xs text-red-500">{state.fieldErrors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($/mo)</Label>
          <Input id="price" name="price" type="number" defaultValue={property?.price} />
          {state?.fieldErrors?.price && <p className="text-xs text-red-500">{state.fieldErrors.price}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={property?.categoryId ?? categories[0]?.id ?? ""}
            disabled={!categories.length}
            className="h-9 w-full rounded-md border bg-background px-2 text-sm"
          >
            {!categories.length && <option value="">No categories available</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {state?.fieldErrors?.categoryId && (
            <p className="text-xs text-red-500">{state.fieldErrors.categoryId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" name="bedrooms" type="number" defaultValue={property?.bedrooms} />
          {state?.fieldErrors?.bedrooms && (
            <p className="text-xs text-red-500">{state.fieldErrors.bedrooms}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" name="bathrooms" type="number" defaultValue={property?.bathrooms} />
          {state?.fieldErrors?.bathrooms && (
            <p className="text-xs text-red-500">{state.fieldErrors.bathrooms}</p>
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
          {state?.fieldErrors?.images && <p className="text-xs text-red-500">{state.fieldErrors.images}</p>}
        </div>
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Saving..." : isEdit ? "Save Changes" : "Create Property"}
      </Button>
    </form>
  );
}
