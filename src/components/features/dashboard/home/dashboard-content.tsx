"use client";

import { QuickAddBar } from "@/components/features/dashboard/home/quick-add-bar";
import { SummaryCards } from "@/components/features/dashboard/home/summary-cards";
import { SpendingTrendChart } from "@/components/features/dashboard/home/spending-trend-chart";
import { CategoryBudgetList } from "@/components/features/dashboard/home/category-budget-list";
import { InsightsPanel } from "@/components/features/dashboard/home/insights-panel";
import { RecentTransactions } from "@/components/features/dashboard/home/recent-transactions";
import { MergeSuggestionBanner } from "@/components/features/dashboard/merge/merge-suggestion-banner";
import { WelcomeBanner } from "@/components/features/dashboard/home/welcome-banner";

export function DashboardContent() {
    return (
        <>
            <WelcomeBanner />

            <QuickAddBar />

            <MergeSuggestionBanner />

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
