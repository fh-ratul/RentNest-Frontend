import { ZodError, ZodSchema } from "zod";

export function validateFormData<T>(schema: ZodSchema<T>, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const result = schema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    (result.error as ZodError).issues.forEach((issue) => {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    });
    return { success: false as const, fieldErrors, firstError: Object.values(fieldErrors)[0] };
  }

  return { success: true as const, data: result.data };
}