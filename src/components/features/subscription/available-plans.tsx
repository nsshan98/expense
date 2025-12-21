"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Check, CircleCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlans } from "@/hooks/use-plans";
import { Plan } from "@/types/subscription";
import { SubscriptionRequestModal } from "./subscription-request-modal";

const formatFeature = (key: string, value: string | number | boolean) => {
    const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    // Handle boolean values
    if (typeof value === 'boolean') {
        return value ? formattedKey : `No ${formattedKey}`;
    }
    // Handle numeric/string values
    return `${formattedKey}: ${value}`;
};

export function AvailablePlans() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: plans, isLoading, error } = usePlans();

    const handleUpgrade = (plan: Plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500">
                Failed to load subscription plans.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Available Plans</h2>
            </div>

            <div className="flex justify-center mb-8">
                <div className="bg-muted p-1 rounded-full flex items-center">
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={cn(
                            "px-6 py-1.5 rounded-full text-sm font-medium transition-all",
                            billingCycle === "monthly"
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle("yearly")}
                        className={cn(
                            "px-6 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                            billingCycle === "yearly"
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Yearly
                        <span className="text-xs text-primary font-normal">(Save 20%)</span>
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {plans?.map((plan) => (
                    <Card
                        key={plan.id}
                        className={cn(
                            "relative transition-all duration-200",
                            plan.is_active ? "border-primary shadow-md" : "hover:border-primary/50"
                        )}
                    >
                        {plan.is_active && (
                            <div className="absolute -top-3 right-8 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                                Current Plan
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold">
                                    ${billingCycle === "monthly"
                                        ? (plan.price_monthly ?? 0)
                                        : (plan.price_yearly ? Math.round(plan.price_yearly / 12) : 0)}
                                </span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant={plan.is_active ? "default" : "outline"}
                                className={cn(
                                    "w-full mb-8",
                                    plan.is_active && "bg-sky-400 hover:bg-sky-500 text-white"
                                )}
                                disabled={!plan.is_active && plan.price_monthly === null}
                                onClick={() => !plan.is_active && plan.price_monthly !== null && handleUpgrade(plan)}
                            >
                                {plan.is_active ? (
                                    <>
                                        <CircleCheck className="w-4 h-4 mr-2" />
                                        Active
                                    </>
                                ) : (
                                    plan.price_monthly === null ? "Downgrade" : "Upgrade"
                                )}
                            </Button>

                            <ul className="space-y-3">
                                {Object.entries(plan.features).map(([key, value]) => (
                                    <li key={key} className="flex items-center gap-3 text-sm">
                                        <Check className="h-4 w-4 text-emerald-500" />
                                        <span className="text-muted-foreground">
                                            {formatFeature(key, value)}
                                        </span>
                                    </li>
                                ))}
                                {!plan.features['transactions'] && plan.name === 'Free' && (
                                    <li className="flex items-center gap-3 text-sm">
                                        <Check className="h-4 w-4 text-emerald-500" />
                                        <span className="text-muted-foreground">Up to 50 transactions/mo</span>
                                    </li>
                                )}
                                {!plan.features['transactions'] && plan.name === 'Premium' && (
                                    <li className="flex items-center gap-3 text-sm">
                                        <Check className="h-4 w-4 text-emerald-500" />
                                        <span className="text-muted-foreground">Unlimited transactions</span>
                                    </li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <SubscriptionRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                plan={selectedPlan}
                initialBillingCycle={billingCycle}
            />
        </div>
    );
}
