import { BudgetManager } from "@/components/features/budgets/budget-manager";
import { AddCategoryForm } from "@/components/features/budgets/add-category-form";
import { Lightbulb } from "lucide-react";

export default function BudgetsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Budget Settings</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <BudgetManager />
                </div>
                <div className="space-y-6">
                    <AddCategoryForm />

                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
                        <div className="mt-1">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Lightbulb className="h-4 w-4 text-emerald-600" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-emerald-900">Budgets help generate predictions & warnings.</h4>
                            <p className="text-xs text-emerald-700 leading-relaxed">
                                Set monthly limits to track your spending goals and stay on top of your finances.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
