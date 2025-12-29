"use client";

import { Card, CardContent } from "@/components/atoms/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface BreakdownSummaryProps {
    totalSpend: number;
    transactionCount: number;
    dailyAverage: number;
    monthOverMonthChange?: number;
}

export function BreakdownSummary({
    totalSpend,
    transactionCount,
    dailyAverage,
    monthOverMonthChange
}: BreakdownSummaryProps) {
    const isPositive = monthOverMonthChange !== undefined && monthOverMonthChange > 0;
    const isNegative = monthOverMonthChange !== undefined && monthOverMonthChange < 0;

    return (
        <Card className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0">
            <CardContent className="p-6">
                {/* Header */}
                <div className="mb-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Spend</p>
                </div>

                {/* Main Amount */}
                <div className="mb-3">
                    <h2 className="text-5xl font-bold tracking-tight">
                        ৳{totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                </div>

                {/* Month over Month Change */}
                {monthOverMonthChange !== undefined && monthOverMonthChange !== 0 && (
                    <div className="flex items-center gap-1.5 mb-6">
                        {isNegative ? (
                            <TrendingDown className="h-4 w-4 text-green-600" />
                        ) : (
                            <TrendingUp className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${isNegative ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(monthOverMonthChange).toFixed(1)}% vs last month
                        </span>
                    </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/50">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                            Transactions
                        </p>
                        <p className="text-2xl font-bold">{transactionCount}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                            Daily Avg
                        </p>
                        <p className="text-2xl font-bold">৳{dailyAverage.toFixed(2)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
