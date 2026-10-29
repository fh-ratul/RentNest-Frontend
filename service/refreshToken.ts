"use server";

import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";
import { clientIpHeaders } from "@/utils/backendHeaders";

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!refreshToken) {
    return { success: false, message: "Refresh token not found!" };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/refresh-token`, {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
      ...(await clientIpHeaders()),
    },
    cache: "no-cache",
  });

  return res.json();
};

export const isAccessTokenExist = async () => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value || null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!accessToken && !refreshToken) {
    throw new Error("User Not Logged In!");
  }

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
    : null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      accessToken = newAccessToken;
    }
  }

  return accessToken;
};