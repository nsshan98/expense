"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, setMonth, setYear, addYears, subYears } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";

interface MonthPickerProps {
    value?: Date;
    onValueChange: (date: Date) => void;
    className?: string;
}

export function MonthPicker({
    value,
    onValueChange,
    className,
}: MonthPickerProps) {
    const [viewDate, setViewDate] = React.useState(value || new Date());
    const currentYear = viewDate.getFullYear();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevYear = () => {
        setViewDate(subYears(viewDate, 1));
    };

    const handleNextYear = () => {
        setViewDate(addYears(viewDate, 1));
    };

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = setMonth(setYear(value || new Date(), currentYear), monthIndex);
        onValueChange(newDate);
    };

    return (
        <div className={cn("p-3 w-[280px]", className)}>
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={handlePrevYear}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-semibold text-sm">
                    {currentYear}
                </div>
                <Button variant="ghost" size="icon" onClick={handleNextYear}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => {
                    const isSelected = value && value.getMonth() === index && value.getFullYear() === currentYear;
                    const isCurrentMonth = new Date().getMonth() === index && new Date().getFullYear() === currentYear;

                    return (
                        <Button
                            key={month}
                            variant={isSelected ? "default" : "ghost"}
                            className={cn(
                                "h-9 text-xs",
                                isSelected && "bg-primary text-white hover:bg-primary/90 hover:text-white focus:bg-primary focus:text-white",
                                !isSelected && isCurrentMonth && "border border-primary text-primary",
                                !isSelected && "hover:bg-accent hover:text-accent-foreground"
                            )}
                            onClick={() => handleMonthSelect(index)}
                        >
                            {month.slice(0, 3)}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
