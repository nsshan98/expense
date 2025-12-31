"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/atoms/accordion";

const faqs = [
    {
        id: "01",
        question: "Is there a free trial available?",
        answer: "Yes, you can try Orbixly for free for 30 days. No credit card required. We believe in letting you experience the full power of our platform before committing.",
    },
    {
        id: "02",
        question: "Can I change my plan later?",
        answer: "Absolutely! You can upgrade or downgrade your plan at any time from your account settings. The changes will take effect immediately.",
    },
    {
        id: "03",
        question: "Is my financial data secure?",
        answer: "Security is our top priority. We use bank-grade encryption (AES-256) to encrypt your data both in transit and at rest.",
    },
    {
        id: "04",
        question: "Can I connect multiple bank accounts?",
        answer: "Yes, depending on your plan. The Starter plan allows 1 account, while Pro and Enterprise plans allow unlimited bank connections.",
    },
    {
        id: "05",
        question: "Do you offer customer support?",
        answer: "Yes, all plans come with email support. Pro and Enterprise plans get priority response times and dedicated support channels.",
    },
    {
        id: "06",
        question: "How do I export my data?",
        answer: "You can easily export your transaction history and reports to CSV, PDF, or Excel formats directly from the dashboard.",
    },
];

export default function LandingFaq() {
    // Split FAQs into two columns
    const leftFaqs = faqs.slice(0, 3);
    const rightFaqs = faqs.slice(3, 6);

    return (
        <section id="faq" className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background Big Question Mark */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[400px] font-black text-slate-200 dark:text-slate-900/50 opacity-50 pointer-events-none select-none -z-1 leading-none font-serif">
                ?
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 relative inline-block">
                        Find the answers <br /> you need
                        {/* Decorative doodle */}
                        <div className="absolute -top-6 -right-8 opacity-50 hidden md:block">
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" className="stroke-primary" strokeWidth="4">
                                <path d="M20,60 C40,20 80,20 80,60" />
                            </svg>
                        </div>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <Accordion type="multiple" className="flex flex-col gap-4">
                        {leftFaqs.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id} className="border-none group">
                                <AccordionTrigger
                                    className="hover:no-underline [&>svg]:hidden w-full flex items-center justify-between p-5 rounded-full border transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/50 data-[state=open]:bg-primary/10 data-[state=open]:border-primary data-[state=open]:shadow-lg data-[state=open]:shadow-primary/10"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-data-[state=open]:bg-primary group-data-[state=open]:text-white group-data-[state=open]:border-primary transition-colors">
                                            <ChevronDown size={16} className="group-data-[state=open]:hidden" />
                                            <ChevronUp size={16} className="hidden group-data-[state=open]:block" />
                                        </div>
                                        <span className="font-semibold text-left text-slate-600 dark:text-slate-300 group-data-[state=open]:text-slate-900 group-data-[state=open]:dark:text-white transition-colors">
                                            {faq.question}
                                        </span>
                                    </div>
                                    <span className="text-xl font-bold text-slate-300 dark:text-slate-700 font-mono">
                                        {faq.id}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-0">
                                    <div className="bg-slate-900 dark:bg-black text-slate-300 p-6 rounded-3xl mx-2 shadow-xl border border-slate-800">
                                        {faq.answer}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Right Column */}
                    <Accordion type="multiple" className="flex flex-col gap-4">
                        {rightFaqs.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id} className="border-none group">
                                <AccordionTrigger
                                    className="hover:no-underline [&>svg]:hidden w-full flex items-center justify-between p-5 rounded-full border transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/50 data-[state=open]:bg-primary/10 data-[state=open]:border-primary data-[state=open]:shadow-lg data-[state=open]:shadow-primary/10"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-data-[state=open]:bg-primary group-data-[state=open]:text-white group-data-[state=open]:border-primary transition-colors">
                                            <ChevronDown size={16} className="group-data-[state=open]:hidden" />
                                            <ChevronUp size={16} className="hidden group-data-[state=open]:block" />
                                        </div>
                                        <span className="font-semibold text-left text-slate-600 dark:text-slate-300 group-data-[state=open]:text-slate-900 group-data-[state=open]:dark:text-white transition-colors">
                                            {faq.question}
                                        </span>
                                    </div>
                                    <span className="text-xl font-bold text-slate-300 dark:text-slate-700 font-mono">
                                        {faq.id}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-0">
                                    <div className="bg-slate-900 dark:bg-black text-slate-300 p-6 rounded-3xl mx-2 shadow-xl border border-slate-800">
                                        {faq.answer}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
