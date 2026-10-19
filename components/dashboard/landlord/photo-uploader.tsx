"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Star, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { uploadPropertyImageAction } from "@/app/(dashboardGroup)/dashboard/landlord/_actions/propertyActions";

const MAX_PHOTOS = 10;
const MAX_SIDE = 1600;
// Leaves room under the 4 MB server action limit for the multipart overhead.
const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Photo = {
  id: string;
  preview: string; // what the thumbnail shows: the uploaded URL, or a local blob: URL
  url?: string; // set once the photo is on Cloudinary (or was pasted)
  status: "uploading" | "done" | "error";
};

// Phone photos are often 4000px and several MB. Scaling them to 1600px JPEG
// keeps uploads fast and small enough for one request.
async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const ctx = canvas.getContext("2d")!;
  // Transparent PNG areas would otherwise turn black in the JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  for (const quality of [0.85, 0.7, 0.55]) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= MAX_UPLOAD_BYTES) return blob;
  }

  throw new Error("This photo is too large to upload");
}

type Props = {
  initialImages?: string[];
  onUploadingChange?: (uploading: boolean) => void;
  // The uploaded (or pasted) photo URLs, in order, whenever they change.
  onPhotosChange?: (urls: string[]) => void;
};

export default function PhotoUploader({ initialImages = [], onUploadingChange, onPhotosChange }: Props) {
  const [photos, setPhotos] = useState<Photo[]>(() =>
    initialImages.map((url) => ({ id: url, preview: url, url, status: "done" }))
  );
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrls = useRef(new Set<string>());

  const uploading = photos.some((p) => p.status === "uploading");
  const uploadedUrls = photos.filter((p) => p.status === "done" && p.url).map((p) => p.url!);

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  // A string key, so the parent is only told when the list actually changes.
  const uploadedKey = uploadedUrls.join("\n");
  useEffect(() => {
    onPhotosChange?.(uploadedKey ? uploadedKey.split("\n") : []);
  }, [uploadedKey, onPhotosChange]);

  // Free the local previews when the form goes away.
  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const updatePhoto = (id: string, patch: Partial<Photo>) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const uploadOne = async (id: string, file: File) => {
    try {
      const blob = await resizeImage(file);
      const formData = new FormData();
      formData.append("image", blob, "photo.jpg");

      const result = await uploadPropertyImageAction(formData);
      if (!result.success || !result.url) throw new Error(result.message);

      updatePhoto(id, { url: result.url, status: "done" });
    } catch (error) {
      updatePhoto(id, { status: "error" });
      toast.error(error instanceof Error ? error.message : "The photo could not be uploaded");
    }
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    const slots = MAX_PHOTOS - photos.length;

    if (slots <= 0) {
      toast.error(`You can add up to ${MAX_PHOTOS} photos`);
      return;
    }
    if (files.length > slots) {
      toast.error(`Only the first ${slots} photo${slots === 1 ? "" : "s"} will be added (max ${MAX_PHOTOS})`);
    }

    const accepted = files.slice(0, slots).filter((file) => {
      if (ACCEPTED_TYPES.includes(file.type)) return true;
      toast.error(`${file.name}: only JPEG, PNG or WebP photos are supported`);
      return false;
    });

    const added = accepted.map((file) => {
      const preview = URL.createObjectURL(file);
      objectUrls.current.add(preview);
      return { file, photo: { id: crypto.randomUUID(), preview, status: "uploading" as const } };
    });

    setPhotos((prev) => [...prev, ...added.map((a) => a.photo)]);
    added.forEach(({ file, photo }) => uploadOne(photo.id, file));
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo && objectUrls.current.has(photo.preview)) {
        URL.revokeObjectURL(photo.preview);
        objectUrls.current.delete(photo.preview);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const makeCover = (id: string) =>
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      return photo ? [photo, ...prev.filter((p) => p.id !== id)] : prev;
    });

  const addUrl = () => {
    const url = urlInput.trim();
    if (!/^https:\/\/\S+$/.test(url)) {
      toast.error("Enter a full image URL starting with https://");
      return;
    }
    if (photos.length >= MAX_PHOTOS) {
      toast.error(`You can add up to ${MAX_PHOTOS} photos`);
      return;
    }
    if (photos.some((p) => p.url === url)) {
      toast.error("That photo is already added");
      return;
    }
    setPhotos((prev) => [...prev, { id: crypto.randomUUID(), preview: url, url, status: "done" }]);
    setUrlInput("");
  };

  return (
    <div className="space-y-3">
      {/* The form reads the photos from here, one URL per line, like before. */}
      <input type="hidden" name="images" value={uploadedUrls.join("\n")} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative aspect-4/3 overflow-hidden rounded-xl border bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob: previews can't go through next/image */}
            <img src={photo.preview} alt={`Property photo ${index + 1}`} className="h-full w-full object-cover" />

            {photo.status === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Loader2 className="size-5 animate-spin" />
              </div>
            )}
            {photo.status === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-destructive/70 text-xs font-medium text-white">
                <TriangleAlert className="size-4" />
                Upload failed
              </div>
            )}

            {index === 0 && photo.status === "done" && (
              <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-semibold">
                Cover
              </span>
            )}

            <div className="absolute right-2 top-2 flex gap-1">
              {index > 0 && photo.status === "done" && (
                <button
                  type="button"
                  onClick={() => makeCover(photo.id)}
                  title="Make cover photo"
                  aria-label="Make cover photo"
                  className="rounded-full bg-background/90 p-1 opacity-100 transition-opacity hover:bg-background sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                >
                  <Star className="size-3.5" />
                </button>
              )}
              {photo.status !== "uploading" && (
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  title="Remove photo"
                  aria-label="Remove photo"
                  className="rounded-full bg-background/90 p-1 hover:bg-background"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            className={cn(
              "flex aspect-4/3 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground",
              isDragging && "border-ring bg-accent/50 text-foreground"
            )}
          >
            <ImagePlus className="size-5" />
            <span className="font-medium">Add photos</span>
            <span className="text-xs">or drop them here</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = ""; // so picking the same file again still triggers onChange
        }}
      />

      <p className="text-xs text-muted-foreground">
        JPEG, PNG or WebP, up to {MAX_PHOTOS} photos. The first photo is the cover.
      </p>

      <details className="text-sm">
        <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
          Add a photo by URL instead
        </summary>
        <div className="mt-2 flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              // Enter would otherwise submit the whole property form.
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="https://images.unsplash.com/photo-..."
            className="h-9"
          />
          <Button type="button" variant="outline" size="sm" onClick={addUrl} className="h-9">
            Add
          </Button>
        </div>
      </details>
    </div>
  );
}
