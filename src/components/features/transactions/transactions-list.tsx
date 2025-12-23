"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useTransactions } from "@/hooks/use-transactions";
import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { useState } from "react";
import { Transaction } from "@/types/dashboard";
import { EditTransactionModal } from "./edit-transaction-modal";
import { DeleteTransactionModal } from "./delete-transaction-modal";
import { Badge } from "@/components/atoms/badge";

export function TransactionsList() {
    const { data: transactions, isLoading } = useTransactions();
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsEditModalOpen(true);
    };

    const handleDelete = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDeleteModalOpen(true);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 overflow-x-auto pb-4">
                        <div className="min-w-[1000px]">
                            <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground mb-2 px-2 gap-4">
                                <div className="col-span-1">Created</div>
                                <div className="col-span-1">Date</div>
                                <div className="col-span-3">Name</div>
                                <div className="col-span-2">Category</div>
                                <div className="col-span-1">Amount</div>
                                <div className="col-span-1">Type</div>
                                <div className="col-span-2">Expense Group</div>
                                <div className="col-span-1 text-right">Actions</div>
                            </div>
                            <div className="divide-y text-sm">
                                {transactions?.map((transaction) => (
                                    <div key={transaction.id} className="grid grid-cols-12 items-center py-3 px-2 hover:bg-muted/50 rounded-lg transition-colors gap-4">
                                        <div className="col-span-1 text-muted-foreground whitespace-nowrap">
                                            {new Date(transaction?.date).toLocaleDateString()}
                                        </div>
                                        <div className="col-span-1 text-muted-foreground whitespace-nowrap">
                                            {transaction?.created_at ? new Date(transaction.created_at).toLocaleDateString() : '-'}
                                        </div>
                                        <div className="col-span-3 font-medium truncate capitalize" title={transaction?.name}>{transaction?.name}</div>
                                        <div className="col-span-2">
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary whitespace-nowrap capitalize">
                                                {typeof transaction?.category === 'string' ? transaction?.category : transaction?.category?.name}
                                            </span>
                                        </div>
                                        <div className={`col-span-1 font-semibold whitespace-nowrap ${transaction?.type === 'expense' ? 'text-destructive' : 'text-primary'}`}>
                                            {transaction?.type === 'expense' ? '-' : '+'}৳{transaction?.amount.toFixed(2)}
                                        </div>
                                        <div className="col-span-1">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${transaction?.type === 'expense' ? 'bg-destructive/95 text-destructive' : 'bg-primary/10 text-primary'
                                                }`}>
                                                {typeof transaction?.category === 'string' ? transaction?.category : transaction?.category?.type}
                                            </span>
                                        </div>
                                        <div className="col-span-2 capitalize">
                                            <Badge variant="secondary" className="px-2 py-1 rounded-sm">{transaction?.normalized_name}</Badge>
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(transaction)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                                {(!transactions || transactions.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground">No transactions found.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditTransactionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                transaction={selectedTransaction}
            />

            <DeleteTransactionModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                transaction={selectedTransaction}
            />
        </>
    );
}
