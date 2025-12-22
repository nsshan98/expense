import { Button } from "@/components/atoms/button";

interface MergeSuggestionBannerProps {
    suggestions: string[];
    onMergeClick: () => void;
}

export function MergeSuggestionBanner({ suggestions, onMergeClick }: MergeSuggestionBannerProps) {
    if (!suggestions || suggestions.length === 0) return null;

    // Display first few suggestions
    const displayNames = suggestions.slice(0, 3).join(", ");
    const hasMore = suggestions.length > 3;

    return (
        <div className="flex items-center justify-between bg-indigo-50/50 rounded-md px-3 py-2 mt-2 text-sm text-indigo-900">
            <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-medium text-indigo-500 shrink-0">Similar:</span>
                <span className="truncate text-slate-600">
                    {displayNames}{hasMore ? ", ..." : ""}
                </span>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onMergeClick}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 h-7 text-xs font-medium px-3 ml-2 shrink-0"
            >
                Merge?
            </Button>
        </div>
    );
}
