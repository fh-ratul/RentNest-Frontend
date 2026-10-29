"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { clientIpHeaders } from "@/utils/backendHeaders";

export const getAllUsers = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/users`, {
    headers: { Cookie: `accessToken=${accessToken}`, ...(await clientIpHeaders()) },
    next: { revalidate: 30, tags: ["admin-users"] },
  });
  return res.json();
};

export async function updateUserStatusAction(userId: string, activeStatus: "ACTIVE" | "BLOCKED") {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: `accessToken=${accessToken}`, ...(await clientIpHeaders()) },
    body: JSON.stringify({ activeStatus }),
  });

  const result = await res.json();
  if (result.success) revalidateTag("admin-users", { expire: 0 });
  return result;
}

export const getAllAdminProperties = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/properties`, {
    headers: { Cookie: `accessToken=${accessToken}`, ...(await clientIpHeaders()) },
    next: { revalidate: 30, tags: ["admin-properties"] },
  });
  return res.json();
};

export const getAllAdminRentals = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/rentals`, {
    headers: { Cookie: `accessToken=${accessToken}`, ...(await clientIpHeaders()) },
    next: { revalidate: 30, tags: ["admin-rentals"] },
  });
  return res.json();
};