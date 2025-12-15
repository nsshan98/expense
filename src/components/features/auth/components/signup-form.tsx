"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Checkbox } from "@/components/atoms/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/atoms/input-group";
import { Eye, EyeOff, CheckCircle2, CircleX, Wallet, PieChart, TrendingUp, DollarSign, UserRound, MailIcon, Lock, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupSchemaType } from "@/zod/auth-schema";
import Link from "next/link";
import { useCreateUser } from "../hooks/auth-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

const SignupForm = () => {
  const router = useRouter()
  const { createUserMutation } = useCreateUser()
  const signupForm = useForm<SignupSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      password: {
        newPassword: "",
        confirmPassword: "",
      },
    },
    resolver: zodResolver(signupSchema),
  });

  const { isSubmitting } = signupForm.formState;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [giveConsent, setGiveConsent] = useState(false);

  const onSubmit = async (data: SignupSchemaType) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password.newPassword,
    };
    await createUserMutation.mutateAsync(payload, {
      onSuccess: () => {
        toast.success("User created successfully!");
        router.push("/dashboard");
        // You can redirect the user or show a success message here
      },
      onError: (error: Error) => {
        if (isAxiosError(error)) {
          const errorMessage = error.response?.data?.message;

          if (typeof errorMessage === "string") {
            toast.error(errorMessage);
          } else if (Array.isArray(errorMessage)) {
            toast.error(errorMessage.join(", "));
          } else if (typeof errorMessage === "object" && errorMessage?.message) {
            toast.error(String(errorMessage.message));
          } else {
            toast.error("Error creating user. Please try again.");
          }
        }
      },
    });
    console.log("Form submitted with data:", data);
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Your Account</h1>
          <p className="text-gray-500 mt-2 text-sm">Start tracking your expenses today</p>
        </div>

        <Form {...signupForm}>
          <form
            onSubmit={signupForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col gap-6">
              <FormField
                control={signupForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput type="text" placeholder="Enter your name" {...field} />
                        <InputGroupAddon>
                          <UserRound />
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
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
                control={signupForm.control}
                name="password.newPassword"
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
              <FormField
                control={signupForm.control}
                name="password.confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput type={showConfirmPassword ? "text" : "password"} placeholder="********" {...field} />
                        <InputGroupAddon>
                          <Lock />
                        </InputGroupAddon>
                        <InputGroupAddon align={'inline-end'}>
                          {showConfirmPassword ? (
                            <EyeOff
                              size={15}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                          ) : (
                            <Eye
                              size={15}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  Creating account...
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Sign up"
              )}
            </Button>

            {/* Sign up Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
