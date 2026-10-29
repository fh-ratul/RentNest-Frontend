"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { clientIpHeaders } from "@/utils/backendHeaders";

export const confirmPayment = async (sessionId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: `accessToken=${accessToken}`, ...(await clientIpHeaders()) },
    body: JSON.stringify({ sessionId }),
  });

  const result = await res.json();

  if (result.success) {
    revalidateTag("my-rentals", { expire: 0 });
    revalidateTag("my-payments", { expire: 0 });
  }

  return result;
};