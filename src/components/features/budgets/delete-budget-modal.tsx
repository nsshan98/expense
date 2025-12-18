"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { useDeleteBudget } from "@/hooks/use-budgets";
import { Budget } from "@/types/dashboard";
import { toast } from "sonner";

interface DeleteBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    budget: Budget | null;
}

export function DeleteBudgetModal({ isOpen, onClose, budget }: DeleteBudgetModalProps) {
    const deleteBudget = useDeleteBudget();

    const handleDelete = async () => {
        if (!budget) return;

        try {
            await deleteBudget.mutateAsync(budget.id);
            toast.success("Budget deleted successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete budget");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Budget</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the budget for <span className="font-medium text-foreground">{budget?.category?.name}</span>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteBudget.isPending}
                    >
                        {deleteBudget.isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
