"use server";

import { clientIpHeaders } from "@/utils/backendHeaders";

export const getPropertyById = async (id: string) => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/${id}`, {
    headers: await clientIpHeaders(),
    next: { revalidate: 60, tags: [`property-${id}`] },
  });
  return res.json();
};