import { TransactionsList } from "@/components/features/transactions/transactions-list";
import { QuickAddBar } from "@/components/features/dashboard/home/quick-add-bar";

export default function TransactionsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                <p className="text-muted-foreground">
                    View and manage all your transactions
                </p>
            </div>

            <QuickAddBar />

            <TransactionsList />
        </div>
    );
}
