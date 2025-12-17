export interface Transaction {
    id: string;
    date: string;
    created_at?: string;
    name: string;
    category: string;
    categoryId?: string;
    amount: number;
    type: 'income' | 'expense';
}

export interface Budget {
    id: string;
    category: string;
    categoryId?: string;
    amount: number;
    spent: number;
    remaining: number;
    percentage: number;
}

export interface Category {
    id: string;
    name: string;
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
    id: string;
    type: "warning" | "success" | "info";
    title: string;
    message: string;
}

export interface CreateExpensePayload {
    name: string;
    amount: number;
    category?: string;
    date?: string;
}
