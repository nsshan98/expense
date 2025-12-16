"use client";

import { Button } from "@/components/atoms/button";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionSchemaType } from "@/zod/transaction-schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/atoms/form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/atoms/input-group";
import { Tag, DollarSign, Loader2, Plus } from "lucide-react";
import { FaClipboardList, FaBangladeshiTakaSign } from "react-icons/fa6";

export function QuickAddBar() {
    const createTransaction = useCreateTransaction();

    const form = useForm<TransactionSchemaType>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            name: "",
            amount: 0, // Initialize as number
            date: new Date().toISOString(),
            // type: 'expense',
        },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: TransactionSchemaType) => {
        try {
            await createTransaction.mutateAsync({
                ...data,
                date: new Date().toISOString(), // Ensure current date/time
                // type: 'expense', // Force expense for quick add
            });
            toast.success("Expense added successfully");
            form.reset({
                name: "",
                amount: 0,
                date: new Date().toISOString(),
                // type: 'expense',
            });
        } catch (error) {
            console.error(error);
            // Error handling similar to SignupForm could be added here if needed
            toast.error("Failed to add expense");
        }
    };

    return (
        <div className="p-4 bg-card rounded-xl border shadow-sm">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col md:flex-row gap-4 items-start md:items-start"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="flex-1 w-full">
                                <FormControl>
                                    <InputGroup>
                                        <InputGroupInput
                                            placeholder="Expense name (e.g., Coffee)"
                                            {...field}
                                        />
                                        <InputGroupAddon>
                                            <FaClipboardList className="h-4 w-4" />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-[200px]">
                                <FormControl>
                                    <InputGroup>
                                        <InputGroupInput
                                            type="number"
                                            placeholder="Amount"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            onFocus={(e) => e.currentTarget.select()}
                                        />
                                        <InputGroupAddon>
                                            <FaBangladeshiTakaSign className="h-4 w-4" />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting || createTransaction.isPending}
                        className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    >
                        {isSubmitting || createTransaction.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Expense
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
