"use client";

import { Card, CardContent } from "@/components/atoms/card";
import { Armchair, Briefcase, Lightbulb, Settings } from "lucide-react";
import { WeekdayWeekendAnalysis } from "@/types/analytics";
import { Button } from "@/components/atoms/button";
import Link from "next/link";
import { useCurrency } from "@/contexts/currency-context";

interface WeekendAnalysisProps {
    data: WeekdayWeekendAnalysis;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDayRange(days: number[]): string {
    if (!days || days.length === 0) return "";

    const sortedDays = [...days].sort((a, b) => a - b);
    const dayNames = sortedDays.map(d => DAY_NAMES[d]);

    // If consecutive days, show as range
    if (sortedDays.length > 1) {
        const isConsecutive = sortedDays.every((day, i) =>
            i === 0 || day === sortedDays[i - 1] + 1
        );

        if (isConsecutive) {
            return `${dayNames[0]} - ${dayNames[dayNames.length - 1]}`;
        }
    }

    // Otherwise, join with commas
    return dayNames.join(", ");
}

export function WeekendAnalysis({ data }: WeekendAnalysisProps) {
    const { formatAmount } = useCurrency();
    const { weekday_avg, weekend_avg, weekend_days, weekday_days, formatted_message } = data;

    // Check if data is actually available (not null/undefined)
    const hasValidData = weekday_avg !== null && weekday_avg !== undefined &&
        weekend_avg !== null && weekend_avg !== undefined;

    if (!hasValidData) {
        return (
            <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-6">
                    <div className="flex gap-4 items-start">
                        <div className="p-3 bg-amber-100 rounded-full shrink-0">
                            <Settings className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-amber-900 mb-2">
                                Weekend Preference Required
                            </h3>
                            <p className="text-amber-800 mb-4">
                                To view weekend vs. weekday spending analysis, please configure your weekend days in settings.
                            </p>
                            <Link href="/settings">
                                <Button
                                    variant="default"
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Configure Weekend Days
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const weekdayLabel = formatDayRange(weekday_days);
    const weekendLabel = formatDayRange(weekend_days);

    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Weekday Average */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Weekday Average</span>
                        </div>
                        <div className="mb-1">
                            <span className="text-3xl font-bold">
                                {formatAmount(weekday_avg)}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{weekdayLabel}</span>
                    </div>

                    {/* Weekend Average */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <Armchair className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Weekend Average</span>
                        </div>
                        <div className="mb-1">
                            <span className="text-3xl font-bold">
                                {formatAmount(weekend_avg)}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{weekendLabel}</span>
                    </div>

                    {/* Insight */}
                    <div className="rounded-xl p-4 flex gap-3 text-sm">
                        <Lightbulb className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold mb-1">Spending Insight</h4>
                            <p className="text-muted-foreground leading-relaxed">
                                {formatted_message}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
