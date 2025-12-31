"use client";

import { Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Label } from "@/components/atoms/label";

export default function LandingContact() {
    return (
        <section id="contact" className="py-24 px-6 md:px-12 bg-slate-900 dark:bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-purple-500/5 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Left Column: Friendly Message & Info */}
                    <div className="text-white">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Contact Us
                        </h2>
                        <p className="text-slate-300 text-lg mb-12 leading-relaxed max-w-md">
                            Not sure what you need? The team at Orbixly will be happy to listen to you and suggest financial solutions you hadn't considered.
                        </p>

                        {/* <div className="flex flex-col gap-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-full text-primary-300">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Email us</h4>
                                    <p className="text-slate-400">info@orbixly.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-full text-primary-300">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Call us</h4>
                                    <p className="text-slate-400">Support: (+1) 123 456 7890</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-full text-primary-300">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Chat with us</h4>
                                    <p className="text-slate-400">Available 24/7 in the dashboard.</p>
                                </div>
                            </div>
                        </div> */}
                    </div>

                    {/* Right Column: Form Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/20 relative">
                        {/* Decorative curve lines (simple svg simulation from image) */}
                        <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-primary">
                                <circle cx="100" cy="0" r="40" strokeWidth="2" />
                                <circle cx="100" cy="0" r="60" strokeWidth="2" />
                                <circle cx="100" cy="0" r="80" strokeWidth="2" />
                            </svg>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">We'd love to hear from you!</h3>
                            <p className="text-slate-500 dark:text-slate-400">Let's get in touch</p>
                        </div>

                        <form className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-12"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-12"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="message" className="text-slate-700 dark:text-slate-300">Your Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Type your message here..."
                                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 min-h-[150px] resize-none"
                                />
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base font-semibold mt-2 rounded-xl">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
