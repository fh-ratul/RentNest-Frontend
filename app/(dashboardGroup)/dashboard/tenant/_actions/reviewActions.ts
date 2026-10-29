"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { clientIpHeaders } from "@/utils/backendHeaders";

export type ActionState = { success: boolean; message: string } | null;

export async function createReviewAction(
  rentalRequestId: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return { success: false, message: "Not logged in" };

  const payload = {
    rentalRequestId,
    rating: Number(formData.get("rating")),
    comment: formData.get("comment") || undefined,
  };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: `accessToken=${accessToken}`, ...(await clientIpHeaders()) },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (result.success) {
    revalidateTag("my-rentals", { expire: 0 });
  }

  return { success: result.success, message: result.message };
}