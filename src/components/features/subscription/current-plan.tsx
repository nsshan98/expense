import { Card, CardContent } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Award } from "lucide-react";

export function CurrentPlan() {
    return (
        <Card className="w-full bg-linear-to-r from-background to-muted/20">
            <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                            Current Plan: <span className="text-primary">Premium - Yearly</span>
                        </h3>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700 border-0">
                            Active
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Your plan renews automatically on <span className="font-medium text-foreground">October 24, 2024</span>.
                        You have full access to all premium features including AI insights and unlimited wallets.
                    </p>
                    <div className="pt-2">
                        <Button variant="outline" className="h-9">
                            Cancel Subscription
                        </Button>
                    </div>
                </div>

                <div className="hidden md:flex items-center justify-center p-4 bg-primary/10 rounded-full h-16 w-16">
                    <Award className="h-8 w-8 text-primary" />
                </div>
            </CardContent>
        </Card>
    );
}
