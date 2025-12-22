"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Trash2, Plus, Calendar as CalendarIcon, Loader2, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/atoms/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/atoms/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover";
import { MonthPicker } from "@/components/atoms/month-picker";
import { cn } from "@/lib/utils";
import { useCreateBudget } from "@/hooks/use-budgets";
import { axiosClient } from "@/lib/axios-client";
import { Budget } from "@/types/dashboard";

const budgetItemSchema = z.object({
    categoryName: z.string().min(1, "Category name is required"),
    categoryType: z.enum(["EXPENSE", "INCOME"]),
    amount: z.number().min(0, "Amount must be positive"),
    month: z.date().optional(),
});

const bulkCreateBudgetSchema = z.object({
    budgets: z.array(budgetItemSchema).min(1, "At least one budget item is required"),
});

type BulkCreateBudgetValues = z.infer<typeof bulkCreateBudgetSchema>;

export function BudgetBulkCreateForm() {
    const createBudget = useCreateBudget();
    const [isFetching, setIsFetching] = useState(false);
    const [fetchMonth, setFetchMonth] = useState<Date | undefined>(undefined);
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

    const form = useForm<BulkCreateBudgetValues>({
        resolver: zodResolver(bulkCreateBudgetSchema),
        defaultValues: {
            budgets: [
                {
                    categoryName: "",
                    categoryType: "EXPENSE",
                    amount: 0,
                    month: new Date(),
                },
            ],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "budgets",
    });

    const onSubmit = async (data: BulkCreateBudgetValues) => {
        try {
            // Process each budget item sequentially or in parallel
            // Integrating with the existing singleton create mutation
            // ideally backend should support bulk, but looping is fine for now
            const promises = data.budgets.map((item) =>
                createBudget.mutateAsync({
                    categoryName: item.categoryName,
                    categoryType: item.categoryType,
                    amount: item.amount,
                    month: item.month ? format(item.month, "MM-yyyy") : undefined,
                })
            );

            await Promise.all(promises);
            toast.success(`Successfully created ${data.budgets.length} budgets`);

            // Reset form to initial state
            form.reset({
                budgets: [
                    {
                        categoryName: "",
                        categoryType: "EXPENSE",
                        amount: 0,
                        month: new Date(),
                    },
                ],
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to create some budgets. Please check connections.");
        }
    };

    const handleFetchMonthBudget = async (date: Date) => {
        setIsFetching(true);
        setFetchMonth(date);
        setIsMonthPickerOpen(false); // Close popover immediately

        try {
            // Fetch budgets for the selected month
            // User requested: "hit this api will work": GET /all?month=MM-YYYY
            // Mapped to our axios path: /budgets/all
            const formattedMonth = format(date, "MM-yyyy");
            const { data } = await axiosClient.get<Budget[]>('/budgets/all', {
                params: { month: formattedMonth }
            });

            if (data && data.length > 0) {
                const newItems = data.map((b) => ({
                    categoryName: b.category.name,
                    categoryType: b.category.type || "EXPENSE",
                    amount: b.amount,
                    month: new Date(), // Default to current month for the new entry
                }));

                // Replace current form fields with fetched data
                replace(newItems);
                toast.success(`Loaded ${data.length} categories from ${formattedMonth}`);
            } else {
                toast.info(`No budgets found for ${formattedMonth}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch budgets");
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-medium leading-6 text-foreground">Budget Items</h3>
                    <p className="text-sm text-muted-foreground">Add and manage your budget entries.</p>
                </div>
                <Popover open={isMonthPickerOpen} onOpenChange={setIsMonthPickerOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-2 w-full sm:w-auto">
                            {isFetching ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            Import from Month
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <div className="p-3 border-b">
                            <p className="text-sm font-medium text-muted-foreground">Select month to copy from</p>
                        </div>
                        <MonthPicker
                            value={fetchMonth}
                            onValueChange={handleFetchMonthBudget}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="rounded-md border bg-muted/20 overflow-hidden">
                        {/* Header Row - Hidden on Mobile */}
                        <div className="hidden md:grid grid-cols-12 gap-4 border-b bg-muted/40 p-4 text-sm font-medium text-muted-foreground">
                            <div className="col-span-4">Category Name</div>
                            <div className="col-span-2">Type</div>
                            <div className="col-span-2">Amount</div>
                            <div className="col-span-3">Month</div>
                            <div className="col-span-1 text-center">Action</div>
                        </div>

                        {/* Rows */}
                        <div className="divide-y">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-4 p-4 items-end md:items-center animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            control={form.control}
                                            name={`budgets.${index}.categoryName`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="md:hidden">Category Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Groceries" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-6 md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`budgets.${index}.categoryType`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="md:hidden">Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
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
                                    </div>

                                    <div className="col-span-6 md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`budgets.${index}.amount`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="md:hidden">Amount</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                                                            <Input
                                                                type="number"
                                                                className="pl-8"
                                                                {...field}
                                                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-10 md:col-span-3">
                                        <FormField
                                            control={form.control}
                                            name={`budgets.${index}.month`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="md:hidden">Month</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "MMM yyyy")
                                                                    ) : (
                                                                        <span>Pick month</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <MonthPicker
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-2 md:col-span-1 flex justify-center md:justify-center items-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 mb-[2px] md:mb-0"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                            title="Remove row"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({
                                categoryName: "",
                                categoryType: "EXPENSE",
                                amount: 0,
                                month: new Date(),
                            })}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Row
                        </Button>

                        <div className="flex gap-4 items-center">
                            <span className="text-sm text-muted-foreground">
                                Total: {fields.length} items
                            </span>
                            <Button
                                type="submit"
                                disabled={createBudget.isPending}
                                className="min-w-[120px]"
                            >
                                {createBudget.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save All"
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
