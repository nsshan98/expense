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
import { Download } from "lucide-react";

const transactions = [
    {
        id: "1",
        date: "Oct 24, 2023",
        description: "Premium Plan - Yearly",
        amount: "$108.00",
        status: "Paid",
        invoice: "PDF"
    },
    {
        id: "2",
        date: "Oct 24, 2022",
        description: "Premium Plan - Yearly",
        amount: "$90.00",
        status: "Paid",
        invoice: "PDF"
    },
    {
        id: "3",
        date: "Sep 24, 2022",
        description: "Premium Plan - Monthly",
        amount: "$9.00",
        status: "Paid",
        invoice: "PDF"
    },
    {
        id: "4",
        date: "Aug 24, 2022",
        description: "Premium Plan - Monthly",
        amount: "$9.00",
        status: "Failed",
        invoice: "Unavailable"
    },
];

export function SubscriptionHistory() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[150px] font-semibold text-xs tracking-wider uppercase text-muted-foreground">Date</TableHead>
                            <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Description</TableHead>
                            <TableHead className="w-[100px] font-semibold text-xs tracking-wider uppercase text-muted-foreground">Amount</TableHead>
                            <TableHead className="w-[100px] font-semibold text-xs tracking-wider uppercase text-muted-foreground">Status</TableHead>
                            <TableHead className="w-[100px] text-right font-semibold text-xs tracking-wider uppercase text-muted-foreground">Invoice</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell className="font-medium text-muted-foreground">{tx.date}</TableCell>
                                <TableCell className="font-medium text-foreground">{tx.description}</TableCell>
                                <TableCell className="text-muted-foreground">{tx.amount}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={`
                                            ${tx.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}
                                            ${tx.status === 'Failed' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                                            border-0
                                        `}
                                    >
                                        {tx.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {tx.invoice === "PDF" ? (
                                        <Button variant="ghost" size="sm" className="h-8 text-sky-500 hover:text-sky-600 hover:bg-sky-50 px-2">
                                            <Download className="h-3 w-3 mr-1" />
                                            PDF
                                        </Button>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">Unavailable</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-center pt-4 pb-2">
                <Button variant="link" className="text-sky-500 hover:text-sky-600">
                    View All Transactions
                </Button>
            </div>
        </div>
    );
}
