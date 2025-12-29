import { Calendar, TrendingUp, Package } from "lucide-react";
import { Card, CardContent } from "@/components/atoms/card";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: "calendar" | "trending" | "package";
}

export function EmptyState({
    title = "No Data Available",
    description = "There are no transactions for the selected period. Try selecting a different date range or add some transactions.",
    icon = "package"
}: EmptyStateProps) {
    const IconComponent = {
        calendar: Calendar,
        trending: TrendingUp,
        package: Package,
    }[icon];

    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
