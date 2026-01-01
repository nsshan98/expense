"use client";

import { QuickAddBar } from "@/components/features/dashboard/home/quick-add-bar";
import { SummaryCards } from "@/components/features/dashboard/home/summary-cards";
import { SpendingTrendChart } from "@/components/features/dashboard/home/spending-trend-chart";
import { CategoryBudgetList } from "@/components/features/dashboard/home/category-budget-list";
import { InsightsPanel } from "@/components/features/dashboard/home/insights-panel";
import { RecentTransactions } from "@/components/features/dashboard/home/recent-transactions";
import { WelcomeBanner } from "@/components/features/dashboard/home/welcome-banner";

interface DashboardContentProps {
    hasApiKey?: boolean;
}

export function DashboardContent({ hasApiKey }: DashboardContentProps) {
    return (
        <>
            <WelcomeBanner />

            <QuickAddBar hasApiKey={hasApiKey} />

            <SummaryCards />

            <div className="grid gap-6 md:grid-cols-2">
                <SpendingTrendChart />
                <CategoryBudgetList />
            </div>

            <InsightsPanel />

            <RecentTransactions />
        </>
    );
}
