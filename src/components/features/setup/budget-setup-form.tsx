"use client";

import { Card } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { useCreateCategory } from "@/hooks/use-categories";
import { useBudgets, useCreateBudget } from "@/hooks/use-budgets";
import { useCurrency } from "@/contexts/currency-context";
import { toast } from "sonner";
import { Utensils, Bus, ShoppingBag, Home, Coffee, Zap, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/atoms/popover";
import { useEffect, useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/atoms/form";
import { budgetSetupSchema, BudgetSetupFormValues } from "@/zod/budget-schema";
import { MonthPicker } from "@/components/atoms/month-picker";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/atoms/select";

const defaultCategories = [
    { category: "Food", amount: "10000", type: "EXPENSE" as const },
    { category: "Transport", amount: "3000", type: "EXPENSE" as const },
    { category: "Shopping", amount: "8000", type: "EXPENSE" as const },
    { category: "Utilities", amount: "5000", type: "EXPENSE" as const },
    { category: "Housing", amount: "15000", type: "EXPENSE" as const },
    { category: "Entertainment", amount: "4000", type: "EXPENSE" as const },
];

interface BudgetSetupFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    isDialog?: boolean;
}

export function BudgetSetupForm({ onSuccess, onCancel, isDialog = false }: BudgetSetupFormProps) {
    const router = useRouter();
    const createCategory = useCreateCategory();
    const createBudget = useCreateBudget();
    const { data: existingBudgets } = useBudgets();
    const { symbol } = useCurrency();
    const [date, setDate] = useState<Date>(new Date());
    const [dialogOpen, setDialogOpen] = useState(false);


    const form = useForm<BudgetSetupFormValues>({
        resolver: zodResolver(budgetSetupSchema),
        defaultValues: {
            budgets: defaultCategories.map((cat, idx) => ({
                category: cat.category,
                amount: cat.amount,
                type: cat.type,
            })),
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "budgets",
    });

    const handleAddCustom = () => {
        append({
            category: "",
            amount: "0",
            type: "EXPENSE",
        });
    };

    const onSubmit = async (data: BudgetSetupFormValues) => {
        // Validate all budgets
        const validBudgets = data.budgets.filter(b => b.category && parseFloat(b.amount) > 0);

        if (validBudgets.length === 0) {
            toast.error("Please add at least one budget with a valid amount");
            return;
        }

        try {
            const monthStr = format(date, "MM-yyyy");

            // Prepare payloads
            const budgetPayloads = validBudgets.map(budget => ({
                categoryName: budget.category,
                categoryType: budget.type,
                amount: parseFloat(budget.amount),
                month: monthStr,
            }));

            // Create budgets
            await createBudget.mutateAsync(budgetPayloads);

            toast.success("Budgets created successfully!");
            if (isDialog && onSuccess) {
                onSuccess();
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create budgets");
        }
    };

    // Redirect logic removed to allow access to setup page for new budgets


    const content = (
        <div className={cn("flex flex-col", isDialog ? "h-full overflow-hidden" : "space-y-6")}>
            <div className={cn("flex items-center justify-between gap-4", !isDialog && "mb-6")}>
                {!isDialog && (
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Set your monthly budgets</h1>
                        <p className="text-muted-foreground mt-2">Helps us predict and warn you early.</p>
                    </div>
                )}
                {isDialog && <p className="text-sm text-muted-foreground shrink-0 pb-4">Set budgets for {format(date, 'MMMM yyyy')}</p>}

                <Popover open={dialogOpen} onOpenChange={setDialogOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[180px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <MonthPicker
                            value={date}
                            onValueChange={(value) => {
                                setDate(value);
                                setDialogOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col", isDialog ? "flex-1 min-h-0" : "space-y-4")}>
                    <div className={cn("space-y-6", isDialog && "flex-1 overflow-y-auto pr-2 min-h-0")}>
                        {fields.map((field, index) => {
                            return (
                                <div key={field.id} className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                                    <div className="flex items-start gap-3">
                                        <FormField
                                            control={form.control}
                                            name={`budgets.${index}.category`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Category Name" className="bg-background" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`budgets.${index}.type`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-[110px] bg-background">
                                                                <SelectValue placeholder="Type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="EXPENSE">Expense</SelectItem>
                                                            <SelectItem value="INCOME">Income</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            className="text-muted-foreground hover:text-destructive shrink-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                                            {symbol}
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name={`budgets.${index}.amount`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            className="pl-8 bg-background border-border text-lg font-medium"
                                                            placeholder="0.00"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddCustom}
                            className="w-full border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-muted-foreground py-4"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </div>

                    <div className={cn("flex gap-3 pt-4", isDialog ? "border-t border-border mt-auto" : "mt-4")}>
                        {!isDialog && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.back()}
                                className="flex-1"
                            >
                                Back
                            </Button>
                        )}

                        {isDialog && onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        )}

                        <Button
                            type="submit"
                            disabled={createCategory.isPending || createBudget.isPending}
                            className={cn("bg-primary hover:bg-primary/90 text-primary-foreground", isDialog ? "flex-1" : "flex-1")}
                        >
                            {(createCategory.isPending || createBudget.isPending) ? "Creating..." : "Save Budgets"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );

    if (isDialog) return content;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-md p-8">
                {content}
            </Card>
        </div>
    );
}
