"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { clientIpHeaders } from "@/utils/backendHeaders";

export const getLandlordRequests = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/requests`, {
    headers: { Cookie: `accessToken=${accessToken}`, ...(await clientIpHeaders()) },
    next: { revalidate: 30, tags: ["landlord-requests"] },
  });

  return res.json();
};

export async function updateRequestStatus(
  requestId: string,
  status: "APPROVED" | "REJECTED" | "COMPLETED"
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/requests/${requestId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: `accessToken=${accessToken}`, ...(await clientIpHeaders()) },
    body: JSON.stringify({ status }),
  });

  const result = await res.json();

  if (result.success) {
    revalidateTag("landlord-requests", { expire: 0 });
  }

  return result;
}