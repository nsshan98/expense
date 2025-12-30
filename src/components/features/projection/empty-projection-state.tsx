"use client";

import { Card, CardContent } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import {
    TrendingDown,
    FileQuestion,
    RefreshCw,
    Calendar
} from "lucide-react";

interface EmptyProjectionStateProps {
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export function EmptyProjectionState({ onRefresh, isRefreshing = false }: EmptyProjectionStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full">
                <CardContent className="pt-6 pb-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Icon */}
                        <div className="relative">
                            <div className="p-4 rounded-full bg-muted">
                                <FileQuestion className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-background border-2 border-background">
                                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">No Projection Data Available</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                We couldn't find any projection data for the current month. This could be because:
                            </p>
                        </div>

                        {/* Reasons List */}
                        <div className="w-full bg-muted/50 rounded-lg p-4 space-y-2 text-left">
                            <div className="flex items-start gap-2 text-sm">
                                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">You haven't set up any budgets for this month</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">There are no transactions recorded yet</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">The projection calculation is still processing</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={onRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                            </Button>
                            <Button
                                variant="default"
                                className="flex-1"
                                onClick={() => window.location.href = '/budgets'}
                            >
                                <Calendar className="h-4 w-4 mr-2" />
                                Set Up Budgets
                            </Button>
                        </div>

                        {/* Help Text */}
                        <p className="text-xs text-muted-foreground pt-2">
                            Projections are calculated based on your current spending patterns and budget allocations.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
