"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useCreateCategory } from "@/hooks/use-categories";
import { useState } from "react";
import { toast } from "sonner";

export function AddCategoryForm() {
    const [name, setName] = useState("");
    const createCategory = useCreateCategory();

    const handleCreate = async () => {
        if (!name) {
            toast.error("Please enter a category name");
            return;
        }

        try {
            await createCategory.mutateAsync({ name });
            toast.success("Category created successfully");
            setName("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create category");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <Input
                            placeholder="e.g., Utilities"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-muted/50"
                        />
                    </div>
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                        onClick={handleCreate}
                        disabled={createCategory.isPending}
                    >
                        {createCategory.isPending ? "Creating..." : "Create"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
