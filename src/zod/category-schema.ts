import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["EXPENSE", "INCOME"]),
});

export const updateCategorySchema = z.object({
    id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Name is required").optional(),
    type: z.enum(["EXPENSE", "INCOME"]).optional(),
});

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>;

export const addCategoryFormSchema = z.object({
    name: z.string().min(1, "Category name is required"),
    type: z.enum(["EXPENSE", "INCOME"]),
    amount: z.string().optional(),
    month: z.date().optional(),
});

export type AddCategoryFormValues = z.infer<typeof addCategoryFormSchema>;
