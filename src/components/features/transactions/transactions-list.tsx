"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useInfiniteTransactions } from "@/hooks/use-transactions";
import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { useState, useRef, useEffect } from "react";
import { Transaction, PaginatedTransactionsResponse } from "@/types/dashboard";
import { EditTransactionModal } from "./edit-transaction-modal";
import { DeleteTransactionModal } from "./delete-transaction-modal";
import { Badge } from "@/components/atoms/badge";
import { useCurrency } from "@/contexts/currency-context";
import { Input } from "@/components/atoms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Label } from "@/components/atoms/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover";
import { Calendar } from "@/components/atoms/calendar";

export function TransactionsList() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [type, setType] = useState<'expense' | 'income' | 'all'>('all');
    const [date, setDate] = useState<DateRange | undefined>();
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [tempDate, setTempDate] = useState<DateRange | undefined>(date);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteTransactions({
        search: debouncedSearch,
        type: type === 'all' ? undefined : type,
        startDate: (date?.from && date?.to) ? format(date.from, 'dd-MM-yyyy') : undefined,
        endDate: (date?.from && date?.to) ? format(date.to, 'dd-MM-yyyy') : undefined,
    });

    const { symbol } = useCurrency();

    const transactions = data?.pages.flatMap((page: PaginatedTransactionsResponse) => page.data) || [];

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsEditModalOpen(true);
    };

    const handleDelete = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDeleteModalOpen(true);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="Search transactions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div>
                                    <Select
                                        value={type}
                                        onValueChange={(val: 'expense' | 'income' | 'all') => setType(val)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="expense">Expense</SelectItem>
                                            <SelectItem value="income">Income</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Popover
                                        open={isCalendarOpen}
                                        onOpenChange={(open) => {
                                            setIsCalendarOpen(open);
                                            if (open) {
                                                setTempDate(date);
                                            }
                                        }}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full md:w-[300px] justify-start text-left font-normal",
                                                    !date?.to && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                <span className="text-sm font-medium">Date Period</span>
                                                {date?.from && date?.to && (
                                                    <div className="ml-auto pl-4 text-xs text-muted-foreground">
                                                        {format(date.from, "dd-MM-yyyy")} - {format(date.to, "dd-MM-yyyy")}
                                                    </div>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="range"
                                                defaultMonth={date?.from}
                                                selected={tempDate}
                                                onSelect={(newDate) => {
                                                    setTempDate(newDate);
                                                    if (newDate?.from && newDate?.to && newDate.from.getTime() !== newDate.to.getTime()) {
                                                        setDate(newDate);
                                                        setIsCalendarOpen(false);
                                                    }
                                                }}
                                                numberOfMonths={1}
                                                className="md:hidden"
                                            />
                                            <Calendar
                                                mode="range"
                                                defaultMonth={date?.from}
                                                selected={tempDate}
                                                onSelect={(newDate) => {
                                                    setTempDate(newDate);
                                                    if (newDate?.from && newDate?.to && newDate.from.getTime() !== newDate.to.getTime()) {
                                                        setDate(newDate);
                                                        setIsCalendarOpen(false);
                                                    }
                                                }}
                                                numberOfMonths={2}
                                                className="hidden md:block"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            {(search || type !== 'all' || (date?.from && date?.to)) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSearch("");
                                        setType("all");
                                        setDate(undefined);
                                        setTempDate(undefined);
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 overflow-x-auto pb-4">
                        <div className="min-w-[1000px]">
                            <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground mb-2 px-2 gap-4">
                                <div className="col-span-1">Created</div>
                                <div className="col-span-1">Date</div>
                                <div className="col-span-3">Name</div>
                                <div className="col-span-2">Category</div>
                                <div className="col-span-1">Amount</div>
                                <div className="col-span-1">Type</div>
                                <div className="col-span-2">Expense Group</div>
                                <div className="col-span-1 text-right">Actions</div>
                            </div>
                            <div className="divide-y text-sm">
                                {transactions?.map((transaction) => (
                                    <div key={transaction.id} className="grid grid-cols-12 items-center py-3 px-2 hover:bg-muted/50 rounded-lg transition-colors gap-4">
                                        <div className="col-span-1 text-muted-foreground whitespace-nowrap">
                                            {new Date(transaction?.date).toLocaleDateString()}
                                        </div>
                                        <div className="col-span-1 text-muted-foreground whitespace-nowrap">
                                            {transaction?.created_at ? new Date(transaction.created_at).toLocaleDateString() : '-'}
                                        </div>
                                        <div className="col-span-3 font-medium truncate capitalize" title={transaction?.name}>
                                            {transaction?.name}
                                            {transaction?.note && (
                                                <div className="text-xs text-muted-foreground font-normal truncate">
                                                    {transaction.note}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2">
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary whitespace-nowrap capitalize">
                                                {typeof transaction?.category === 'string' ? transaction?.category : transaction?.category?.name}
                                            </span>
                                        </div>
                                        <div className={`col-span-1 font-semibold whitespace-nowrap ${transaction?.type === 'expense' ? 'text-destructive' : 'text-primary'}`}>
                                            {transaction?.type === 'expense' ? '-' : '+'}{symbol}{transaction?.amount.toFixed(2)}
                                        </div>
                                        <div className="col-span-1">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${transaction?.type === 'expense' ? 'bg-destructive/95 text-white' : 'bg-primary/10 text-primary'
                                                }`}>
                                                {typeof transaction?.category === 'string' ? transaction?.category : transaction?.category?.type}
                                            </span>
                                        </div>
                                        <div className="col-span-2 capitalize">
                                            <Badge variant="secondary" className="px-2 py-1 rounded-sm">{transaction?.normalized_name}</Badge>
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(transaction)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}

                                <div ref={observerTarget} className="h-4 w-full" />

                                {isFetchingNextPage && (
                                    <div className="py-4 space-y-2">
                                        <Skeleton className="h-12 w-full" />
                                        <Skeleton className="h-12 w-full" />
                                    </div>
                                )}

                                {(!isLoading && (!transactions || transactions.length === 0)) && (
                                    <div className="text-center py-8 text-muted-foreground">No transactions found.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditTransactionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                transaction={selectedTransaction}
            />

            <DeleteTransactionModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                transaction={selectedTransaction}
            />
        </>
    );
}
