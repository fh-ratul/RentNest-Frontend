"use server";

import { cookies } from "next/headers";

export const getMyRentals = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return { success: false, message: "User not logged in!" };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
    headers: { Cookie: `accessToken=${accessToken}` },
    cache: "force-cache",
    next: { revalidate: 60, tags: ["my-rentals","max"] },
  });

  return res.json();
};

export const getRentalById = async (id: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return { success: false, message: "Not logged in" };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals/${id}`, {
    headers: { Cookie: `accessToken=${accessToken}` },
    cache: "no-store",
  });

  return res.json();
};