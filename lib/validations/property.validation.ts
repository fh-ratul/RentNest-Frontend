import { z } from "zod";

export const propertyFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  bedrooms: z.coerce.number().int().min(0, "Bedrooms cannot be negative"),
  bathrooms: z.coerce.number().int().min(0, "Bathrooms cannot be negative"),
  categoryId: z.string().uuid("Please select a valid category"),

  amenities: z.string().optional(),
  images: z.string().optional(),
});
