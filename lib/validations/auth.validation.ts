import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["TENANT", "LANDLORD"], { message: "Select a role" }),
});

export const loginFormSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailFormSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6 digit code from your email"),
});
