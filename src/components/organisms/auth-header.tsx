"use client";

import { Orbit } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/organisms/theme-toggle";

export default function AuthHeader() {
    return (
        <div className="flex items-center justify-between w-full mb-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="bg-primary p-1.5 rounded-full text-white">
                    <Orbit size={20} className="text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">Orbixly</span>
            </Link>

            <ThemeToggle />
        </div>
    );
}
