"use client";

import Image from "next/image";
import dashboard from '../../../public/dashboard2.png'

export default function LandingPreview() {
    return (
        <div className="mx-auto z-10">
            {/* <div className="relative w-full aspect-4/3 md:aspect-video bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden group">

                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <Image src={dashboard} alt="Dashboard Preview" fill />
                </div>

                <div className="absolute top-0 left-0 right-0 h-12 bg-white/40 dark:bg-black/20 backdrop-blur-md border-b border-white/20" />
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
            </div> */}
            <Image src={dashboard} alt="Dashboard Preview" width={1000} height={1000} className="w-full h-auto" />
        </div>
    );
}
