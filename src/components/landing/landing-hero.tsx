"use client";

import { Button } from "../atoms/button";

export default function LandingHero() {
    return (
        <section className="flex flex-col items-center justify-center pt-32 md:pt-40 pb-12 px-6 text-center max-w-4xl mx-auto z-10 relative">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                Improve Your Money <br className="hidden md:block" />
                Management with <span className="text-primary">Orbixly</span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
                Simplify your business's financial management with our easy-to-use, scalable SaaS platform. Built for U.S. companies, our tools make complex processes simple.
            </p>

            <Button href="/auth/sign-up" className="bg-linear-to-r from-primary to-primary/80 text-white px-8 py-3.5 rounded-full text-base font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all duration-200">
                Get Started
            </Button>
        </section>
    );
}
