import { z } from "zod";
import { COOKIE_NAMES, UserRole } from "../constants/auth.constants.js";

const emailSchema = z
  .string()
  .trim()
  .email("Please provide a valid email address")
  .max(254)
  .toLowerCase();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^a-zA-Z0-9]/, "Password must include a special character");

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(UserRole),
    avatar: z.string().trim().url().optional().nullable(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  }),
});

export const refreshSchema = z.object({
  cookies: z.object({
    [COOKIE_NAMES.REFRESH_TOKEN]: z.string().min(1),
  }),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: passwordSchema,
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must be different from current password",
      path: ["newPassword"],
    }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(32, "Reset token is invalid"),
    newPassword: passwordSchema,
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];
