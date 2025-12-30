"use client";

import { useProjection } from "@/hooks/use-projection";
import { ProjectionCards, ProjectionCardsSkeleton } from "@/components/features/projection/projection-cards";
import { ProjectionInsight } from "@/components/features/projection/projection-insight";
import { EmptyProjectionState } from "@/components/features/projection/empty-projection-state";
import { Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/atoms/card";

export default function ProjectionPage() {
    const { data, isLoading, error, refetch, isRefetching } = useProjection();

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-96 bg-muted animate-pulse rounded" />
                </div>

                {/* Period Info Skeleton */}
                <div className="flex items-center gap-4">
                    <div className="h-10 w-40 bg-muted animate-pulse rounded-lg" />
                    <div className="h-10 w-40 bg-muted animate-pulse rounded-lg" />
                </div>

                {/* Insight Skeleton */}
                <div className="h-40 bg-muted animate-pulse rounded-lg" />

                {/* Cards Skeleton */}
                <ProjectionCardsSkeleton />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">End of Month Projections</h1>
                    <p className="text-muted-foreground mt-1">
                        Track your spending trajectory and financial health.
                    </p>
                </div>

                <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <p className="text-sm text-red-900 dark:text-red-100">
                                Failed to load projection data. Please try again later.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <EmptyProjectionState
                    onRefresh={() => refetch()}
                    isRefreshing={isRefetching}
                />
            </div>
        );
    }

    // No data state
    if (!data || data.status !== "success") {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">End of Month Projections</h1>
                    <p className="text-muted-foreground mt-1">
                        Track your spending trajectory and financial health.
                    </p>
                </div>

                <EmptyProjectionState
                    onRefresh={() => refetch()}
                    isRefreshing={isRefetching}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        End of Month Projections
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track your spending trajectory and financial health.
                    </p>
                </div>
                {/* Period Information */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Current Date:</span>
                        <span className="text-sm font-semibold">{data.period.current_date}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Days Remaining:</span>
                        <span className="text-sm font-semibold">{data.period.days_remaining}</span>
                    </div>
                </div>
            </div>



            {/* Insight Banner */}
            <ProjectionInsight data={data} />

            {/* Metrics Cards */}
            <ProjectionCards data={data} />
        </div>
    );
}
