"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useAnalytics } from "@/hooks/use-api";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/atoms/skeleton";

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];

export function SpendingByCategoryChart() {
    const { data: insights, isLoading } = useAnalytics();

    const data = insights?.spendingByCategory || [
        { category: 'Food', amount: 500, percentage: 40 },
        { category: 'Transport', amount: 250, percentage: 20 },
        { category: 'Shopping', amount: 312, percentage: 25 },
        { category: 'Utilities', amount: 187, percentage: 15 },
    ];

    const total = data.reduce((sum, item) => sum + item.amount, 0);

    if (isLoading) {
        return (
            <Card className="h-[400px]">
                <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-full w-full rounded-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full flex items-center justify-between">
                    <div className="w-1/2 h-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="amount"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-sm text-muted-foreground">Total</span>
                            <span className="text-xl font-bold">${total.toFixed(0)}</span>
                        </div>
                    </div>
                    <div className="w-1/2 pl-4 space-y-4">
                        {data.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{item.category}</span>
                                        <span className="text-xs text-muted-foreground">${item.amount.toFixed(2)} ({item.percentage}%)</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
