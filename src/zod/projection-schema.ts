import { z } from "zod";

// Period information schema
export const periodSchema = z.object({
    current_date: z.string(),
    days_remaining: z.number(),
});

// Metrics schema
export const metricsSchema = z.object({
    current_spend: z.number(),
    projected_total: z.number(),
    total_budget: z.number(),
    projected_savings: z.number(),
    projected_overspend: z.number(),
    pacing_index: z.number(),
    safe_daily_spend: z.number(),
    currency: z.string(),
});

// Insight schema
export const insightSchema = z.object({
    message: z.string(),
    pacing_status: z.enum([
        "saving_heavy",
        "on_track",
        "spending_fast"
    ]),
    pacing_description: z.string(),
    is_over_budget_projected: z.boolean(),
});

// Main projection response schema
export const projectionResponseSchema = z.object({
    status: z.enum(["success", "error"]),
    period: periodSchema,
    metrics: metricsSchema,
    insight: insightSchema,
});

// Type exports
export type Period = z.infer<typeof periodSchema>;
export type Metrics = z.infer<typeof metricsSchema>;
export type Insight = z.infer<typeof insightSchema>;
export type ProjectionResponse = z.infer<typeof projectionResponseSchema>;

// Pacing status type for easier use
export type PacingStatus = Insight["pacing_status"];
