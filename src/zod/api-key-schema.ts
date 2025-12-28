import { z } from "zod";

export const ApiKeySchema = z.object({
    geminiApiKey: z.string().min(1, "API Key is required"),
});

export type ApiKeyFormValues = z.infer<typeof ApiKeySchema>;
