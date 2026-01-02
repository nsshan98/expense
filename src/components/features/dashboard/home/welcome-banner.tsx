"use client";

import { Card, CardContent } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { useBudgets } from "@/hooks/use-budgets";
import { Wallet } from "lucide-react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/atoms/dialog";
import { BudgetSetupForm } from "@/components/features/setup/budget-setup-form";
import { useState } from "react";

export function WelcomeBanner() {
    const currentMonth = format(new Date(), 'MM-yyyy');
    const currentMonthName = format(new Date(), 'MMMM');
    // Fetch budgets specifically for the current month
    const { data: budgets, isLoading } = useBudgets(currentMonth);
    const [open, setOpen] = useState(false);

    // Don't show if loading or budgets exist for this month
    if (isLoading || (budgets && budgets.length > 0)) {
        return null;
    }

    return (
        <Card className="border-l-4 border-l-primary bg-sidebar-accent/10 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                <div className="space-y-1">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        No budget set for {currentMonthName}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-xl">
                        Start your month right by setting up a budget. It helps you track expenses effectively and reach your financial goals.
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="shrink-0 font-medium">
                            Create {currentMonthName} Budget
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Set {currentMonthName} Budget</DialogTitle>
                            <DialogDescription>
                                Allocate your funds for this month to track expenses effectively.
                            </DialogDescription>
                        </DialogHeader>
                        <BudgetSetupForm
                            isDialog
                            onSuccess={() => setOpen(false)}
                            onCancel={() => setOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
