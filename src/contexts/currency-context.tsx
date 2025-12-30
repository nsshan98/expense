"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface CurrencyContextType {
    symbol: string;
    code: string;
    formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
    children: ReactNode;
    currencySymbol: string;
    currencyCode: string;
}

export function CurrencyProvider({ children, currencySymbol, currencyCode }: CurrencyProviderProps) {
    const formatAmount = (amount: number): string => {
        return `${currencySymbol}${amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const value: CurrencyContextType = {
        symbol: currencySymbol,
        code: currencyCode,
        formatAmount,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency(): CurrencyContextType {
    const context = useContext(CurrencyContext);

    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }

    return context;
}
