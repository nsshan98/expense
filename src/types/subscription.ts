export interface PlanFeature {
    [key: string]: number | string | boolean;
}

export interface Plan {
    id: string;
    name: string;
    description?: string;
    features: PlanFeature;
    max_budgets?: number;
    price_monthly: number | null;
    price_yearly: number | null;
    is_active: boolean;
}

export interface SubscriptionRequest {
    id: string;
    plan: Plan;
    duration: 'monthly' | 'yearly';
    transactionId: string;
    provider: string;
    senderNumber?: string;
    note?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export interface SubscriptionStatus {
    activePlan: Plan | null;
    expiryDate: string | null;
    status: 'active' | 'expired' | 'free';
    pendingRequest: SubscriptionRequest | null;
}

export interface SubmissionHistoryItem {
    id: string;
    transaction_id: string;
    provider: string;
    status: 'submitted' | 'verified' | 'rejected';
    verification_notes: string | null;
    created_at: string;
}

export interface TransactionHistoryItem {
    id: string;
    status: 'pending_verification' | 'completed' | 'failed' | 'rejected' | 'pending';
    amount: number;
    duration: number; // days? or maybe monthly/yearly enum? API shows number (30)
    created_at: string;
    plan_name: string;
    submissions: SubmissionHistoryItem[];
    invoice_url?: string | null;
    currency?: string; // Missing in API response provided, optional
}

export interface TransactionHistoryResponse {
    data: TransactionHistoryItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
