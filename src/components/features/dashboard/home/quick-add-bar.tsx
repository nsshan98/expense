"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useCreateTransaction } from "@/hooks/use-api";
import { useState } from "react";
import { toast } from "sonner";

export function QuickAddBar() {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const createTransaction = useCreateTransaction();

    const handleAddExpense = async () => {
        if (!name || !amount) {
            toast.error("Please enter name and amount");
            return;
        }

        try {
            await createTransaction.mutateAsync({
                name,
                amount: parseFloat(amount),
                category: "Uncategorized", // Default for quick add
                date: new Date().toISOString(),
                type: 'expense'
            });
            toast.success("Expense added successfully");
            setName("");
            setAmount("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add expense");
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl border shadow-sm">
            <Input
                placeholder="Expense name (e.g., Coffee)"
                className="flex-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Input
                placeholder="Amount"
                type="number"
                className="w-full md:w-[200px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <Button
                className="bg-emerald-400 hover:bg-emerald-500 text-white font-medium"
                onClick={handleAddExpense}
                disabled={createTransaction.isPending}
            >
                {createTransaction.isPending ? "Adding..." : "Add Expense"}
            </Button>
        </div>
    );
}
