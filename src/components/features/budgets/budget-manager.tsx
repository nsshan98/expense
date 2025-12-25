"use client";

import { BudgetList } from "@/components/features/budgets/budget-list";
import { useBudgets, useUpdateBudget } from "@/hooks/use-budgets";
import { useState, useEffect } from "react";
import { Budget } from "@/types/dashboard";
import { DeleteBudgetModal } from "./delete-budget-modal";
import { EditBudgetModal } from "./edit-budget-modal";
import { BulkCreateBudgetModal } from "./bulk-create-budget-modal";
import { toast } from "sonner";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, X, Plus } from "lucide-react";
import { MonthPicker } from "@/components/atoms/month-picker";
import { Button } from "@/components/atoms/button";

export function BudgetManager() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const monthString = date ? format(date, "MM-yyyy") : undefined;

    const { data: budgets, isLoading } = useBudgets(monthString);
    const updateBudget = useUpdateBudget();
    const [localBudgets, setLocalBudgets] = useState<Record<string, string>>({});
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isBulkCreateModalOpen, setIsBulkCreateModalOpen] = useState(false);

    // Initialize local state when budgets are loaded
    useEffect(() => {
        if (budgets) {
            const initialState: Record<string, string> = {};
            budgets.forEach(b => {
                initialState[b.id] = b.amount.toString();
            });
            setLocalBudgets(initialState);
        }
    }, [budgets]);

    const handleAmountChange = (id: string, value: string) => {
        setLocalBudgets(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async (id: string) => {
        const amount = parseFloat(localBudgets[id]);
        if (isNaN(amount)) {
            toast.error("Invalid amount");
            return;
        }

        try {
            await updateBudget.mutateAsync({ id, amount });
            toast.success("Budget updated");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update budget");
        }
    };

    const handleDeleteClick = (id: string) => {
        const budget = budgets?.find(b => b.id === id);
        if (budget) {
            setSelectedBudget(budget);
            setIsDeleteModalOpen(true);
        }
    };

    const handleEditClick = (id: string) => {
        const budget = budgets?.find(b => b.id === id);
        if (budget) {
            setSelectedBudget(budget);
            setIsEditModalOpen(true);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <Button
                    onClick={() => setIsBulkCreateModalOpen(true)}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add All Budgets at Once
                </Button>

                <div className="flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"secondary"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
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
                                onValueChange={(d) => setDate(d)}
                            />
                        </PopoverContent>
                    </Popover>
                    {date && (
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => setDate(undefined)}
                            title="Show All"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <BudgetList
                budgets={budgets}
                isLoading={isLoading}
                localBudgets={localBudgets}
                onAmountChange={handleAmountChange}
                onSave={handleSave}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
                isUpdating={updateBudget.isPending}
            />
            <DeleteBudgetModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                budget={selectedBudget}
            />
            <EditBudgetModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                budget={selectedBudget}
            />
            <BulkCreateBudgetModal
                isOpen={isBulkCreateModalOpen}
                onClose={() => setIsBulkCreateModalOpen(false)}
            />
        </>
    );
}
