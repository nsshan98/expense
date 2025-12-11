"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Save, MoreVertical, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/atoms/skeleton";
import { Budget } from "@/types/dashboard";

interface BudgetListProps {
    budgets: Budget[] | undefined;
    isLoading: boolean;
    localBudgets: Record<string, string>;
    onAmountChange: (id: string, value: string) => void;
    onSave: (id: string) => void;
    isUpdating: boolean;
}

export function BudgetList({
    budgets,
    isLoading,
    localBudgets,
    onAmountChange,
    onSave,
    isUpdating
}: BudgetListProps) {

    const isDirty = (id: string, originalAmount: number) => {
        const localAmount = parseFloat(localBudgets[id]);
        if (isNaN(localAmount)) return true;
        return localAmount !== originalAmount;
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Budgets</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Budgets</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground mb-2 px-2">
                        <div className="col-span-4">Category Name</div>
                        <div className="col-span-6">Budget</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                        {budgets?.map((budget) => (
                            <div key={budget.id} className="grid grid-cols-12 items-center py-4 px-2">
                                <div className="col-span-4 font-medium">{budget.category}</div>
                                <div className="col-span-6 pr-4">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                        <Input
                                            value={localBudgets[budget.id] || ''}
                                            onChange={(e) => onAmountChange(budget.id, e.target.value)}
                                            className="pl-6 bg-gray-50"
                                            type="number"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 flex justify-end gap-2">
                                    {isDirty(budget.id, budget.amount) ? (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                            onClick={() => onSave(budget.id)}
                                            disabled={isUpdating}
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 cursor-default">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {(!budgets || budgets.length === 0) && (
                            <div className="text-center py-4 text-muted-foreground">No budgets found.</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
