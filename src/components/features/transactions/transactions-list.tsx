"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useTransactions } from "@/hooks/use-api";
import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

export function TransactionsList() {
    const { data: transactions, isLoading } = useTransactions();

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
        <Card>
            <CardHeader>
                <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground mb-2 px-2">
                        <div className="col-span-3">Date</div>
                        <div className="col-span-3">Name</div>
                        <div className="col-span-2">Category</div>
                        <div className="col-span-2">Amount</div>
                        <div className="col-span-1">Type</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                        {transactions?.map((transaction) => (
                            <div key={transaction.id} className="grid grid-cols-12 items-center py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="col-span-3 text-sm text-muted-foreground">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </div>
                                <div className="col-span-3 font-medium">{transaction.name}</div>
                                <div className="col-span-2">
                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                        {transaction.category}
                                    </span>
                                </div>
                                <div className={`col-span-2 font-semibold ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                                    {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                                </div>
                                <div className="col-span-1">
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${transaction.type === 'expense' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                                        }`}>
                                        {transaction.type}
                                    </span>
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
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
            </CardContent>
        </Card>
    );
}
