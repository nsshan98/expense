"use client";

import { SpendingTrendChart } from "@/components/features/dashboard/home/spending-trend-chart";
import { SpendingByCategoryChart } from "@/components/features/analytics/spending-by-category-chart";
import { RecentTransactions } from "@/components/features/dashboard/home/recent-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useDashboardSummary } from "@/hooks/use-analytics";

export function AnalyticsContent() {
    const { data: summary } = useDashboardSummary();

    return (
        <>
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${summary?.thisMonthSpend.toFixed(2) || '0.00'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Daily Average</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$41.68</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Biggest Spike Day</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Nov 15</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Predicted Spend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1,500</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <SpendingTrendChart />
                <SpendingByCategoryChart />
            </div>

            <RecentTransactions />
        </>
    );
}
