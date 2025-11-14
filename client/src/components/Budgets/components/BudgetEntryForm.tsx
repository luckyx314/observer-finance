import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories } from "@/STATIC_DATA/STATIC_DATA";
import type { BudgetFormInput } from "@/components/Budgets/types";

const expenseCategories = categories;

interface BudgetEntryFormProps {
    onSubmit: (input: BudgetFormInput) => Promise<boolean>;
    onSuccess?: () => void;
}

export function BudgetEntryForm({ onSubmit, onSuccess }: BudgetEntryFormProps) {
    const [label, setLabel] = useState("");
    const [category, setCategory] = useState(expenseCategories[0] ?? "");
    const [limit, setLimit] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    const resetForm = () => {
        setLabel("");
        setCategory(expenseCategories[0] ?? "");
        setLimit("");
        setDescription("");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsedLimit = Number(limit);
        if (!label.trim() || !category || Number.isNaN(parsedLimit) || parsedLimit <= 0) {
            return;
        }

        setSaving(true);
        try {
            const saved = await onSubmit({
                label: label.trim(),
                category,
                limit: parsedLimit,
                description: description.trim() || undefined,
            });

            if (saved) {
                resetForm();
                onSuccess?.();
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
                <Label htmlFor="budget-label">Label</Label>
                <Input
                    id="budget-label"
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                    placeholder="e.g. Transportation"
                    autoFocus
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="budget-category">Category</Label>
                <select
                    id="budget-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {expenseCategories.map((categoryOption) => (
                        <option key={categoryOption} value={categoryOption}>
                            {categoryOption}
                        </option>
                    ))}
                </select>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="budget-limit">Limit (PHP)</Label>
                <Input
                    id="budget-limit"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={limit}
                    onChange={(event) => setLimit(event.target.value)}
                    placeholder="5000"
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="budget-description">Description</Label>
                <Input
                    id="budget-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Optional notes"
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save budget"}
                </Button>
            </div>
        </form>
    );
}
