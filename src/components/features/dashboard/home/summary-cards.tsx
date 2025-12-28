"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useDashboardSummary } from "@/hooks/use-analytics";
import { ArrowUpRight, DollarSign, Wallet, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/atoms/skeleton";

export function SummaryCards() {
    const { data: summary, isLoading } = useDashboardSummary();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[120px] mb-2" />
                            <Skeleton className="h-3 w-[80px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today&apos;s Spend</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">৳{summary?.todaySpend.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Daily overview
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">৳{summary?.thisMonthSpend.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                        <span className="text-primary flex items-center mr-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            {summary?.thisMonthTrend}%
                        </span>
                        from last month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">৳{summary?.remainingBudget.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        {summary?.remainingPercentage.toFixed(0)}% left
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
