"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { CategoryBreakdown } from "@/types/breakdown";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CategoryBreakdownListProps {
    categories: CategoryBreakdown[];
    totalSpend: number;
}

export function CategoryBreakdownList({ categories, totalSpend }: CategoryBreakdownListProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<'amount' | 'name'>('amount');

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const sortedCategories = [...categories].sort((a, b) => {
        if (sortBy === 'amount') {
            return b.total - a.total;
        }
        return a.name.localeCompare(b.name);
    });

    // Get category icon/color based on name
    const getCategoryIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('food') || lowerName.includes('dining')) return '🍽️';
        if (lowerName.includes('transport')) return '🚗';
        if (lowerName.includes('utilities') || lowerName.includes('utility')) return '⚡';
        if (lowerName.includes('entertainment')) return '🎬';
        if (lowerName.includes('shopping')) return '🛍️';
        if (lowerName.includes('health')) return '🏥';
        return '📊';
    };

    const getCategoryColor = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('food')) return 'bg-orange-100 text-orange-700';
        if (lowerName.includes('transport')) return 'bg-blue-100 text-blue-700';
        if (lowerName.includes('utilities')) return 'bg-purple-100 text-purple-700';
        if (lowerName.includes('entertainment')) return 'bg-pink-100 text-pink-700';
        if (lowerName.includes('shopping')) return 'bg-green-100 text-green-700';
        return 'bg-slate-100 text-slate-700';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Spending Categories</h3>
                <div className="flex gap-2 text-sm">
                    <button
                        onClick={() => setSortBy('amount')}
                        className={`px-3 py-1 rounded ${sortBy === 'amount' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                        Sort by Amount
                    </button>
                    <button
                        onClick={() => setSortBy('name')}
                        className={`px-3 py-1 rounded ${sortBy === 'name' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                        Sort by Name
                    </button>
                </div>
            </div>

            {sortedCategories.map((category) => {
                const isExpanded = expandedCategories.has(category.id);

                return (
                    <Card key={category.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${getCategoryColor(category.name)}`}>
                                    {getCategoryIcon(category.name)}
                                </div>

                                <div className="flex-1 text-left">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold capitalize">{category.name}</h4>
                                        <span className="text-lg font-bold">৳{category.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>{category.count} transactions</span>
                                        <span>•</span>
                                        <span>{category.percentage.toFixed(1)}%</span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${category.percentage}%` }}
                                        />
                                    </div>
                                </div>

                                {isExpanded ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                            </button>

                            {/* Merchant Breakdown */}
                            {isExpanded && category.merchants.length > 0 && (
                                <div className="px-4 pb-4 pt-2 bg-muted/30">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                        Merchant Breakdown
                                    </p>
                                    <div className="space-y-2">
                                        {category.merchants.map((merchant, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-3 bg-background rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                        {merchant.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm capitalize">{merchant.name}</p>
                                                        <p className="text-xs text-muted-foreground">{merchant.count} {merchant.count === 1 ? 'transaction' : 'transactions'}</p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold">৳{merchant.amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
