"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { useDeleteTransaction } from "@/hooks/use-transactions";
import { Transaction } from "@/types/dashboard";
import { toast } from "sonner";

interface DeleteTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

export function DeleteTransactionModal({ isOpen, onClose, transaction }: DeleteTransactionModalProps) {
    const deleteTransaction = useDeleteTransaction();

    const handleDelete = async () => {
        if (!transaction) return;

        try {
            await deleteTransaction.mutateAsync(transaction.id);
            toast.success("Transaction deleted successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete transaction");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Transaction</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this transaction? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteTransaction.isPending}
                    >
                        {deleteTransaction.isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
