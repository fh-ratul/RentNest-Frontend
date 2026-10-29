"use server";

import { cookies } from "next/headers";
import { clientIpHeaders } from "@/utils/backendHeaders";

export const getMe = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return { success: false, message: "User not logged in!" };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
  headers: { Cookie: `accessToken=${accessToken}`, ...(await clientIpHeaders()) },
  cache: "force-cache",
  next: { revalidate: 60 * 60 * 24, tags: ["my-profile","max"] },
});

  return res.json();
};