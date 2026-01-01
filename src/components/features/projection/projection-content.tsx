"use client";

import { useProjection } from "@/hooks/use-projection";
import { ProjectionCards, ProjectionCardsSkeleton } from "@/components/features/projection/projection-cards";
import { ProjectionInsight } from "@/components/features/projection/projection-insight";
import { EmptyProjectionState } from "@/components/features/projection/empty-projection-state";
import { Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/atoms/card";

export function ProjectionContent() {
    const { data, isLoading, error, refetch, isRefetching } = useProjection();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-6">
                    {/* Insight Skeleton */}
                    <div className="h-40 bg-muted animate-pulse rounded-lg" />
                    {/* Cards Skeleton */}
                    <ProjectionCardsSkeleton />
                </div>
            );
        }

        if (error) {
            return (
                <div className="space-y-6">
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

        if (!data || data.status !== "success") {
            return (
                <EmptyProjectionState
                    onRefresh={() => refetch()}
                    isRefreshing={isRefetching}
                />
            );
        }

        return (
            <div className="space-y-6">
                {/* Insight Banner */}
                <ProjectionInsight data={data} />

                {/* Metrics Cards */}
                <ProjectionCards data={data} />
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">End of Month Projections</h1>
                    <p className="text-muted-foreground">
                        Track your spending trajectory and financial health.
                    </p>
                </div>

                {/* Period Information */}
                {isLoading ? (
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="h-10 w-40 bg-muted animate-pulse rounded-lg" />
                        <div className="h-10 w-40 bg-muted animate-pulse rounded-lg" />
                    </div>
                ) : data?.period ? (
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-lg">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Current Date:</span>
                            <span className="text-sm font-semibold">{data.period.current_date}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-lg">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Days Remaining:</span>
                            <span className="text-sm font-semibold">{data.period.days_remaining}</span>
                        </div>
                    </div>
                ) : null}
            </div>

            {renderContent()}
        </div>
    );
}
