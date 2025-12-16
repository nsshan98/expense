"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Checkbox } from "@/components/atoms/checkbox";
import { useMergeTransactions } from "@/hooks/use-transactions";
import { MergeSuggestion } from "@/types/dashboard";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface MergeModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestion: MergeSuggestion;
}

export function MergeModal({ isOpen, onClose, suggestion }: MergeModalProps) {
    const [selectedName, setSelectedName] = useState<string>(suggestion.suggestedName);
    const [customName, setCustomName] = useState("");
    const mergeTransactions = useMergeTransactions();

    const handleMerge = async () => {
        const finalName = selectedName === "custom" ? customName : selectedName;
        if (!finalName) {
            toast.error("Please select or enter a name");
            return;
        }

        try {
            await mergeTransactions.mutateAsync({
                originalName: suggestion.originalName,
                finalName,
            });
            toast.success("Transactions merged successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to merge transactions");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Similar expense types found</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        {suggestion.similarTransactions.map((t, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <span className="text-sm">{t.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 mt-4">
                        <h4 className="font-medium text-sm">Choose final name</h4>

                        <div
                            className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer ${selectedName === suggestion.suggestedName ? 'bg-muted border-primary' : 'hover:bg-muted/50'}`}
                            onClick={() => setSelectedName(suggestion.suggestedName)}
                        >
                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${selectedName === suggestion.suggestedName ? 'border-primary' : 'border-border'}`}>
                                {selectedName === suggestion.suggestedName && <div className="h-2 w-2 rounded-full bg-primary" />}
                            </div>
                            <span className="text-sm">{suggestion.suggestedName}</span>
                        </div>

                        <div
                            className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer ${selectedName === suggestion.originalName ? 'bg-muted border-primary' : 'hover:bg-muted/50'}`}
                            onClick={() => setSelectedName(suggestion.originalName)}
                        >
                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${selectedName === suggestion.originalName ? 'border-primary' : 'border-border'}`}>
                                {selectedName === suggestion.originalName && <div className="h-2 w-2 rounded-full bg-primary" />}
                            </div>
                            <span className="text-sm">{suggestion.originalName}</span>
                        </div>

                        <div
                            className={`p-3 rounded-lg border cursor-pointer ${selectedName === 'custom' ? 'bg-muted border-primary' : 'hover:bg-muted/50'}`}
                            onClick={() => setSelectedName('custom')}
                        >
                            <div className="flex items-center space-x-2 mb-2">
                                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${selectedName === 'custom' ? 'border-primary' : 'border-border'}`}>
                                    {selectedName === 'custom' && <div className="h-2 w-2 rounded-full bg-primary" />}
                                </div>
                                <span className="text-sm">Custom name</span>
                            </div>
                            {selectedName === 'custom' && (
                                <Input
                                    placeholder="Enter a new name"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    className="mt-2"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={handleMerge}
                        disabled={mergeTransactions.isPending}
                    >
                        {mergeTransactions.isPending ? "Merging..." : "Merge"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
