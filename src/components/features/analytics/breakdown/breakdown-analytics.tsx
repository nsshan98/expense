"use client";

import { useState, useMemo } from "react";
import { useBreakdownAnalytics } from "@/hooks/use-analytics";
import { BreakdownSummary } from "./breakdown-summary";
import { CategoryDistributionChart } from "./category-distribution-chart";
import { CategoryBreakdownList } from "./category-breakdown-list";
import { EmptyState } from "./empty-state";
import { Skeleton } from "@/components/atoms/skeleton";
import { Calendar, RotateCcw } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover";
import { Calendar as CalendarComponent } from "@/components/atoms/calendar";
import { format } from "date-fns";

export function BreakdownAnalytics() {
    // Default to last 30 days
    const getDefaultDateRange = () => {
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - 30);
        return { from, to };
    };

    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>(getDefaultDateRange);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [tempDateRange, setTempDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });

    // Reset to last 30 days from today
    const resetDateRange = () => {
        setDateRange(getDefaultDateRange());
        setTempDateRange({ from: undefined, to: undefined });
    };

    // Format dates for API (DD-MM-YYYY)
    const formatDateForAPI = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Only format dates if both are selected
    const startDate = dateRange.from ? formatDateForAPI(dateRange.from) : undefined;
    const endDate = dateRange.to ? formatDateForAPI(dateRange.to) : undefined;

    const { data, isLoading, error } = useBreakdownAnalytics(startDate, endDate);

    // Calculate daily average
    const dailyAverage = useMemo(() => {
        if (!data || !dateRange.from || !dateRange.to) return 0;
        const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
        return data.total_spend / (daysDiff || 1);
    }, [data, dateRange]);

    // Calculate total transaction count
    const totalTransactions = useMemo(() => {
        if (!data) return 0;
        return data.breakdown.reduce((sum, cat) => sum + cat.count, 0);
    }, [data]);

    if (isLoading) {
        return <BreakdownSkeleton />;
    }

    if (error || !data) {
        return (
            <div className="p-8 text-center">
                <p className="text-muted-foreground">Failed to load breakdown analytics. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Date Picker */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Breakdown Analytics</h2>
                    <p className="text-muted-foreground mt-1">
                        Analyze your spending habits over specific periods to identify trends and optimize your budget.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Popover
                        open={isCalendarOpen}
                        onOpenChange={(open) => {
                            setIsCalendarOpen(open);
                            // Reset temp selection when opening
                            if (open) {
                                setTempDateRange({ from: undefined, to: undefined });
                            }
                        }}
                    >
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span className="text-sm font-medium">Date Period</span>
                                {dateRange.from && dateRange.to && (
                                    <div className="ml-auto pl-4 text-xs text-muted-foreground">
                                        {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                                    </div>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <CalendarComponent
                                mode="range"
                                selected={{ from: tempDateRange.from, to: tempDateRange.to }}
                                onSelect={(range) => {
                                    if (range) {
                                        // Update temporary selection
                                        setTempDateRange({ from: range.from, to: range.to });

                                        // Only update actual date range and close when:
                                        // 1. Both dates are selected
                                        // 2. The dates are different (not the same day)
                                        if (range.from && range.to && range.from.getTime() !== range.to.getTime()) {
                                            setDateRange({ from: range.from, to: range.to });
                                            setIsCalendarOpen(false);
                                        }
                                    }
                                }}
                                numberOfMonths={1}
                                className="md:hidden"
                            />
                            <CalendarComponent
                                mode="range"
                                selected={{ from: tempDateRange.from, to: tempDateRange.to }}
                                onSelect={(range) => {
                                    if (range) {
                                        // Update temporary selection
                                        setTempDateRange({ from: range.from, to: range.to });

                                        // Only update actual date range and close when:
                                        // 1. Both dates are selected
                                        // 2. The dates are different (not the same day)
                                        if (range.from && range.to && range.from.getTime() !== range.to.getTime()) {
                                            setDateRange({ from: range.from, to: range.to });
                                            setIsCalendarOpen(false);
                                        }
                                    }
                                }}
                                numberOfMonths={2}
                                className="hidden md:block"
                            />
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={resetDateRange}
                        title="Reset to last 30 days"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Check if there's no data */}
            {data.total_spend === 0 || data.breakdown.length === 0 ? (
                <EmptyState
                    title="No Transactions Found"
                    description="There are no transactions for the selected period. Try selecting a different date range or add some transactions to see your spending breakdown."
                    icon="package"
                />
            ) : (
                <>
                    {/* Summary and Chart Row */}
                    <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
                        <BreakdownSummary
                            totalSpend={data.total_spend}
                            transactionCount={totalTransactions}
                            dailyAverage={dailyAverage}
                        />
                        <CategoryDistributionChart
                            categories={data.breakdown}
                            totalSpend={data.total_spend}
                        />
                    </div>

                    {/* Category Breakdown List */}
                    <CategoryBreakdownList
                        categories={data.breakdown}
                        totalSpend={data.total_spend}
                    />
                </>
            )}
        </div>
    );
}

function BreakdownSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-[200px]" />
                <Skeleton className="h-[200px]" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
            </div>
        </div>
    );
}
