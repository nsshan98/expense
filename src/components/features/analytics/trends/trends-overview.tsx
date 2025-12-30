"use client";

import { useAnalyticsTrends } from "@/hooks/use-analytics";
import { MomCard } from "./mom-card";
import { WeekendAnalysis } from "./weekend-analysis";
import { CalendarDays, Inbox, AlertCircle, Settings } from "lucide-react";
import { Button } from "@/components/atoms/button";
import Link from "next/link";
import { Skeleton } from "@/components/atoms/skeleton";
import { Card, CardContent } from "@/components/atoms/card";

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

                <Card className="border-amber-200 bg-amber-50/50">
                    <CardContent className="p-6">
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-amber-100 rounded-full shrink-0">
                                <Settings className="h-6 w-6 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                                    Setup Required
                                </h3>
                                <p className="text-amber-800 mb-4">
                                    {data.message || "Please complete your setup to view analytics."}
                                </p>

                                {data.setup_required && data.setup_required.length > 0 && (
                                    <div className="mb-4 p-3 bg-white/60 rounded-lg border border-amber-200">
                                        <p className="text-sm font-medium text-amber-900 mb-2">
                                            Missing Configuration:
                                        </p>
                                        <ul className="space-y-1">
                                            {data.setup_required.map((item) => (
                                                <li key={item} className="text-sm text-amber-800 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                    {item === 'weekend_days'
                                                        ? 'Weekend Days Preference'
                                                        : item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <Link href="/settings">
                                    <Button
                                        variant="default"
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                    >
                                        <Settings className="h-4 w-4 mr-2" />
                                        Configure Settings
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Show placeholder cards to give context of what's coming */}
                <div className="space-y-4 opacity-50 pointer-events-none">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <CalendarDays className="h-5 w-5 text-sky-500" />
                        <h3>Month-over-Month Analysis</h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-4 opacity-50 pointer-events-none">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Inbox className="h-5 w-5 text-sky-500" />
                        <h3>Weekend vs. Weekday Spending</h3>
                    </div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </CardContent>
                    </Card>
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
