"use client";

import * as React from "react";
import { Lightbulb, TrendingUp, AlertCircle, Info } from "lucide-react";
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

    if (insights.length === 0) {
        return (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        Smart Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-sm text-muted-foreground py-4">
                        No insights available at the moment.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Smart Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
                {insights.map((insight, index) => {
                    let colorClass = "bg-primary/10 border-primary/20 text-primary";
                    let Icon = Info;
                    let title = "Insight";

                    if (insight.type === "warning") {
                        colorClass = "bg-destructive/10 border-destructive/20 text-destructive";
                        Icon = AlertCircle;
                        title = "Warning";
                    } else if (insight.type === "success" || insight.type === "positive") {
                        colorClass = "bg-green-500/10 border-green-500/20 text-green-600";
                        Icon = TrendingUp;
                        title = "Good News";
                    } else if (insight.type === "highlight") {
                        colorClass = "bg-primary/10 border-primary/20 text-primary";
                        title = "Highlight";
                    }

                    if (insight.category?.name) {
                        title = `${title}: ${insight.category.name}`;
                    }

                    return (
                        <div key={index} className={`p-4 rounded-lg border space-y-2 ${colorClass}`}>
                            <div className="flex items-center gap-2 font-medium text-sm">
                                <Icon className="w-4 h-4" />
                                <span className="capitalize">{title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {insight.text}
                            </p>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
