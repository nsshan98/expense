export interface Transaction {
    id: string;
    date: string;
    created_at?: string;
    name: string;
    category: Category | string;
    categoryId?: string;
    amount: number;
    type: 'income' | 'expense';
    normalized_name: string;
}

export interface PaginatedTransactionsResponse {
    data: Transaction[];
    meta: {
        hasNextPage: boolean;
        nextOffset: number | null;
    };
}

export interface Budget {
    id: string;
    category: Category;
    categoryId?: string;
    amount: number;
    spent_this_month: number;
    remaining: number;
    over?: number;
    percentage: number;
    month?: string;
}

export interface Category {
    id: string;
    name: string;
    type: "EXPENSE" | "INCOME";
    color?: string;
}

export interface DashboardSummary {
    todaySpend: number;
    thisMonthSpend: number;
    thisMonthTrend: number; // percentage
    remainingBudget: number;
    remainingPercentage: number;
}

export interface SpendingTrend {
    date: string;
    amount: number;
    predicted?: number;
}

export interface MergeSuggestion {
    id: string;
    originalName: string;
    suggestedName: string;
    count: number;
    potentialSavings?: number; // Just in case
    similarTransactions: Transaction[];
}

export interface AnalyticsData {
    spendingOverTime: SpendingTrend[];
    spendingByCategory: { category: string; amount: number; percentage: number; color?: string }[];
}

// Restoring old types for compatibility with existing components
export interface ExpenseSummary {
    todaySpend: number;
    todayTrend: number;
    thisMonthSpend: number;
    thisMonthTrend: number;
    remainingBudget: number;
    remainingPercentage: number;
}

export interface BudgetCategory {
    id: string;
    name: string;
    budget: number;
    spent: number;
}

export interface Insight {
    type: "warning" | "success" | "info" | "positive" | "highlight";
    text: string;
    category?: {
        name: string;
    };
    priorityScore: number;
    // Legacy fields for backward compatibility if needed, though we should update components
    id?: string;
    title?: string;
    message?: string;
}

export interface CreateExpensePayload {
    name: string;
    amount: number;
    category?: string;
    date?: string;
}
export interface TrendAnalysis {
    chart_data: Array<{
        date: string;
        fullDate: string;
        amount: number;
    }>;
    trending_categories: Array<{
        name: string;
        percentage: number;
        amount: number;
    }>;
}

export interface FinancialSnapshot {
    total_spend: number;
    savings: number;
    net_cash_flow: number;
}

export interface TopSpendCategory {
    name: string;
    amount: number;
    percentage: number;
}

export interface BudgetStatus {
    // Define properties as needed according to empty array in example
    // Or if it matches existing Budget interface
    id?: string;
    name?: string;
    budget?: number;
    spent?: number;
}

export interface Forecast {
    message: string;
    status: string;
    amount: number;
}

export interface SmartInsight {
    type: "warning" | "success" | "info" | "positive" | "highlight";
    text: string;
    category?: {
        name: string;
    };
    priorityScore: number;
}

export interface FastStats {
    todays_spend: number;
    this_month_spend: number;
    trend_percentage: number;
    total_remaining_budget: number;
    remaining_percentage: number;
}

export interface DashboardResponse {
    fast_stats: FastStats;
    trend_analysis: TrendAnalysis;
    financial_snapshot: FinancialSnapshot;
    top_spend_categories: TopSpendCategory[];
    budget_status: Budget[]; // Reusing Budget interface if compatible, otherwise define new
    forecast: Forecast;
    smart_insight: SmartInsight | SmartInsight[];
    smart_insights?: SmartInsight[]; // Handle potential plural naming
}
