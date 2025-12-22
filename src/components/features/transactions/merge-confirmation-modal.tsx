import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/atoms/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { Checkbox } from "@/components/atoms/checkbox";
import { Label } from "@/components/atoms/label";
import { Check } from "lucide-react";
import { capitalize } from "@/lib/utils";

interface MergeConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestions: string[];
    onMerge: (sourceNames: string[], targetName: string) => void;
    isMerging?: boolean;
}

export function MergeConfirmationModal({
    isOpen,
    onClose,
    suggestions,
    onMerge,
    isMerging = false,
}: MergeConfirmationModalProps) {
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [targetNameSelection, setTargetNameSelection] = useState<string>("");
    const [customName, setCustomName] = useState("");

    // Initialize state when suggestions change or modal opens
    // Deduplicate and capitalize suggestions for UI
    const uiSuggestions = useMemo(() => {
        const unique = Array.from(new Set(suggestions.map(s => capitalize(s))));
        return unique;
    }, [suggestions]);

    useEffect(() => {
        if (isOpen && uiSuggestions.length > 0) {
            setSelectedSources([]); // Default to none selected as per user feedback
            setTargetNameSelection(uiSuggestions[0] || ""); // Default to first suggestion
            setCustomName("");
        }
    }, [isOpen, uiSuggestions]);

    const handleToggleSource = (name: string) => {
        // Keep source selection logic based on ORIGINAL names (passed in props as suggestions)
        // Need to map back or maybe we list ORIGINAL names for selection?
        // User said: "if select any value from the up then the value will sourceNames"
        // Wait, if UI shows Capitalized, but sourceNames must be accurate for API to find them to merge.
        // It's safer to list original suggestions for the Checkbox list (Sources)
        // AND show Capitalized options for the Target Name list.
        setSelectedSources((prev) =>
            prev.includes(name)
                ? prev.filter((s) => s !== name)
                : [...prev, name]
        );
    };

    const handleMerge = () => {
        const finalTargetName = targetNameSelection === "custom" ? customName : targetNameSelection;
        if (!finalTargetName || selectedSources.length === 0) return;

        onMerge(selectedSources, finalTargetName);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Similar expense types found</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Source Selection - Show Original Names to avoid ambiguity if capitalization makes duplicates */}
                    {/* Actually user request implied seeing capitalized UI... "show capitalize for the ui" */}
                    {/* But if we have "toast" and "Toast", and we merge them, we are selecting both. */}
                    {/* Let's show proper names. Capitalizing everything in Source might be misleading if case matters for identification. */}
                    {/* However, for Target Name, Capitalized is definitely desired. */}
                    <div className="space-y-3">
                        {suggestions.map((name) => (
                            <div key={name} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`source-${name}`}
                                    checked={selectedSources.includes(name)}
                                    onCheckedChange={() => handleToggleSource(name)}
                                    className="data-[state=checked]:bg-emerald-400 data-[state=checked]:border-emerald-400"
                                />
                                <Label htmlFor={`source-${name}`} className="font-normal cursor-pointer">
                                    {name}
                                </Label>
                            </div>
                        ))}
                    </div>

                    {/* Target Selection - Show Capitalized Unique Options */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm text-foreground">Choose final name</h4>
                        <RadioGroup
                            value={targetNameSelection}
                            onValueChange={setTargetNameSelection}
                            className="space-y-2"
                        >
                            {uiSuggestions.map((name) => (
                                <div key={`target-${name}`} className="flex items-center space-x-2 border rounded-md p-3 bg-muted/20 data-[state=checked]:bg-primary/5 cursor-pointer">
                                    <RadioGroupItem value={name} id={`target-${name}`} className="text-emerald-500 border-emerald-500" />
                                    <Label htmlFor={`target-${name}`} className="flex-1 cursor-pointer font-normal">
                                        {name}
                                    </Label>
                                </div>
                            ))}

                            <div className="border rounded-md p-3 bg-muted/20">
                                <div className="flex items-center space-x-2 mb-2">
                                    <RadioGroupItem value="custom" id="target-custom" />
                                    <Label htmlFor="target-custom" className="font-normal cursor-pointer">
                                        Custom name
                                    </Label>
                                </div>
                                <Input
                                    placeholder="Enter a new name"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    disabled={targetNameSelection !== "custom"}
                                    onClick={() => setTargetNameSelection("custom")}
                                    className="bg-background"
                                />
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleMerge}
                        disabled={isMerging || selectedSources.length === 0 || (targetNameSelection === 'custom' && !customName)}
                        className="bg-emerald-400 hover:bg-emerald-500 text-white"
                    >
                        {isMerging ? "Merging..." : "Merge"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
