import { TransactionsList } from "@/components/features/transactions/transactions-list";
import { QuickAddBar } from "@/components/features/dashboard/home/quick-add-bar";
import { getCurrentUser } from "@/services/user";
import { redirect } from "next/navigation";

export default async function TransactionsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth/login");
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                <p className="text-muted-foreground">
                    View and manage all your transactions
                </p>
            </div>

            <QuickAddBar hasApiKey={user.hasGeminiKey} />

            <TransactionsList />
        </div>
    );
}
