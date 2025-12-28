"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useDashboard } from "@/hooks/use-analytics";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/atoms/skeleton";

export function SpendingTrendChart() {
    const { data: dashboardData, isLoading } = useDashboard();

    // Fallback data
    const data = dashboardData?.trend_analysis.chart_data || [];
    const trendingCategories = dashboardData?.trend_analysis.trending_categories || [];

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
                    {trendingCategories.map((cat, idx) => (
                        <div key={idx} className={`capitalize px-2 py-1 text-xs rounded-md font-medium ${idx % 2 === 0 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                            {cat.name} {cat.percentage > 0 ? '+' : ''}{cat.percentage.toFixed(0)}%
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                // Date is already formatted in payload (e.g. "Nov 29") or fullDate
                                // payload `date` is "Nov 29", `fullDate` is "2025-11-29"
                                // We can just use `date` as is or format `fullDate`
                                tickFormatter={(value) => value}
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
                                stroke="var(--secondary)"
                                strokeDasharray="5 5"
                                fillOpacity={1}
                                fill="url(#colorPredicted)"
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="var(--primary)"
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
