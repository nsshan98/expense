"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";

const plans = [
    {
        name: "Starter",
        description: "Perfect for individuals starting to track their expenses.",
        monthlyPrice: 0,
        annualPrice: 0,
        features: [
            "Basic expense tracking",
            "5 monthly budgets",
            "Standard categories",
            "7-day data history"
        ],
        highlight: false,
    },
    {
        name: "Pro",
        description: "Advanced tools for serious financial management.",
        monthlyPrice: 12,
        annualPrice: 120,
        features: [
            "Unlimited expense tracking",
            "Smart AI insights",
            "Custom categories",
            "Export to CSV/PDF",
            "Bill reminders"
        ],
        highlight: true,
    },
    {
        name: "Enterprise",
        description: "Complete solution for larger teams and organizations.",
        monthlyPrice: 49,
        annualPrice: 490,
        features: [
            "Multi-user collaboration",
            "Role-based access",
            "Dedicated account manager",
            "API Access",
            "Audit logs"
        ],
        highlight: false,
    },
];

export default function LandingPricing() {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section id="pricing" className="py-24 px-6 md:px-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950">

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
                        <div className="bg-slate-200 dark:bg-slate-900/50 p-1 rounded-full flex items-center border border-slate-200 dark:border-slate-800 relative">
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 z-10 ${!isAnnual ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                Monthly billing
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 z-10 ${isAnnual ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                Annual billing
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-3xl p-8 transition-all duration-300 ${plan.highlight
                                ? "bg-slate-900 dark:bg-slate-900 text-white shadow-2xl shadow-primary/20 scale-105 border border-primary/50 ring-1 ring-primary/50"
                                : "bg-white dark:bg-slate-900/40 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-primary/30"
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-primary to-primary/80 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm ${plan.highlight ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-8">
                                <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                </span>
                                <span className={`text-sm ${plan.highlight ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
                                    /{isAnnual ? 'yr' : 'mth'}
                                </span>
                            </div>

                            <Button
                                className={`w-full py-6 rounded-xl font-semibold mb-8 transition-all ${plan.highlight
                                    ? 'bg-primary hover:bg-primary/90 text-white border-none'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Subscribe Now
                            </Button>

                            <ul className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className={`mt-0.5 p-0.5 rounded-full ${plan.highlight ? 'bg-primary/20 text-primary-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className={`text-sm ${plan.highlight ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
