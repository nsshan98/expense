"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Save, MoreVertical, CheckCircle2, SquarePen, Trash, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/atoms/skeleton";
import { Budget } from "@/types/dashboard";
import { Progress } from "@/components/atoms/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { cn } from "@/lib/utils";

interface BudgetListProps {
    budgets: Budget[] | undefined;
    isLoading: boolean;
    localBudgets: Record<string, string>;
    onAmountChange: (id: string, value: string) => void;
    onSave: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    isUpdating: boolean;
}

export function BudgetList({
    budgets,
    isLoading,
    localBudgets,
    onAmountChange,
    onSave,
    onDelete,
    onEdit,
    isUpdating
}: BudgetListProps) {

    const isDirty = (id: string, originalAmount: number | string) => {
        const localAmount = parseFloat(localBudgets[id]);
        if (isNaN(localAmount)) return true;
        return localAmount !== Number(originalAmount);
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
                            <Skeleton key={i} className="h-24 w-full" />
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
                <div className="space-y-6">
                    {budgets?.map((budget) => {
                        const percentage = Math.min(budget.percentage || 0, 100);
                        const isOverBudget = (budget.percentage || 0) > 100;

                        return (
                            <div key={budget.id} className="flex flex-col gap-3 p-4 border rounded-lg bg-card/50 hover:bg-card transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="capitalize font-semibold text-lg">{budget.category.name}</span>
                                        <div className="text-sm text-muted-foreground flex gap-2">
                                            <span className={cn(isOverBudget ? "text-destructive font-medium" : "text-primary")}>
                                                ৳{Number(budget?.spent || 0).toFixed(2)} spent
                                            </span>
                                            <span>/</span>
                                            <span>৳{Number(budget?.amount || 0).toFixed(2)} limit</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-32">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">৳</span>
                                            <Input
                                                value={localBudgets[budget.id] || ''}
                                                onChange={(e) => onAmountChange(budget.id, e.target.value)}
                                                className="pl-6 h-9 text-right"
                                                type="number"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        {isDirty(budget.id, budget.amount) ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-primary hover:text-primary hover:bg-primary/10"
                                                onClick={() => onSave(budget.id)}
                                                disabled={isUpdating}
                                                title="Save changes"
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground/50 cursor-default">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </Button>
                                        )}

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => onEdit(budget.id)}
                                                >
                                                    <SquarePen className="mr-2 h-4 w-4" />
                                                    Edit Budget
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => onDelete(budget.id)}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete Budget
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{percentage.toFixed(0)}% used</span>
                                        <span>৳{Number(budget.remaining || 0).toFixed(2)} remaining</span>
                                    </div>
                                    <Progress
                                        value={percentage}
                                        className="h-2"
                                        indicatorClassName={isOverBudget ? "bg-destructive" : ""}
                                    />
                                    {isOverBudget && (
                                        <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                                            <AlertTriangle className="h-3 w-3" />
                                            <span>Over budget by ৳{(Number(budget.spent || 0) - Number(budget.amount || 0)).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {(!budgets || budgets.length === 0) && (
                        <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                            <p>No budgets set yet.</p>
                            <p className="text-sm mt-1">Add a category to get started.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
