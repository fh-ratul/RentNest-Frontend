"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateFormData } from "@/lib/validate-form-data";
import {
  registerFormSchema,
  loginFormSchema,
  verifyEmailFormSchema,
} from "@/lib/validations/auth.validation";

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

const setAuthCookies = async (tokens: { accessToken: string; refreshToken: string }) => {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });
  cookieStore.set("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
};

// redirect() works by throwing, so callers must not wrap this in try/catch.
const redirectAfterLogin = (accessToken: string, redirectTo: string) => {
  const decodedToken = jwt.decode(accessToken) as JwtPayload;

  if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
    redirect(redirectTo);
  }
  redirect(ROLE_DASHBOARD[decodedToken.role as string] || "/");
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
    await setAuthCookies(result.data);
    redirectAfterLogin(result.data.accessToken, redirectTo);
  }

  // The backend has just sent this account a new OTP.
  if (result.code === "EMAIL_NOT_VERIFIED") {
    redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
  }

  return { success: false, message: result.message };
};

// `idToken` is the credential Google Sign-In hands to the browser. `role` is
// only sent from the register page: the backend needs it to create a new account.
export const googleLoginAction = async (
  idToken: string,
  role: "TENANT" | "LANDLORD" | undefined,
  redirectTo: string
): Promise<ActionState> => {
  if (typeof idToken !== "string" || !idToken) {
    return { success: false, message: "Google did not return a sign-in token. Please try again." };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, role }),
  });

  const result = await res.json();

  if (result.success) {
    await setAuthCookies(result.data);
    redirectAfterLogin(result.data.accessToken, redirectTo);
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
    redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
  }

  return { success: false, message: result.message };
};

export const verifyEmailAction = async (
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const parsed = validateFormData(verifyEmailFormSchema, formData);
  if (!parsed.success) {
    return { success: false, message: parsed.firstError, fieldErrors: parsed.fieldErrors };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const result = await res.json();

  // Verifying also logs the user in.
  if (result.success) {
    await setAuthCookies(result.data);
    redirectAfterLogin(result.data.accessToken, "");
  }

  return { success: false, message: result.message };
};

export const resendOtpAction = async (email: string): Promise<ActionState> => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const result = await res.json();

  return { success: Boolean(result.success), message: result.message };
};