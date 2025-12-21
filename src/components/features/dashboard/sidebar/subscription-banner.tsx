"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Crown, Sparkles } from "lucide-react";
import { usePlans } from "@/hooks/use-plans";
import { SubscriptionRequestModal } from "@/components/features/subscription/subscription-request-modal";

export function SubscriptionBanner() {
    const { data: plans, isLoading } = usePlans();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const activePlan = plans?.find(p => p.is_active);
    console.log(activePlan);

    // Find the best upgrade option by comparing yearly prices (usually the most reliable metric for hierarchy)
    const sortedPlans = [...(plans || [])].sort((a, b) => (b.price_yearly || 0) - (a.price_yearly || 0));

    // The target plan is the most expensive one
    const premiumPlan = sortedPlans[0];

    // Don't show if loading or no suitable plan found
    if (isLoading || !premiumPlan) {
        return null;
    }

    return (
        <>
            <div className="px-2 pb-2">
                <Card className="bg-linear-to-br from-indigo-500 to-purple-600 border-none text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Crown size={60} />
                    </div>
                    <CardContent className="p-4 flex flex-col gap-3 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <Sparkles size={16} className="text-yellow-300" />
                            </div>
                            <span className="font-bold text-sm">Upgrade to {premiumPlan.name}</span>
                        </div>

                        <p className="text-xs text-white/90">
                            Unlock unlimited transactions, advanced analytics and more!
                        </p>

                        <Button
                            size="sm"
                            variant="secondary"
                            className="w-full text-indigo-700 font-bold hover:bg-white/90"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Get Started
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <SubscriptionRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                plan={premiumPlan}
                initialBillingCycle="yearly"
            />
        </>
    );
}
