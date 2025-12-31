"use client";

import { Check, TrendingUp, Wallet } from "lucide-react";
import Image from "next/image";
import phoneView from '../../../public/phone-view.png'

const benefits = [
    {
        icon: Wallet,
        title: "Track Every Expense",
        description: "Automatically categorize your expenses and see where your money goes in real time.",
        active: false,
    },
    {
        icon: TrendingUp,
        title: "Smart Budgeting",
        description: "Create budgets that actually stick. Orbix sends helpful nudges before you overspend.",
        active: false,
    },
    {
        icon: Check,
        title: "Actionable Insights",
        description: "Visualize your spending habits with clear charts and get personalized tips to save more.",
        active: false,
    },
];

export default function LandingWhyUs() {
    return (
        <section id="why-us" className="py-24 px-6 md:px-12 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Content */}
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-12">
                            Why Choose Orbixly?
                        </h2>

                        <div className="flex flex-col gap-6">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className={`p-6 rounded-3xl transition-all duration-300 cursor-default ${benefit.active
                                        ? "bg-linear-to-r from-primary to-primary/80 text-white shadow-xl shadow-primary/20 scale-105"
                                        : "bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    <h3 className={`text-xl font-bold mb-2 ${benefit.active ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                        {benefit.title}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${benefit.active ? "text-primary-100" : "text-slate-500 dark:text-slate-400"}`}>
                                        {benefit.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Phone Mockup */}
                    <div className="relative">
                        {/* Blue Background Blob */}
                        <div className="absolute inset-0 bg-primary rounded-[3rem] rotate-3 opacity-10 dark:opacity-20 transform scale-95" />
                        <div className="absolute inset-0 bg-primary rounded-[3rem] -rotate-3 opacity-10 dark:opacity-20 transform scale-95" />

                        {/* Phone Container */}
                        <div className="relative mx-auto h-[600px] w-[300px]">
                            <Image src={phoneView} alt="Dashboard Preview" fill />
                        </div>


                    </div>
                </div>
            </div>
        </section>
    );
}
