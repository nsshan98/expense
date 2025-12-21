"use client";

import { Card, CardContent } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Award, Loader2, Clock, AlertTriangle } from "lucide-react";
import { useSubscriptionStatus } from "@/hooks/use-subscription";
import { format } from "date-fns";

export function CurrentPlan() {
    const { data: status, isLoading } = useSubscriptionStatus();

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardContent className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    // Default to displaying "Free" if no active plan
    const activePlan = status?.activePlan;
    const pendingRequest = status?.pendingRequest;

    if (!activePlan && !pendingRequest) {
        return (
            <Card className="w-full bg-linear-to-r from-background to-muted/20">
                <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">
                                Current Plan: <span className="text-muted-foreground">Free</span>
                            </h3>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">
                                Active
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            You are currently on the free plan with limited features.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Active Plan Card */}
            {activePlan && (
                <Card className="w-full bg-linear-to-r from-background to-emerald-50/50 border-emerald-100/50">
                    <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold">
                                    Current Plan: <span className="text-primary">{activePlan.name}</span>
                                </h3>
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
                                    Active
                                </Badge>
                            </div>
                            {status.expiryDate && (
                                <p className="text-sm text-muted-foreground max-w-2xl">
                                    Your plan renews automatically on <span className="font-medium text-foreground">{format(new Date(status.expiryDate), "MMMM d, yyyy")}</span>.
                                    You have full access to all premium features.
                                </p>
                            )}
                            {/* <div className="pt-2">
                                <Button variant="outline" className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10">
                                    Cancel Subscription
                                </Button>
                            </div> */}
                        </div>

                        <div className="hidden md:flex items-center justify-center p-4 bg-primary/10 rounded-full h-16 w-16">
                            <Award className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pending Request Alert */}
            {pendingRequest && (
                <Card className="w-full border-amber-200 bg-amber-50/50">
                    <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-amber-100 rounded-full">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-amber-900">Pending Request</h4>
                                <p className="text-sm text-amber-700">
                                    Your request for <span className="font-medium">{pendingRequest.plan.name} ({pendingRequest.duration})</span> is under review.
                                    <br />
                                    <span className="text-xs opacity-80">Transaction ID: {pendingRequest.transactionId}</span>
                                </p>
                            </div>
                        </div>
                        <Badge className="bg-amber-200 text-amber-800 hover:bg-amber-200 border-0 whitespace-nowrap">
                            Awaiting Approval
                        </Badge>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
