"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/atoms/dialog";
import { BudgetBulkCreateForm } from "./budget-bulk-create-form";

interface BulkCreateBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BulkCreateBudgetModal({
    isOpen,
    onClose,
}: BulkCreateBudgetModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-7xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Bulk Add Budgets</DialogTitle>
                </DialogHeader>
                <BudgetBulkCreateForm />
            </DialogContent>
        </Dialog>
    );
}
