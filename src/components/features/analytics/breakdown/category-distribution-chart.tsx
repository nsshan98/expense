"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { CategoryBreakdown } from "@/types/breakdown";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useCurrency } from "@/contexts/currency-context";

interface CategoryDistributionChartProps {
    categories: CategoryBreakdown[];
    totalSpend: number;
}

export function CategoryDistributionChart({ categories, totalSpend }: CategoryDistributionChartProps) {
    const { formatAmount } = useCurrency();

    // Generate colors for categories
    const COLORS = [
        '#FF6B35', // Orange for food
        '#4A90E2', // Blue for transport
        '#9B59B6', // Purple for utilities
        '#2ECC71', // Green
        '#F39C12', // Yellow
        '#E91E63', // Pink
        '#00BCD4', // Cyan
        '#FF5722', // Deep Orange
    ];

    // Transform data for Recharts
    const chartData = categories.map((category, index) => ({
        name: category.name,
        value: category.total,
        percentage: category.percentage,
        count: category.count,
        color: COLORS[index % COLORS.length],
    }));

    // Custom label for the pie chart
    const renderCustomLabel = (entry: any) => {
        return `${entry.percentage.toFixed(1)}%`;
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border rounded-lg shadow-lg p-3">
                    <p className="font-semibold capitalize mb-1">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {formatAmount(data.value)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {data.count} {data.count === 1 ? 'transaction' : 'transactions'}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium">Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Pie Chart */}
                    <div className="w-full md:w-auto shrink-0">
                        <ResponsiveContainer width={240} height={240}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                    labelLine={false}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />

                                {/* Center text */}
                                <text
                                    x="50%"
                                    y="45%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-xs fill-muted-foreground"
                                >
                                    Total
                                </text>
                                <text
                                    x="50%"
                                    y="55%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-lg font-bold fill-foreground"
                                >
                                    {formatAmount(totalSpend)}
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Custom Legend */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col gap-3">
                            {chartData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium capitalize truncate text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-semibold text-sm">{item.percentage.toFixed(1)}%</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatAmount(item.value)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
