import { CurrentPlan } from "@/components/features/subscription/current-plan";
import { AvailablePlans } from "@/components/features/subscription/available-plans";
import { SubscriptionHistory } from "@/components/features/subscription/subscription-history";

export default function SubscriptionPage() {
    return (
        <div className="flex flex-col gap-8 p-6 max-w-5xl mx-auto w-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Subscription</h1>
                <p className="text-muted-foreground">
                    View your current plan and billing details
                </p>
            </div>

            <CurrentPlan />

            <div className="py-2">
                <AvailablePlans />
            </div>

            <SubscriptionHistory />
        </div>
    );
}
