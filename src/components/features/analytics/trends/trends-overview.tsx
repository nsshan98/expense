"use client";

import { useAnalyticsTrends } from "@/hooks/use-analytics";
import { MomCard } from "./mom-card";
import { WeekendAnalysis } from "./weekend-analysis";
import { CalendarDays, Inbox, AlertCircle } from "lucide-react";
import { Button } from "@/components/atoms/button"; // Assuming available
import Link from "next/link";
import { Skeleton } from "@/components/atoms/skeleton"; // Assuming available

// Helper function to format previous period label like "Previous Total (Nov 1)"
function formatPreviousPeriodLabel(periodPrevious: string): string {
    try {
        // Handle date ranges like "11/1/2025 - 11/30/2025"
        const parts = periodPrevious.split(' - ');
        if (parts.length === 2) {
            const startDate = new Date(parts[0].trim());
            if (!isNaN(startDate.getTime())) {
                const month = startDate.toLocaleDateString('en-US', { month: 'short' });
                const day = startDate.getDate();
                return `Previous Total (${month} ${day})`;
            }
        }

        // Fallback for other formats
        return `Previous Total (${periodPrevious.split('-')[0].trim()})`;
    } catch (error) {
        return `Previous Total (${periodPrevious})`;
    }
}

export function TrendsOverview() {
    const { data, isLoading, error } = useAnalyticsTrends();

    if (isLoading) {
        return <TrendsSkeleton />;
    }

    if (error || !data) {
        return (
            <div className="bg-destructive/15 border border-destructive/20 text-destructive rounded-lg p-4 flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                    <h5 className="font-semibold mb-1">Error</h5>
                    <div className="text-sm opacity-90">
                        Failed to load analytics trends. Please try again later.
                    </div>
                </div>
            </div>
        );
    }

    if (data.status === 'missing_configuration') {
        return (
            <div className="flex flex-col gap-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Spending Overview</h2>
                    <p className="text-muted-foreground">
                        Deep dive into your financial habits and trends over time.
                    </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                        <h5 className="font-semibold mb-1 text-amber-800">Configuration Required</h5>
                        <div className="text-amber-700 text-sm">
                            {data.message || "Please complete your setup to view analytics."}
                            <div className="mt-4">
                                <Link href="/settings">
                                    <Button variant="outline" className="bg-white border-amber-300 text-amber-900 hover:bg-amber-50 h-9 px-4 py-2">
                                        Go to Settings
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    const { mom_analysis, weekend_vs_weekday } = data;

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Spending Overview</h2>
                <p className="text-muted-foreground">
                    Deep dive into your financial habits and trends over time.
                </p>
            </div>

            {/* Month-over-Month Analysis */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <CalendarDays className="h-5 w-5 text-sky-500" />
                    <h3>Month-over-Month Analysis</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <MomCard
                        title="Calendar Month"
                        dateRange={mom_analysis.calendar_month.period_current}
                        currentTotal={mom_analysis.calendar_month.current_total}
                        previousTotal={mom_analysis.calendar_month.previous_total}
                        percentageChange={mom_analysis.calendar_month.percentage_change}
                        periodPreviousLabel={formatPreviousPeriodLabel(mom_analysis.calendar_month.period_previous)}
                    />
                    <MomCard
                        title="Rolling 30 Days"
                        dateRange={mom_analysis.rolling_30_days.period_current}
                        currentTotal={mom_analysis.rolling_30_days.current_total}
                        previousTotal={mom_analysis.rolling_30_days.previous_total}
                        percentageChange={mom_analysis.rolling_30_days.percentage_change}
                        periodPreviousLabel={formatPreviousPeriodLabel(mom_analysis.rolling_30_days.period_previous)}
                    />
                </div>
            </div>

            {/* Weekend vs Weekday Spending */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <Inbox className="h-5 w-5 text-sky-500" />
                    <h3>Weekend vs. Weekday Spending</h3>
                </div>

                {weekend_vs_weekday ? (
                    <WeekendAnalysis data={weekend_vs_weekday} />
                ) : (
                    <div className="p-6 border rounded-lg bg-muted/50 text-center text-muted-foreground">
                        No weekend data available.
                    </div>
                )}
            </div>
        </div>
    );
}

function TrendsSkeleton() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-[200px]" />
                    <Skeleton className="h-[200px]" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-[200px]" />
            </div>
        </div>
    );
}
