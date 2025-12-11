"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useBudgets } from "@/hooks/use-api";
import { Progress } from "@/components/atoms/progress";
import { Skeleton } from "@/components/atoms/skeleton";

export function CategoryBudgetList() {
    const { data: budgets, isLoading } = useBudgets();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Category Budgets</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[80px]" />
                                </div>
                                <Skeleton className="h-2 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Category Budgets</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {budgets?.map((budget) => (
                        <div key={budget.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{budget.category}</span>
                                <span className="text-muted-foreground">${budget.spent} / ${budget.amount}</span>
                            </div>
                            <Progress value={budget.percentage} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{budget.percentage.toFixed(0)}% Spent</span>
                                <span>${budget.remaining} Remaining</span>
                            </div>
                        </div>
                    ))}
                    {(!budgets || budgets.length === 0) && (
                        <div className="text-center py-4 text-muted-foreground">No budgets set.</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
