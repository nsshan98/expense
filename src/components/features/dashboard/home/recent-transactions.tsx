"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useTransactions } from "@/hooks/use-api";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";

export function RecentTransactions() {
    const { data: transactions, isLoading } = useTransactions();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground mb-2 px-2">
                        <div>Date</div>
                        <div>Name</div>
                        <div>Category</div>
                        <div>Amount</div>
                    </div>
                    <div className="divide-y">
                        {transactions?.slice(0, 5).map((transaction) => (
                            <div key={transaction.id} className="grid grid-cols-4 items-center py-3 px-2 hover:bg-muted/50 rounded-lg transition-colors">
                                <div className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</div>
                                <div className="font-medium">{transaction.name}</div>
                                <div className="text-sm text-muted-foreground">{transaction.category}</div>
                                <div className="flex items-center justify-between">
                                    <span className={transaction.type === 'expense' ? "text-red-500" : "text-green-500"}>
                                        {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {(!transactions || transactions.length === 0) && (
                            <div className="text-center py-4 text-muted-foreground">No transactions found.</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
