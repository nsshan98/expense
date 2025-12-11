"use client";

import { Button } from "@/components/atoms/button";
import { useMergeSuggestions } from "@/hooks/use-api";
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
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-900">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium">
                        Similar: <span className="font-bold">{suggestion.originalName}, {suggestion.suggestedName}</span>
                    </span>
                </div>
                <Button
                    size="sm"
                    variant="secondary"
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 h-8"
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
