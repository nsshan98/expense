import { z } from "zod";

export const createBudgetSchema = z.union([
    z.object({
        categoryId: z.string().min(1, "Category ID is required"),
        amount: z.number().min(0.01, "Amount must be greater than 0"),
        month: z.string().optional(),
    }),
    z.object({
        categoryName: z.string().min(1, "Category name is required"),
        categoryType: z.enum(["EXPENSE", "INCOME"]),
        amount: z.number().min(0.01, "Amount must be greater than 0"),
        month: z.string().optional(),
    })
]);

export const updateBudgetSchema = z.object({
    amount: z.number().min(0.01, "Amount must be greater than 0").optional(),
    month: z.string().optional(),
});

export type CreateBudgetSchemaType = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetSchemaType = z.infer<typeof updateBudgetSchema>;

export const editBudgetSchema = z.object({
    categoryName: z.string().min(1, "Category name is required"),
    categoryType: z.enum(["EXPENSE", "INCOME"]),
    amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
    }),
    month: z.string().optional(),
});

export type EditBudgetFormValues = z.infer<typeof editBudgetSchema>;

export const budgetItemSchema = z.object({
    category: z.string().min(1, "Category name is required"),
    type: z.enum(["EXPENSE", "INCOME"]),
    amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: "Amount must be a positive number",
    }),
});

export const budgetSetupSchema = z.object({
    budgets: z.array(budgetItemSchema),
});

export type BudgetSetupFormValues = z.infer<typeof budgetSetupSchema>;
