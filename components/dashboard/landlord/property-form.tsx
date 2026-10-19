"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Info, Loader2, Save, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ICategory, IListingDraft, IProperty } from "@/lib/types";
import PhotoUploader from "./photo-uploader";
import {
  ActionState,
  createPropertyAction,
  draftListingAction,
  updatePropertyAction,
} from "@/app/(dashboardGroup)/dashboard/landlord/_actions/propertyActions";

const initialState: ActionState = null;

type Props = {
  categories: ICategory[];
  property?: IProperty; // presence = edit mode
};

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{message}</p> : null;

// Empty or non-numeric inputs are left out of the AI request.
const numberOrUndefined = (value: FormDataEntryValue | null) => {
  const n = Number(value);
  return value !== null && value !== "" && Number.isFinite(n) ? n : undefined;
};

export default function PropertyForm({ categories, property }: Props) {
  const isEdit = Boolean(property);

  const boundAction = isEdit
    ? updatePropertyAction.bind(null, property!.id)
    : createPropertyAction;

  const [state, action, pending] = useActionState(boundAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Saving mid-upload would drop the photos that haven't finished yet.
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>(property?.images ?? []);

  // The fields "Draft with AI" fills in.
  const [title, setTitle] = useState(property?.title ?? "");
  const [description, setDescription] = useState(property?.description ?? "");
  const [categoryId, setCategoryId] = useState(property?.categoryId ?? categories[0]?.id ?? "");
  const [amenities, setAmenities] = useState(property?.amenities?.join(", ") ?? "");

  const [drafting, startDrafting] = useTransition();
  const [draft, setDraft] = useState<Pick<IListingDraft, "photoWarnings" | "usedPhotos"> | null>(null);

  useEffect(() => {
    if (state && !state.success && !state.fieldErrors) {
      toast.error(state.message || "Something went wrong");
    }
  }, [state]);

  const draftWithAI = () => {
    if (
      (title.trim() || description.trim()) &&
      !window.confirm("Replace the current title, description, category and amenities with an AI draft?")
    ) {
      return;
    }

    const form = new FormData(formRef.current!);
    const text = (name: string) => (form.get(name) as string | null)?.trim() || undefined;

    startDrafting(async () => {
      const result = await draftListingAction({
        imageUrls: photoUrls,
        address: text("address"),
        city: text("city"),
        price: numberOrUndefined(form.get("price")),
        bedrooms: numberOrUndefined(form.get("bedrooms")),
        bathrooms: numberOrUndefined(form.get("bathrooms")),
      });

      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      const { data } = result;
      setTitle(data.title);
      setDescription(data.description);
      setCategoryId(data.categoryId);
      setAmenities(data.amenities.join(", "));
      setDraft({ photoWarnings: data.photoWarnings, usedPhotos: data.usedPhotos });
      toast.success("Draft ready. Review and edit it before saving.");
    });
  };

  const canDraft = photoUrls.length > 0 && !uploadingPhotos && !drafting;

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label>Photos</Label>
          <PhotoUploader
            initialImages={property?.images}
            onUploadingChange={setUploadingPhotos}
            onPhotosChange={setPhotoUrls}
          />
          <FieldError message={state?.fieldErrors?.images} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" className="h-10" defaultValue={property?.address} />
          <FieldError message={state?.fieldErrors?.address} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" className="h-10" defaultValue={property?.city} />
          <FieldError message={state?.fieldErrors?.city} />
        </div>

        <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">Rent (৳ / month)</Label>
            <Input id="price" name="price" className="h-10" type="number" defaultValue={property?.price} />
            <FieldError message={state?.fieldErrors?.price} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input id="bedrooms" name="bedrooms" className="h-10" type="number" defaultValue={property?.bedrooms} />
            <FieldError message={state?.fieldErrors?.bedrooms} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input id="bathrooms" name="bathrooms" className="h-10" type="number" defaultValue={property?.bathrooms} />
            <FieldError message={state?.fieldErrors?.bathrooms} />
          </div>
        </div>

        {/* Draft with AI: reads the photos and the details above, fills in the fields below. */}
        <div className="space-y-3 rounded-2xl border border-dashed bg-accent/30 p-4 sm:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-brass-ink" /> Let AI write the listing
              </p>
              <p className="text-xs text-muted-foreground">
                {photoUrls.length
                  ? "Fills in the title, description, category and amenities from your photos and the details above."
                  : "Add at least one photo first. The AI writes the listing from your photos and the details above."}
              </p>
            </div>
            <Button type="button" variant="outline" onClick={draftWithAI} disabled={!canDraft} className="shrink-0">
              {drafting ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {drafting ? "Drafting..." : "Draft with AI"}
            </Button>
          </div>

          {drafting && (
            <p className="text-xs text-muted-foreground">Looking at your photos. This usually takes 10 to 20 seconds.</p>
          )}

          {draft && !drafting && !draft.usedPhotos && (
            <p className="flex gap-2 text-xs text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              The AI couldn&apos;t look at your photos this time, so this draft only uses the details you typed. Check it
              carefully.
            </p>
          )}

          {draft && !drafting && draft.photoWarnings.length > 0 && (
            <div className="space-y-1.5 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
              <p className="flex items-center gap-1.5 font-semibold">
                <TriangleAlert className="size-3.5" /> Photo tips before you publish
              </p>
              <ul className="list-disc space-y-0.5 pl-5">
                {draft.photoWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" className="h-10" value={title} onChange={(e) => setTitle(e.target.value)} />
          <FieldError message={state?.fieldErrors?.title} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FieldError message={state?.fieldErrors?.description} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={!categories.length}
            className="select-native h-10 w-full rounded-2xl border border-transparent bg-input/50 px-3 text-sm outline-none transition-[box-shadow,border-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
          >
            {!categories.length && <option value="">No categories available</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <FieldError message={state?.fieldErrors?.categoryId} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amenities">Amenities (comma-separated)</Label>
          <Input
            id="amenities"
            name="amenities"
            className="h-10"
            placeholder="Lift, Gas line, Car parking"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end border-t pt-5">
        <Button type="submit" size="lg" disabled={pending || uploadingPhotos || drafting} className="w-full px-6 sm:w-auto">
          {pending || uploadingPhotos ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {pending ? "Saving..." : uploadingPhotos ? "Uploading photos..." : isEdit ? "Save changes" : "Create property"}
        </Button>
      </div>
    </form>
  );
}
