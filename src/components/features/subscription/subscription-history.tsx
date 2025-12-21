"use client";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/atoms/table";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Download, Loader2, ChevronDown, ChevronUp, History, ChevronLeft, ChevronRight } from "lucide-react";
import { useSubscriptionHistory } from "@/hooks/use-subscription";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function SubscriptionHistory() {
    const [page, setPage] = useState(1);
    const { data: response, isLoading } = useSubscriptionHistory(page);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const transactions = response?.data;
    const meta = response?.meta;

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Transaction History</h2>
                <div className="flex justify-center py-8 border rounded-md">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Transaction History</h2>
                <div className="rounded-md border bg-card p-8 text-center text-muted-foreground">
                    No transaction history found.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="w-[150px] font-semibold text-xs tracking-wider uppercase text-muted-foreground">Date</TableHead>
                            <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Plan</TableHead>
                            <TableHead className="w-[100px] font-semibold text-xs tracking-wider uppercase text-muted-foreground">Amount</TableHead>
                            <TableHead className="w-[100px] font-semibold text-xs tracking-wider uppercase text-muted-foreground">Provider</TableHead>
                            <TableHead className="w-[100px] font-semibold text-xs tracking-wider uppercase text-muted-foreground">Status</TableHead>
                            <TableHead className="w-[100px] text-right font-semibold text-xs tracking-wider uppercase text-muted-foreground">Invoice</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <>
                                <TableRow
                                    key={tx.id}
                                    className={cn("cursor-pointer hover:bg-muted/50 transition-colors", expandedId === tx.id && "bg-muted/50")}
                                    onClick={() => toggleExpand(tx.id)}
                                >
                                    <TableCell>
                                        {tx.submissions && tx.submissions.length > 0 ? (
                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                {expandedId === tx.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </Button>
                                        ) : (
                                            <div className="w-6" />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-muted-foreground">
                                        {format(new Date(tx.created_at), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        {tx.plan_name} <span className="text-xs text-muted-foreground capitalize">({tx.duration} days)</span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {tx.amount} {tx.currency || 'BDT'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground capitalize">
                                        {tx.submissions?.[0]?.provider || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "border-0 capitalize",
                                                tx.status === 'completed' && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                                                (tx.status === 'failed' || tx.status === 'rejected') && "bg-red-100 text-red-700 hover:bg-red-100",
                                                (tx.status === 'pending' || tx.status === 'pending_verification') && "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                            )}
                                        >
                                            {tx.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {tx.invoice_url ? (
                                            <Button variant="ghost" size="sm" className="h-8 text-sky-500 hover:text-sky-600 hover:bg-sky-50 px-2" asChild onClick={(e) => e.stopPropagation()}>
                                                <a href={tx.invoice_url} target="_blank" rel="noopener noreferrer">
                                                    <Download className="h-3 w-3 mr-1" />
                                                    PDF
                                                </a>
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Unavailable</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                                {expandedId === tx.id && (
                                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                                        <TableCell colSpan={7} className="p-0">
                                            <div className="p-4 pl-12 space-y-3">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                                    <History className="h-4 w-4" />
                                                    Submission History
                                                </div>
                                                <div className="border rounded-md bg-background overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="h-8 bg-muted/50 hover:bg-muted/50">
                                                                <TableHead className="h-8 text-xs">Date</TableHead>
                                                                <TableHead className="h-8 text-xs">Provider</TableHead>
                                                                <TableHead className="h-8 text-xs">Transaction ID</TableHead>
                                                                <TableHead className="h-8 text-xs">Status</TableHead>
                                                                <TableHead className="h-8 text-xs">Notes</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {tx.submissions?.map((sub) => (
                                                                <TableRow key={sub.id} className="h-10 hover:bg-transparent">
                                                                    <TableCell className="text-xs text-muted-foreground">
                                                                        {format(new Date(sub.created_at), "MMM d, h:mm a")}
                                                                    </TableCell>
                                                                    <TableCell className="text-xs font-medium capitalize">
                                                                        {sub.provider}
                                                                    </TableCell>
                                                                    <TableCell className="text-xs font-mono text-muted-foreground">
                                                                        {sub.transaction_id}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={cn(
                                                                                "h-5 text-[10px] px-2 capitalize",
                                                                                sub.status === 'verified' && "border-emerald-200 text-emerald-700 bg-emerald-50",
                                                                                sub.status === 'rejected' && "border-red-200 text-red-700 bg-red-50",
                                                                                sub.status === 'submitted' && "border-sky-200 text-sky-700 bg-sky-50"
                                                                            )}
                                                                        >
                                                                            {sub.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate" title={sub.verification_notes || ""}>
                                                                        {sub.verification_notes || "-"}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                            {(!tx.submissions || tx.submissions.length === 0) && (
                                                                <TableRow>
                                                                    <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-4">
                                                                        No submission details available
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 py-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {meta.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                        disabled={page === meta.totalPages}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
