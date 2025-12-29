import { Badge } from "@/components/atoms/badge";
import { Card, CardContent } from "@/components/atoms/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface MomCardProps {
    title: string;
    dateRange: string;
    currentTotal: number;
    previousTotal: number;
    percentageChange: number;
    periodPreviousLabel: string;
}

// Helper function to format date range like "Dec 1 - Dec 29"
function formatDateRange(dateRangeStr: string): string {
    try {
        // Handle "Last 30 Days" or similar text
        if (dateRangeStr.toLowerCase().includes('last') && dateRangeStr.toLowerCase().includes('days')) {
            const today = new Date();
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);

            const formatDate = (date: Date) => {
                const month = date.toLocaleDateString('en-US', { month: 'short' });
                const day = date.getDate();
                return `${month} ${day}`;
            };

            return `${formatDate(thirtyDaysAgo)} - ${formatDate(today)}`;
        }

        // Handle actual date ranges like "12/1/2025 - 12/29/2025"
        const parts = dateRangeStr.split(' - ');
        if (parts.length !== 2) return dateRangeStr;

        const formatDate = (dateStr: string) => {
            const date = new Date(dateStr.trim());
            if (isNaN(date.getTime())) return dateStr;

            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const day = date.getDate();
            return `${month} ${day}`;
        };

        return `${formatDate(parts[0])} - ${formatDate(parts[1])}`;
    } catch (error) {
        return dateRangeStr;
    }
}

export function MomCard({
    title,
    dateRange,
    currentTotal,
    previousTotal,
    percentageChange,
    periodPreviousLabel,
}: MomCardProps) {
    const isPositive = percentageChange > 0;
    const isZero = percentageChange === 0;
    const formattedDateRange = formatDateRange(dateRange);

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            {title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{formattedDateRange}</p>
                    </div>
                    {!isZero && (
                        <Badge
                            variant={isPositive ? "destructive" : "secondary"}
                            className={cn(
                                "flex items-center gap-1 font-medium",
                                isPositive
                                    ? "bg-red-100 text-red-700 hover:bg-red-100"
                                    : "bg-green-100 text-green-700 hover:bg-green-100"
                            )}
                        >
                            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {isPositive ? "+" : ""}
                            {percentageChange.toFixed(1)}%
                        </Badge>
                    )}
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">
                        ৳{currentTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">Current Total</span>
                </div>

                <div className="flex justify-between items-center text-sm pt-4 border-t border-dashed">
                    <span className="text-muted-foreground">{periodPreviousLabel}</span>
                    <span className="font-semibold">
                        ৳{previousTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
