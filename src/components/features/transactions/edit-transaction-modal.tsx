"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useUpdateTransaction } from "@/hooks/use-transactions";
import { Transaction } from "@/types/dashboard";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { useCategories } from "@/hooks/use-categories";

interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");
    const updateTransaction = useUpdateTransaction();
    const { data: categories } = useCategories();

    useEffect(() => {
        if (transaction) {
            setName(transaction.name);
            setAmount(transaction.amount.toString());
            // Try to find category ID by name if not present (fallback)
            const catId = transaction.categoryId || categories?.find(c => c.name === transaction.category)?.id || "";
            setCategoryId(catId);
            setDate(transaction.date ? transaction.date.split('T')[0] : "");
            setType(transaction.type);
        }
    }, [transaction, categories]);

    const handleUpdate = async () => {
        if (!transaction) return;
        if (!name || !amount) {
            toast.error("Please enter name and amount");
            return;
        }

        try {
            await updateTransaction.mutateAsync({
                id: transaction.id,
                name,
                amount: parseFloat(amount),
                categoryId: categoryId || undefined,
                date: new Date(date).toISOString(),
                type,
            });
            toast.success("Transaction updated successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update transaction");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Transaction name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select value={type} onValueChange={(val) => setType(val as "income" | "expense")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={handleUpdate}
                        disabled={updateTransaction.isPending}
                    >
                        {updateTransaction.isPending ? "Updating..." : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
