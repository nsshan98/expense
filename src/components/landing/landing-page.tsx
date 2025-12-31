"use client";

import Navbar from "@/components/organisms/navbar";
import LandingHero from "@/components/landing/landing-hero";
import LandingPreview from "@/components/landing/landing-preview";
import Footer from "../organisms/footer";
import LandingWhyUs from "./landing-why-us";
import LandingFeatures from "./landing-features";
import LandingPricing from "./landing-pricing";
import LandingFaq from "./landing-faq";
import LandingContact from "./landing-contact";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-sans selection:bg-primary selection:text-white">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/50 dark:bg-purple-900/20 blur-[120px] pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-purple-100/30 dark:bg-purple-900/10 blur-[100px] pointer-events-none" />

            <Navbar />

            <main className="flex flex-col gap-12">
                <LandingHero />
                <LandingPreview />
                <LandingFeatures />
                <LandingWhyUs />
                <LandingPricing />
                <LandingFaq />
                <LandingContact />
            </main>
            <Footer />
        </div>
    );
}
