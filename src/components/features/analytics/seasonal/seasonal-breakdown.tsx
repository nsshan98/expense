"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useAnalyticsTrends } from "@/hooks/use-analytics";
import { Skeleton } from "@/components/atoms/skeleton";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/atoms/select";

export function SeasonalBreakdown() {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const { data, isLoading, error } = useAnalyticsTrends();

    // Get seasonality data
    const seasonalityData = useMemo(() => {
        if (!data || data.status !== 'success' || !data.seasonality) return [];
        return data.seasonality;
    }, [data]);

    // Find peak month
    const peakMonth = useMemo(() => {
        if (!seasonalityData || seasonalityData.length === 0) return null;
        return seasonalityData.find((m: any) => m.is_peak);
    }, [seasonalityData]);

    // Generate year options (from 2020 to current year)
    const yearOptions = useMemo(() => {
        const startYear = 2020;
        const years = [];
        for (let year = startYear; year <= currentYear; year++) {
            years.push(year);
        }
        return years.reverse(); // Most recent first
    }, [currentYear]);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border rounded-lg shadow-lg p-3">
                    <p className="font-semibold mb-1">{data.month} {selectedYear}</p>
                    <p className="text-sm text-muted-foreground">
                        ৳{data.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    {data.is_peak && (
                        <p className="text-xs text-red-600 font-medium mt-1">Peak Month</p>
                    )}
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return <SeasonalSkeleton />;
    }

    if (error || !seasonalityData || seasonalityData.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-semibold">Seasonality</CardTitle>
                    </div>

                    {/* Year Selector */}
                    <Select
                        value={selectedYear.toString()}
                        onValueChange={(value) => setSelectedYear(parseInt(value))}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            {yearOptions.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Peak Month Card */}
                    {peakMonth && (
                        <div className="w-full md:w-64 shrink-0">
                            <div className="bg-linear-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 rounded-lg p-6 border border-cyan-200 dark:border-cyan-800">
                                <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
                                    Peak Spending Month
                                </p>
                                <h3 className="text-4xl font-bold mb-2">{peakMonth.month}</h3>
                                <p className="text-2xl font-semibold text-foreground">
                                    ৳{peakMonth.amount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Bar Chart */}
                    <div className="flex-1">
                        <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Monthly Spending Trends</h4>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                                    <span className="text-muted-foreground">Regular</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                                    <span className="text-muted-foreground">Current</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <span className="text-muted-foreground">Peak</span>
                                </div>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={seasonalityData}>
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Bar
                                    dataKey="amount"
                                    radius={[8, 8, 0, 0]}
                                    maxBarSize={40}
                                >
                                    {seasonalityData.map((entry: any, index: number) => {
                                        const currentMonth = new Date().getMonth();
                                        const currentMonthName = new Date().toLocaleString('en-US', { month: 'short' });
                                        const isCurrentMonth = entry.month === currentMonthName && selectedYear === currentYear;

                                        let color = 'hsl(var(--muted))'; // Regular (gray)

                                        if (entry.is_peak) {
                                            color = '#f87171'; // Peak (red)
                                        } else if (isCurrentMonth) {
                                            color = '#22d3ee'; // Current (cyan)
                                        }

                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function SeasonalSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-6">
                    <Skeleton className="w-64 h-40" />
                    <Skeleton className="flex-1 h-40" />
                </div>
            </CardContent>
        </Card>
    );
}
