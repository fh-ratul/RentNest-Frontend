"use server";

export const getPropertyById = async (id: string) => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/${id}`, {
    next: { revalidate: 60, tags: [`property-${id}`] },
  });
  return res.json();
};