import { z } from "zod";
import { CURRENCY_SYMBOLS } from "@/lib/currencies";

const currencyCodes = Object.keys(CURRENCY_SYMBOLS);

export const EditProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    weekendDays: z.array(z.number()).optional(),
    currency: z.enum(currencyCodes as [string, ...string[]]).optional(),
});

export type EditProfileFormValues = z.infer<typeof EditProfileSchema>;

export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;
