"use client";

import { ArrowUpRight, BarChart3, PieChart, TrendingUp, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms/button";

const features = [
    {
        icon: BarChart3,
        title: "Smart Analytics",
        description: "Visualize your spending patterns with detailed charts and trends to understand where your money goes.",
    },
    {
        icon: PieChart,
        title: "Budget Control",
        description: "Set monthly limits for different categories to keep your expenses strictly on track and avoid overspending.",
    },
    {
        icon: TrendingUp,
        title: "Future Projections",
        description: "Predict your future financial health with our advanced projection engine based on your historical data.",
    },
    {
        icon: CreditCard,
        title: "Transaction Management",
        description: "Easily track, categorize, and manage every transaction in real-time across multiple accounts.",
    },
];

export default function LandingFeatures() {
    return (
        <section id="features" className="px-6 md:px-12 py-6 md:py-12 relative overflow-hidden">
            {/* Background Gradients/Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        A financial platform built <br /> for your growth
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                        Orbixly offers a flexible and reliable way to manage your finance, track expenses, and plan for the future—all in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-6 rounded-3xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50"
                        >
                            <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="text-white dark:text-black" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
