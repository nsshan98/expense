"use client";

import * as React from "react";
import { Lightbulb, TrendingDown, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useInsights } from "@/hooks/use-dashboard";
import { Skeleton } from "@/components/atoms/skeleton";

export function InsightsPanel() {
    const { insightsQuery } = useInsights();
    const { data: insights, isLoading } = insightsQuery;

    if (isLoading) {
        return (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        Smart Insights
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (!insights) return null;

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Smart Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
                {insights.map((insight) => {
                    let colorClass = "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400";
                    let Icon = Info;

                    if (insight.type === "warning") {
                        colorClass = "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
                        Icon = AlertCircle;
                    } else if (insight.type === "success") {
                        colorClass = "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
                        Icon = TrendingDown;
                    }

                    return (
                        <div key={insight.id} className={`p-4 rounded-lg border space-y-2 ${colorClass}`}>
                            <div className="flex items-center gap-2 font-medium text-sm">
                                <Icon className="w-4 h-4" />
                                {insight.title}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {insight.message}
                            </p>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
