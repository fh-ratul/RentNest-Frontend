"use server";

import { cookies } from "next/headers";

export const getMyPayments = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return { success: false, message: "User not logged in!" };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments`, {
    headers: { Cookie: `accessToken=${accessToken}` },
    cache: "force-cache",
    next: { revalidate: 60, tags: ["my-payments","max"] },
  });

  return res.json();
};

export async function createPaymentAction(rentalRequestId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: `accessToken=${accessToken}` },
    body: JSON.stringify({ rentalRequestId }),
  });

  return res.json();
}