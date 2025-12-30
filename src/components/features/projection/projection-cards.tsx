"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Skeleton } from "@/components/atoms/skeleton";
import {
    TrendingUp,
    TrendingDown,
    HandCoins,
    Wallet,
    Target,
    Activity,
    AlertTriangle,
    Calendar,
    DollarSign
} from "lucide-react";
import { ProjectionResponse } from "@/types/projection";
import { useCurrency } from "@/contexts/currency-context";
import { cn } from "@/lib/utils";

interface ProjectionCardsProps {
    data: ProjectionResponse;
}

export function ProjectionCards({ data }: ProjectionCardsProps) {
    const { formatAmount, code: userCurrency } = useCurrency();
    const { metrics, insight } = data;

    // Determine status colors based on pacing
    const getStatusColor = () => {
        switch (insight.pacing_status) {
            case "saving_heavy":
                return "text-green-600 dark:text-green-400";
            case "on_track":
                return "text-blue-600 dark:text-blue-400";
            case "spending_fast":
                return "text-red-600 dark:text-red-400";
            default:
                return "text-muted-foreground";
        }
    };

    const getPacingIcon = () => {
        switch (insight.pacing_status) {
            case "saving_heavy":
                return <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />;
            case "spending_fast":
                return <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />;
            case "on_track":
            default:
                return <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Budget Utilization Card */}
            <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Total Budget Utilization
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                        <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Current Spend Amount */}
                    <div>
                        <div className="text-3xl font-bold tracking-tight">
                            {formatAmount(metrics.current_spend)}
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                {userCurrency} spent of {formatAmount(metrics.total_budget)}
                            </span>
                        </div>
                    </div>

                    {/* Percentage Stats */}
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                            {((metrics.current_spend / metrics.total_budget) * 100).toFixed(1)}% Used
                        </span>
                        <span className="text-muted-foreground">
                            {(100 - (metrics.current_spend / metrics.total_budget) * 100).toFixed(1)}% Remaining
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-blue-100 dark:bg-blue-950/30 rounded-full overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-orange-500 dark:bg-orange-400 transition-all duration-500"
                            style={{
                                width: `${Math.min((metrics.current_spend / metrics.total_budget) * 100, 100)}%`
                            }}
                        />
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-orange-500 dark:bg-orange-400" />
                            <span className="text-muted-foreground">Current Spend</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-blue-100 dark:bg-blue-950/30" />
                            <span className="text-muted-foreground">Budget Remaining</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Projected Total */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projected Total</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatAmount(metrics.projected_total)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Based on daily avg.
                    </p>
                </CardContent>
            </Card>

            {/* Projected Savings */}
            <Card className={cn(
                metrics.projected_savings > 0
                    ? "border-green-200 dark:border-green-800"
                    : ""
            )}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projected Savings</CardTitle>
                    <HandCoins className="h-4 w-4 text-green-600 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatAmount(metrics.projected_savings)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {((metrics.projected_savings / metrics.total_budget) * 100).toFixed(1)}% of budget
                    </p>
                </CardContent>
            </Card>

            {/* Safe Daily Spend */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Safe Daily Spend</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatAmount(metrics.safe_daily_spend)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        To reach zero balance
                    </p>
                </CardContent>
            </Card>

            {/* Pacing Index */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pacing Index</CardTitle>
                    {getPacingIcon()}
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold", getStatusColor())}>
                        {metrics.pacing_index.toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {insight.pacing_description}
                    </p>
                </CardContent>
            </Card>

            {/* Projected Overspend */}
            <Card className={cn(
                metrics.projected_overspend > 0
                    ? "border-red-200 dark:border-red-800"
                    : "border-green-200 dark:border-green-800"
            )}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projected Overspend</CardTitle>
                    {metrics.projected_overspend > 0 ? (
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    ) : (
                        <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className={cn(
                        "text-2xl font-bold",
                        metrics.projected_overspend > 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                    )}>
                        {formatAmount(metrics.projected_overspend)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {metrics.projected_overspend > 0 ? "Over budget risk" : "No overspend risk"}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export function ProjectionCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className={i === 1 ? "md:col-span-2 lg:col-span-1" : ""}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-[140px] mb-2" />
                        <Skeleton className="h-3 w-[100px]" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
