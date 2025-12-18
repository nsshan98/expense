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
    is_active: boolean; // Note: API returns is_active, not isActive
}
