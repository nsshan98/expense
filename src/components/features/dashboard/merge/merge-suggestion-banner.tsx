"use client";

import { Button } from "@/components/atoms/button";
import { useMergeSuggestions } from "@/hooks/use-transactions";
import { useState } from "react";
import { MergeModal } from "./merge-modal";
import { Sparkles } from "lucide-react";

export function MergeSuggestionBanner() {
    const { data: suggestions, isLoading } = useMergeSuggestions();
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

    if (isLoading || !suggestions || suggestions.length === 0) return null;

    const suggestion = suggestions[0]; // Just show the first one for now

    return (
        <>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                        Similar: <span className="font-bold">{suggestion.originalName}, {suggestion.suggestedName}</span>
                    </span>
                </div>
                <Button
                    size="sm"
                    variant="secondary"
                    className="h-8"
                    onClick={() => setSelectedSuggestion(suggestion.id)}
                >
                    Merge?
                </Button>
            </div>

            {selectedSuggestion && (
                <MergeModal
                    isOpen={!!selectedSuggestion}
                    onClose={() => setSelectedSuggestion(null)}
                    suggestion={suggestion}
                />
            )}
        </>
    );
}
