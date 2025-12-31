"use client";

import { Orbit, Twitter, Linkedin, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300 py-16 px-6 md:px-12 relative overflow-hidden">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden">
                <span className="text-[20vw] font-black text-white whitespace-nowrap">Orbixly</span>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-6">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="bg-primary p-1.5 rounded-full text-white">
                                <Orbit size={24} className="text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">Orbixly</span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed max-w-sm">
                            Bring your financial life together in one shared space. Track, manage, and grow your wealth with confidence.
                        </p>
                    </div>

                    {/* Links Column 1: Legal */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-semibold mb-6">Legal</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-semibold mb-6">Social Media</h4>
                        <div className="flex gap-4">
                            <Link href="#" className="bg-slate-800 p-2.5 rounded-full text-white hover:bg-primary transition-colors">
                                <Twitter size={20} />
                            </Link>
                            <Link href="#" className="bg-slate-800 p-2.5 rounded-full text-white hover:bg-primary transition-colors">
                                <Linkedin size={20} />
                            </Link>
                            <Link href="#" className="bg-slate-800 p-2.5 rounded-full text-white hover:bg-primary transition-colors">
                                <Globe size={20} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                    <p>&copy; 2025 Orbixly. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
