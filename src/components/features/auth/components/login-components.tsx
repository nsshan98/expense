"use client"
import React, { useState } from 'react';
import { Eye, EyeOff, Wallet, TrendingUp, DollarSign, PieChart, ArrowRight, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginComponent() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background Graphics - Expense Tracker Theme */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top Right Circle */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
                {/* Bottom Left Circle */}
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>

                {/* Floating Icons */}
                <div className="absolute top-1/4 left-10 text-blue-200 animate-bounce delay-1000 duration-3000">
                    <Wallet size={64} />
                </div>
                <div className="absolute bottom-1/4 right-10 text-indigo-200 animate-bounce delay-700 duration-3000">
                    <PieChart size={64} />
                </div>
                <div className="absolute top-20 right-1/3 text-green-100 animate-pulse">
                    <TrendingUp size={80} />
                </div>
                <div className="absolute bottom-20 left-1/3 text-yellow-100 rotate-12">
                    <DollarSign size={80} />
                </div>
            </div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 mt-2 text-sm">Login to your Expense Tracker Account</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 block text-left">
                            Email or Username
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                id="email"
                                type="text"
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400 text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 group"
                    >
                        Login
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
