import { Card, CardContent } from "@/components/atoms/card";
// Removed unused formatCurrency import
import { Armchair, Briefcase, Lightbulb } from "lucide-react";
import { WeekdayWeekendAnalysis } from "@/types/analytics";

interface WeekendAnalysisProps {
    data: WeekdayWeekendAnalysis;
}

export function WeekendAnalysis({ data }: WeekendAnalysisProps) {
    const { weekday_avg, weekend_avg, formatted_message } = data;

    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Weekday Average */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Weekday Average</span>
                        </div>
                        <div className="mb-1">
                            <span className="text-3xl font-bold">
                                ৳{weekday_avg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">Mon - Fri</span>
                    </div>

                    {/* Weekend Average */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <Armchair className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Weekend Average</span>
                        </div>
                        <div className="mb-1">
                            <span className="text-3xl font-bold">
                                ৳{weekend_avg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">Sat - Sun</span>
                    </div>

                    {/* Insight */}
                    <div className="rounded-xl p-4 flex gap-3 text-sm">
                        <Lightbulb className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold mb-1">Spending Insight</h4>
                            <p className="text-muted-foreground leading-relaxed">
                                {formatted_message}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
