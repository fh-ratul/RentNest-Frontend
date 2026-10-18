"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { validateFormData } from "@/lib/validate-form-data";
import { propertyFormSchema } from "@/lib/validations/property.validation";

export type ActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
} | null;

const buildPropertyPayload = (formData: FormData) => {
  const parsed = validateFormData(propertyFormSchema, formData);
  if (!parsed.success) return { valid: false as const, ...parsed };

  const amenitiesRaw = formData.get("amenities") as string;
  const imagesRaw = formData.get("images") as string;

  const payload: Record<string, unknown> = {
    title: parsed.data.title,
    description: parsed.data.description,
    address: parsed.data.address,
    city: parsed.data.city,
    price: parsed.data.price,
    bedrooms: parsed.data.bedrooms,
    bathrooms: parsed.data.bathrooms,
    categoryId: parsed.data.categoryId,
    amenities: amenitiesRaw ? amenitiesRaw.split(",").map((a) => a.trim()).filter(Boolean) : [],
    images: imagesRaw ? imagesRaw.split("\n").map((u) => u.trim()).filter(Boolean) : [],
  };

  return { valid: true as const, payload };
};

export const getMyProperties = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties`, {
    headers: { Cookie: `accessToken=${accessToken}` },
    next: { revalidate: 60, tags: ["my-properties"] },
  });

  return res.json();
};

export async function createPropertyAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const built = buildPropertyPayload(formData);
  if (!built.valid) {
    return { success: false, message: built.firstError, fieldErrors: built.fieldErrors };
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: `accessToken=${accessToken}` },
    body: JSON.stringify(built.payload),
  });

  const result = await res.json();

  if (result.success) {
    revalidateTag("my-properties", { expire: 0 });
    revalidateTag("properties", { expire: 0 });
    redirect("/dashboard/landlord/properties");
  }

  return { success: result.success, message: result.message };
}

export async function updatePropertyAction(
  propertyId: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const built = buildPropertyPayload(formData);
  if (!built.valid) {
    return { success: false, message: built.firstError, fieldErrors: built.fieldErrors };
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties/${propertyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: `accessToken=${accessToken}` },
    body: JSON.stringify(built.payload),
  });

  const result = await res.json();

  if (result.success) {
    revalidateTag("my-properties", { expire: 0 });
    revalidateTag("properties", { expire: 0 });
    revalidateTag(`property-${propertyId}`, { expire: 0 });
    redirect("/dashboard/landlord/properties");
  }

  return { success: result.success, message: result.message };
}

export async function deletePropertyAction(propertyId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties/${propertyId}`, {
    method: "DELETE",
    headers: { Cookie: `accessToken=${accessToken}` },
  });

  const result = await res.json();

  if (result.success) {
    revalidateTag("my-properties", { expire: 0 });
    revalidateTag("properties", { expire: 0 });
  }

  return result;
}

// One photo per call. The browser resizes it first, so it stays under the
// server action body limit in next.config.ts and Vercel's 4.5 MB request cap.
export async function uploadPropertyImageAction(
  formData: FormData
): Promise<{ success: boolean; message: string; url?: string }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return { success: false, message: "Not logged in" };

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return { success: false, message: "Please choose an image" };
  }

  const body = new FormData();
  body.append("image", image);

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties/images`, {
    method: "POST",
    headers: { Cookie: `accessToken=${accessToken}` },
    body,
  });

  // A rejected upload can come back as plain text (e.g. a proxy's 413), not JSON.
  const result = await res.json().catch(() => null);

  if (!result?.success) {
    return { success: false, message: result?.message || "The photo could not be uploaded" };
  }

  return { success: true, message: result.message, url: result.data.url };
}

export const getPropertyByIdForEdit = async (id: string) => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/${id}`, {
    cache: "no-store",
  });
  return res.json();
};
