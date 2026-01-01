"use client";

import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/atoms/table";
import { usePlans } from "@/hooks/use-plans";
import { Plan } from "@/types/subscription";

const formatFeature = (key: string, value: string | number | boolean) => {
    // Skip internal or non-displayable keys if any
    const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    if (typeof value === 'boolean') {
        return value ? formattedKey : null;
    }
    return `${formattedKey}: ${value}`;
};

export default function PricingPageContainer() {
    const [isAnnual, setIsAnnual] = useState(false);
    const { data: plans, isLoading, error } = usePlans();

    // Sort plans by specific order: Free -> Premium -> Custom
    const order = ["Free", "Premium", "Custom"];
    const sortedPlans = plans?.sort((a, b) => {
        const indexA = order.indexOf(a.name);
        const indexB = order.indexOf(b.name);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return (a.price_monthly || 0) - (b.price_monthly || 0);
    });

    return (
        <section id="pricing" className="min-h-screen py-24 px-6 md:px-12 relative overflow-hidden bg-white dark:bg-slate-950">

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary font-semibold tracking-wide uppercase text-sm bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block">
                        Pricing
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        Flexible Plans for Every Need
                    </h2>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center mt-8">
                        <div className="bg-slate-200 dark:bg-slate-900/50 p-1 rounded-full flex gap-1 items-center border border-slate-200 dark:border-slate-800 relative">
                            <Button
                                onClick={() => setIsAnnual(false)}
                                variant={isAnnual ? "outline" : "default"}
                                className="rounded-full"
                            >
                                Monthly billing
                            </Button>
                            <Button
                                onClick={() => setIsAnnual(true)}
                                variant={isAnnual ? "default" : "outline"}
                                className="rounded-full"
                            >
                                Annual billing
                                <span className="ml-1 text-xs font-bold hidden sm:inline-block">(-20%)</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                )}

                {error && (
                    <div className="text-center py-20 text-red-500">
                        Failed to load pricing plans. Please try again later.
                    </div>
                )}

                {!isLoading && !error && sortedPlans && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {sortedPlans.map((plan, index) => {
                            // Heuristic to highlight the "Pro" or middle plan
                            const isHighlight = plan.name === "Premium" || index === 1;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col ${isHighlight
                                        ? "bg-slate-900 dark:bg-slate-900 text-white shadow-2xl shadow-primary/20 scale-105 border border-primary/50 ring-1 ring-primary/50 z-10"
                                        : "bg-white dark:bg-slate-900/40 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-primary/30"
                                        }`}
                                >
                                    {isHighlight && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-primary to-primary/80 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h3 className={`text-xl font-bold mb-2 ${isHighlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                            {plan.name}
                                        </h3>
                                        <p className={`text-sm ${isHighlight ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                                            {plan.description || "The perfect plan for you."}
                                        </p>
                                    </div>

                                    <div className="mb-8">
                                        <span className={`text-4xl font-bold ${isHighlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                            ${isAnnual
                                                ? (plan.price_yearly ? Math.round(plan.price_yearly / 12) : 0)
                                                : (plan.price_monthly ?? 0)}
                                        </span>
                                        <span className={`text-sm ${isHighlight ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
                                            /mth
                                            {isAnnual && <span className="block text-xs opacity-70 font-normal">billed annually</span>}
                                        </span>
                                    </div>

                                    <Button
                                        href="/auth/sign-up"
                                        className={`w-full py-6 rounded-xl font-semibold mb-8 transition-all ${isHighlight
                                            ? 'bg-primary hover:bg-primary/90 text-white border-none'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        Choose {plan.name}
                                    </Button>

                                    <ul className="space-y-4 flex-1">
                                        {Object.entries(plan.features).map(([key, value]) => {
                                            const formatted = formatFeature(key, value);
                                            if (!formatted) return null;

                                            return (
                                                <li key={key} className="flex items-start gap-3">
                                                    <div className={`mt-0.5 p-0.5 rounded-full ${isHighlight ? 'bg-primary/20 text-primary-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                    <span className={`text-sm ${isHighlight ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>
                                                        {formatted}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                        {/* Fallback for Free/Premium specific hardcoded features if needed, or rely on API */}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* Feature Comparison Section */}
                {!isLoading && !error && sortedPlans && sortedPlans.length > 0 && (
                    <div className="max-w-7xl mx-auto mt-32 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                Comparison table
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Detailed breakdown of what's included in each plan
                            </p>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
                                    <TableHead className="py-6 px-6 text-lg font-semibold text-slate-900 dark:text-white min-w-[200px]">
                                        Features
                                    </TableHead>
                                    {sortedPlans.map((plan) => (
                                        <TableHead key={plan.id} className="py-6 px-6 text-center text-lg font-semibold text-slate-900 dark:text-white min-w-[150px]">
                                            {plan.name}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Extract all unique feature keys from the plans */}
                                {Array.from(new Set(sortedPlans.flatMap(p => Object.keys(p.features)))).map((featureKey) => {
                                    const formattedLabel = featureKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                                    return (
                                        <TableRow key={featureKey} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-slate-100 dark:border-slate-800">
                                            <TableCell className="py-6 px-6 text-slate-600 dark:text-slate-300 font-medium">
                                                {formattedLabel}
                                            </TableCell>
                                            {sortedPlans.map((plan) => {
                                                const value = plan.features[featureKey];

                                                return (
                                                    <TableCell key={`${plan.id}-${featureKey}`} className="py-4 px-6 text-center">
                                                        <div className="flex justify-center">
                                                            {typeof value === 'boolean' ? (
                                                                value ? (
                                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                                                        <Check size={16} strokeWidth={3} />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center">
                                                                        <span className="text-sm font-bold">✕</span>
                                                                    </div>
                                                                )
                                                            ) : (
                                                                // Handle numbers/strings or undefined
                                                                value !== undefined ? (
                                                                    <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 py-1 px-3 rounded-md text-sm">
                                                                        {value}
                                                                    </span>
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center">
                                                                        <span className="text-sm font-bold">✕</span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </section>
    );
}
