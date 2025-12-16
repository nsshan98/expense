"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { useBudgets } from "@/hooks/use-budgets";
import { useRouter } from "next/navigation";
import { Wallet, TrendingUp, PieChart, Bell } from "lucide-react";

export function WelcomeBanner() {
    const { data: budgets, isLoading } = useBudgets();
    const router = useRouter();

    // Don't show if loading or budgets exist
    if (isLoading || (budgets && budgets.length > 0)) {
        return null;
    }

    return (
        <Card className="border-2 border-border bg-muted/30">
            <CardHeader>
                <CardTitle className="text-2xl">Welcome to Expense Tracker! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                    Get started by setting up your monthly budgets. This helps us provide better insights and predictions.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                    <div className="flex flex-col items-center text-center p-3 bg-card rounded-lg border border-border">
                        <Wallet className="h-8 w-8 text-primary mb-2" />
                        <span className="text-xs font-medium">Track Budgets</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-3 bg-card rounded-lg border border-border">
                        <TrendingUp className="h-8 w-8 text-primary mb-2" />
                        <span className="text-xs font-medium">View Trends</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-3 bg-card rounded-lg border border-border">
                        <PieChart className="h-8 w-8 text-primary mb-2" />
                        <span className="text-xs font-medium">Analyze Spending</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-3 bg-card rounded-lg border border-border">
                        <Bell className="h-8 w-8 text-primary mb-2" />
                        <span className="text-xs font-medium">Get Alerts</span>
                    </div>
                </div>

                <Button
                    onClick={() => router.push('/setup')}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                >
                    Set Up Your Budgets
                </Button>
            </CardContent>
        </Card>
    );
}
