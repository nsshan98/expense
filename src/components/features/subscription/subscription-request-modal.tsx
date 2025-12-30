"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/form";
import { Plan } from "@/types/subscription";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { axiosClient } from "@/lib/axios-client";
import { subscriptionRequestSchema, SubscriptionRequestFormValues } from "@/zod/subscription-schema";
import { useCurrency } from "@/contexts/currency-context";

interface SubscriptionRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: Plan | null;
    initialBillingCycle?: "monthly" | "yearly";
}

export function SubscriptionRequestModal({
    isOpen,
    onClose,
    plan,
    initialBillingCycle = "monthly"
}: SubscriptionRequestModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { symbol } = useCurrency();

    const form = useForm<SubscriptionRequestFormValues>({
        resolver: zodResolver(subscriptionRequestSchema),
        defaultValues: {
            planId: plan?.id || "",
            duration: initialBillingCycle,
            transactionId: "",
            provider: "",
            senderNumber: "",
            note: "",
        },
    });

    // Watch duration to update price display dynamically
    const watchDuration = form.watch("duration");

    useEffect(() => {
        if (isOpen && plan) {
            form.reset({
                planId: plan.id,
                duration: initialBillingCycle,
                transactionId: "",
                provider: "",
                senderNumber: "",
                note: "",
            });
        }
    }, [isOpen, plan, initialBillingCycle, form]);

    if (!plan) return null;

    const price = watchDuration === "monthly" ? plan.price_monthly : plan.price_yearly;
    const priceDisplay = price ? `${symbol}${price}${watchDuration === "yearly" ? "/year" : "/mo"}` : "Free";

    const onSubmit = async (data: SubscriptionRequestFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await axiosClient.post('/billing-local/requests', data);

            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Failed to submit subscription request");
            }

            toast.success("Subscription request submitted successfully!");
            onClose();
        } catch (error: unknown) {
            console.error("Subscription Error:", error);
            let message = "Something went wrong";
            if (error instanceof Error) message = error.message;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const axiosError = error as any;
            if (axiosError.response?.data?.message) {
                message = axiosError.response.data.message;
            }
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Subscribe to {plan.name}</DialogTitle>
                    <DialogDescription>
                        Complete your payment to activate the subscription.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">

                        {/* Plan Summary (Read Only) */}
                        <div className="bg-muted p-4 rounded-lg flex justify-between items-center mb-6">
                            <div>
                                <p className="font-semibold text-sm">Plan</p>
                                <p className="text-lg font-bold">{plan.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-sm">Price</p>
                                <p className="text-lg font-bold text-primary">{priceDisplay}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select duration" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="yearly">Yearly (Save 20%)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="provider"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Provider <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select provider" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="bkash">bKash</SelectItem>
                                                <SelectItem value="nagad">Nagad</SelectItem>
                                                <SelectItem value="rocket">Rocket</SelectItem>
                                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="transactionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transaction ID <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. TXN_12345678" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="senderNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sender Number (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="017..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Note (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any additional details..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Request"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
