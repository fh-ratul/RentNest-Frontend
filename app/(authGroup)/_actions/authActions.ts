"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateFormData } from "@/lib/validate-form-data";
import { registerFormSchema, loginFormSchema } from "@/lib/validations/auth.validation";

export type ActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
} | null;

const ROLE_DASHBOARD: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export const loginAction = async (
  redirectTo: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const parsed = validateFormData(loginFormSchema, formData);
  if (!parsed.success) {
    return { success: false, message: parsed.firstError, fieldErrors: parsed.fieldErrors };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const result = await res.json();

  if (result.success) {
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;

    if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
      redirect(redirectTo);
    }
    redirect(ROLE_DASHBOARD[decodedToken.role as string] || "/");
  }

  return { success: false, message: result.message };
};

export const registerAction = async (
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const parsed = validateFormData(registerFormSchema, formData);
  if (!parsed.success) {
    return { success: false, message: parsed.firstError, fieldErrors: parsed.fieldErrors };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const result = await res.json();

  if (result.success) {
    redirect("/login?registered=1");
  }

  return { success: false, message: result.message };
};