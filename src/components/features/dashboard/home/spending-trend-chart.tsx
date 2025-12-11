"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useAnalytics } from "@/hooks/use-api";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/atoms/skeleton";

export function SpendingTrendChart() {
    const { data: insights, isLoading } = useAnalytics();

    // Mock data if insights is empty or loading for visual structure
    const data = insights?.spendingOverTime || [
        { date: '2023-01-01', amount: 0 },
        { date: '2023-01-02', amount: 0 },
    ];

    if (isLoading) {
        return (
            <Card className="h-[400px]">
                <CardHeader>
                    <CardTitle>30-Day Spending Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>30-Day Spending Trend</CardTitle>
                    <p className="text-sm text-muted-foreground">Comparison of actual vs. forecasted spending.</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-md font-medium">Food trending +12%</div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md font-medium">Shopping +8%</div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="predicted"
                                stroke="#6366f1"
                                strokeDasharray="5 5"
                                fillOpacity={1}
                                fill="url(#colorPredicted)"
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorAmount)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
