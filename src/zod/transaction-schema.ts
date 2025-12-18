import { z } from "zod";

export const transactionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    date: z.string().optional(),
    categoryId: z.string().optional(),
    note: z.string().optional(),
    // type: z.enum(["income", "expense"]).optional(),
});

export const updateTransactionSchema = transactionSchema.partial().extend({
    id: z.string().min(1, "ID is required"),
});

export const mergeTransactionSchema = z.object({
    originalName: z.string().min(1, "Original Name is required"),
    finalName: z.string().min(1, "Final Name is required"),
});

export const editTransactionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
    }),
    categoryId: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
    // type: z.enum(["income", "expense"]),
});

export type TransactionSchemaType = z.infer<typeof transactionSchema>;
export type UpdateTransactionSchemaType = z.infer<typeof updateTransactionSchema>;
export type MergeTransactionSchemaType = z.infer<typeof mergeTransactionSchema>;
export type EditTransactionFormValues = z.infer<typeof editTransactionSchema>;

export const quickAddSchema = z.object({
    name: z.string().min(1, "Name is required"),
    amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
    }),
    date: z.string().optional(),
    // type is handled implicitly or via default
});

export type QuickAddFormValues = z.infer<typeof quickAddSchema>;
