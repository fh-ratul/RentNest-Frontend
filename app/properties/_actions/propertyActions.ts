"use server";

// Fills a 3-column grid evenly. (A "use server" file can only export async functions.)
const PROPERTIES_PER_PAGE = 12;

export const getProperties = async (searchParams: Record<string, string | undefined>) => {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  params.set("limit", String(PROPERTIES_PER_PAGE));

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