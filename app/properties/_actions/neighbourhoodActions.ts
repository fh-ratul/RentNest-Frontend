"use server";

export type TPlace = { lat: number; lng: number; label: string; approximate?: boolean };
export type TRoute = { minutes: number; km: number } | null;

// Finds a place in Bangladesh. With `city`, `q` is treated as a street address.
export const searchPlaceAction = async (
  q: string,
  city?: string
): Promise<{ success: boolean; message: string; data?: TPlace }> => {
  const params = new URLSearchParams({ q });
  if (city) params.set("city", city);

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/geo/search?${params}`, { cache: "no-store" });
  const result = await res.json().catch(() => null);

  if (!result?.success) return { success: false, message: result?.message || "Couldn't search the map right now" };
  return { success: true, message: result.message, data: result.data };
};

// Car and walking times from a listing to a place.
export const getCommuteAction = async (
  propertyId: string,
  lat: number,
  lng: number
): Promise<{ success: boolean; message: string; data?: { car: TRoute; foot: TRoute } }> => {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/${propertyId}/commute?${params}`, {
    cache: "no-store",
  });
  const result = await res.json().catch(() => null);

  if (!result?.success) return { success: false, message: result?.message || "Travel times are unavailable right now" };
  return { success: true, message: result.message, data: result.data };
};
