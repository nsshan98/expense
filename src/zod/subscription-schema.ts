import { z } from "zod";

export const subscriptionRequestSchema = z.object({
    planId: z.string().min(1, "Plan ID is required"),
    duration: z.enum(["monthly", "yearly"]),
    transactionId: z.string().min(1, "Transaction ID is required"),
    provider: z.string().min(1, "Payment provider is required"),
    senderNumber: z.string().optional(),
    note: z.string().optional(),
});

export type SubscriptionRequestFormValues = z.infer<typeof subscriptionRequestSchema>;
