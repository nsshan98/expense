import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  phone_number: z.string().min(1, "Phone Number is required"),
  email: z.email(),
  password: z
    .object({
      newPassword: z.string().min(8, "Password Must Be 8 Characters Long"),
      confirmPassword: z.string().min(8, "Password Must Be 8 Characters Long"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Password Not Matched",
      path: ["confirmPassword"],
    }),
});

export const forgetPasswordSchema = z.object({
  email: z.email(),
});

export const forgetPasswordOtpSchema = z.object({
  otp: z.string().min(6, "OTP is required"),
});

export const newPasswordSchema = z.object({
  password: z
    .object({
      newPassword: z.string().min(8, "Password Must Be 8 Characters Long"),
      confirmPassword: z.string().min(8, "Password Must Be 8 Characters Long"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Password Not Matched",
      path: ["confirmPassword"],
    }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type SignupSchemaType = z.infer<typeof signupSchema>;
export type ForgetPasswordSchemaType = z.infer<typeof forgetPasswordSchema>;
export type ForgetPasswordOtpSchemaType = z.infer<
  typeof forgetPasswordOtpSchema
>;
export type NewPasswordOtpSchemaType = z.infer<typeof newPasswordSchema>;
