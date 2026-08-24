"use server";

export const getProperties = async (searchParams: Record<string, string | undefined>) => {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/properties?${params.toString()}`,
    { next: { revalidate: 60, tags: ["properties"] } }
  );

  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
    next: { revalidate: 60 * 60, tags: ["categories"] },
  });

  return res.json();
};