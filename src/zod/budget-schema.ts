import { z } from "zod";

export const createBudgetSchema = z.object({
    category: z.string().min(1, "Category is required"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
});

export const updateBudgetSchema = z.object({
    id: z.string().min(1, "ID is required"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
});

export type CreateBudgetSchemaType = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetSchemaType = z.infer<typeof updateBudgetSchema>;
