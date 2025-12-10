"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/atoms/form";
import { DollarSign, Eye, EyeOff, Loader2, MailIcon, Lock, PieChart, TrendingUp, Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "@/zod/auth-schema";
import Link from "next/link";
import { signIn } from "@/lib/auth";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/atoms/input-group";


export default function LoginComponent() {

    const loginForm = useForm<LoginSchemaType>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
    });

    const { isSubmitting } = loginForm.formState;

    const [showPassword, setShowPassword] = useState(false);
    const [globalError, setGlobalError] = useState<string>("");

    const onSubmit = async (data: LoginSchemaType) => {
        setGlobalError("");
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);

        const result = await signIn(undefined, formData);

        console.log(result);

        if (result?.error) {
            if (result.error.email) {
                loginForm.setError("email", { message: result.error.email[0] });
            }
            if (result.error.password) {
                loginForm.setError("password", { message: result.error.password[0] });
            }
        }
        if (result?.message) {
            setGlobalError(result.message);
        }
    };

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

                <Form {...loginForm}>
                    <form
                        onSubmit={loginForm.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="flex flex-col gap-6">
                            {globalError && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                    {globalError}
                                </div>
                            )}
                            <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupInput type="email" placeholder="Enter your email" {...field} />
                                                <InputGroupAddon>
                                                    <MailIcon />
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupInput type={showPassword ? "text" : "password"} placeholder="********" {...field} />
                                                <InputGroupAddon>
                                                    <Lock />
                                                </InputGroupAddon>
                                                <InputGroupAddon align={'inline-end'}>
                                                    {showPassword ? (
                                                        <EyeOff
                                                            size={15}
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        />
                                                    ) : (
                                                        <Eye
                                                            size={15}
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        />
                                                    )}
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md mt-6"
                        >
                            {isSubmitting ? (
                                <>
                                    Logging in...
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-600 mt-4">
                            Don’t have account?{" "}
                            <Link
                                href="/auth/sign-up"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    );
}
