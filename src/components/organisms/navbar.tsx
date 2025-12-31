"use client";

import { Orbit, Menu } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/organisms/theme-toggle";
import { Button } from "../atoms/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "../atoms/sheet";

const menuItems = [
    { label: "Features", href: "#features" },
    { label: "Why Us", href: "#why-us" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
    return (
        <div className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center">
            <header className="flex items-center justify-between py-2.5 pl-6 pr-3 max-w-5xl w-full bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-indigo-500/5">
                <Link href="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="bg-primary p-1.5 rounded-full text-white">
                        <Orbit size={20} className="text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Orbixly</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    <ThemeToggle />
                    <Button href="/auth/login" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-md hover:shadow-lg">
                        Login
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="text-slate-900 dark:text-white p-1">
                                <Menu size={24} />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                            <div className="flex flex-col gap-6 mt-8 px-5">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <Button href="/auth/login" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 w-full rounded-full mt-4">
                                    Login
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
        </div>
    );
}
