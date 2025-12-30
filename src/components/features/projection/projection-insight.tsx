"use client";

import { Card, CardContent } from "@/components/atoms/card";
import { ProjectionResponse } from "@/types/projection";
import { useCurrency } from "@/contexts/currency-context";
import { cn } from "@/lib/utils";
import {
    CheckCircle2,
    AlertTriangle,
    Info,
    TrendingUp,
    Sparkles
} from "lucide-react";

interface ProjectionInsightProps {
    data: ProjectionResponse;
}

export function ProjectionInsight({ data }: ProjectionInsightProps) {
    const { formatAmount } = useCurrency();
    const { insight, metrics, period } = data;

    // Determine insight styling based on pacing status
    const getInsightStyle = () => {
        switch (insight.pacing_status) {
            case "saving_heavy":
                return {
                    borderColor: "border-green-200 dark:border-green-800",
                    bgColor: "bg-green-50 dark:bg-green-950/30",
                    iconColor: "text-green-600 dark:text-green-400",
                    icon: CheckCircle2,
                    label: "STATUS: HEALTHY",
                    labelColor: "text-green-700 dark:text-green-300"
                };
            case "on_track":
                return {
                    borderColor: "border-blue-200 dark:border-blue-800",
                    bgColor: "bg-blue-50 dark:bg-blue-950/30",
                    iconColor: "text-blue-600 dark:text-blue-400",
                    icon: Info,
                    label: "STATUS: ON TRACK",
                    labelColor: "text-blue-700 dark:text-blue-300"
                };
            case "spending_fast":
                return {
                    borderColor: "border-red-200 dark:border-red-800",
                    bgColor: "bg-red-50 dark:bg-red-950/30",
                    iconColor: "text-red-600 dark:text-red-400",
                    icon: AlertTriangle,
                    label: "STATUS: WARNING",
                    labelColor: "text-red-700 dark:text-red-300"
                };
            default:
                return {
                    borderColor: "border-border",
                    bgColor: "bg-muted/50",
                    iconColor: "text-muted-foreground",
                    icon: Info,
                    label: "STATUS: UNKNOWN",
                    labelColor: "text-muted-foreground"
                };
        }
    };

    const style = getInsightStyle();
    const Icon = style.icon;

    // Calculate buffer amount
    const buffer = insight.is_over_budget_projected
        ? metrics.projected_overspend
        : metrics.projected_savings;

    return (
        <Card className={cn("border-l-4", style.borderColor, style.bgColor)}>
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn("p-3 rounded-full bg-background/80 border", style.borderColor)}>
                        <Icon className={cn("h-6 w-6", style.iconColor)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                        {/* Status Label */}
                        <div className="flex items-center gap-2">
                            <span className={cn("text-xs font-semibold uppercase tracking-wider", style.labelColor)}>
                                {style.label}
                            </span>
                            {metrics.projected_savings > 0 && (
                                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                    <Sparkles className="h-3 w-3" />
                                    <span>PROJECTED SURPLUS +{((metrics.projected_savings / metrics.total_budget) * 100).toFixed(1)}%</span>
                                </div>
                            )}
                        </div>

                        {/* Main Message */}
                        <h3 className="text-xl font-bold leading-tight">
                            {insight.message.replace(/د\.إ[\d,]+/, formatAmount(buffer))}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground">
                            {insight.pacing_description} Based on your current spending habits, you are projected to end the month with a{" "}
                            <span className={cn("font-semibold", style.iconColor)}>
                                {insight.is_over_budget_projected ? "deficit" : "surplus"}
                            </span>{" "}
                            of {formatAmount(buffer)}.
                        </p>

                        {/* Period Info */}
                        <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <span className="font-medium">Current Date:</span>
                                <span>{period.current_date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-medium">Days Remaining:</span>
                                <span className={cn("font-semibold", period.days_remaining <= 3 ? "text-orange-600 dark:text-orange-400" : "")}>
                                    {period.days_remaining}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
