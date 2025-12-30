"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useCategoryBudgets } from "@/hooks/use-dashboard";
import { Progress } from "@/components/atoms/progress";
import { Skeleton } from "@/components/atoms/skeleton";
import { useCurrency } from "@/contexts/currency-context";

export function CategoryBudgetList() {
    const { categoryBudgetsQuery } = useCategoryBudgets();
    const { data: budgets, isLoading } = categoryBudgetsQuery;
    const { symbol } = useCurrency();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Category Budgets</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6 h-[300px] overflow-y-auto pr-2">
                        {[1, 2, 3, 4, 5].map((i) => (
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
                <div className="space-y-6 h-[300px] overflow-y-auto pr-2">
                    {budgets?.map((budget) => (
                        <div key={budget.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium capitalize">{budget.category.name}</span>
                                <span className="text-muted-foreground">{symbol}{budget.spent_this_month} / {symbol}{budget.amount}</span>
                            </div>
                            <Progress value={budget.percentage} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{budget.percentage.toFixed(0)}% Spent</span>
                                <span>{symbol}{budget.remaining ? budget.remaining : budget.over} {budget.remaining ? "Remaining" : "Over"}</span>
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
