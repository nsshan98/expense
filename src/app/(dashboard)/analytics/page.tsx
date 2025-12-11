import { AnalyticsContent } from "@/components/features/analytics/analytics-content";

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            </div>

            <AnalyticsContent />
        </div>
    );
}
