"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { clientIpHeaders } from "@/utils/backendHeaders";

export type ActionState = { success: boolean; message: string } | null;

export async function updateProfileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "Not logged in" };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/updateMe`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: `accessToken=${accessToken}`, ...(await clientIpHeaders()) },
    body: JSON.stringify({ name: formData.get("name") }),
  });

  const result = await res.json();

  if (result.success) {
    revalidateTag("my-profile", { expire: 0 });
  }

  return { success: result.success, message: result.message };
}

export async function changePasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "Not logged in" };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/change-password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: `accessToken=${accessToken}`, ...(await clientIpHeaders()) },
    body: JSON.stringify({
      oldPassword: formData.get("oldPassword"),
      newPassword: formData.get("newPassword"),
    }),
  });

  const result = await res.json();

  return { success: result.success, message: result.message };
}