"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { useBudgets } from "@/hooks/use-api";
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
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader>
                <CardTitle className="text-2xl">Welcome to Expense Tracker! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                    Get started by setting up your monthly budgets. This helps us provide better insights and predictions.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                    <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg">
                        <Wallet className="h-8 w-8 text-emerald-500 mb-2" />
                        <span className="text-xs font-medium">Track Budgets</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg">
                        <TrendingUp className="h-8 w-8 text-blue-500 mb-2" />
                        <span className="text-xs font-medium">View Trends</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg">
                        <PieChart className="h-8 w-8 text-purple-500 mb-2" />
                        <span className="text-xs font-medium">Analyze Spending</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg">
                        <Bell className="h-8 w-8 text-amber-500 mb-2" />
                        <span className="text-xs font-medium">Get Alerts</span>
                    </div>
                </div>

                <Button
                    onClick={() => router.push('/setup')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    size="lg"
                >
                    Set Up Your Budgets
                </Button>
            </CardContent>
        </Card>
    );
}
