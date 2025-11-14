import { useMemo, useState } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories } from "@/STATIC_DATA/STATIC_DATA";
import type { PaymentReminderInput } from "@/components/Budgets/types";
import { toast } from "sonner";

interface PaymentReminderFormProps {
    onSubmit: (input: PaymentReminderInput) => Promise<boolean>;
    onSuccess?: () => void;
}

export function PaymentReminderForm({
    onSubmit,
    onSuccess,
}: PaymentReminderFormProps) {
    const fallbackCategory = categories[0] ?? "";
    const [name, setName] = useState("");
    const [category, setCategory] = useState(fallbackCategory);
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [autoPay, setAutoPay] = useState(true);
    const [saving, setSaving] = useState(false);

    const minDate = useMemo(
        () => format(new Date(), "yyyy-MM-dd"),
        []
    );

    const resetForm = () => {
        setName("");
        setCategory(fallbackCategory);
        setAmount("");
        setDueDate("");
        setAutoPay(true);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const parsedAmount = Number(amount);
        if (!name.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error("Please provide a valid name and amount.");
            return;
        }
        if (!dueDate) {
            toast.error("Please choose a due date.");
            return;
        }

        setSaving(true);
        try {
            const saved = await onSubmit({
                name: name.trim(),
                category,
                amount: parsedAmount,
                dueDate,
                autoPay,
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
                <Label htmlFor="payment-name">Name</Label>
                <Input
                    id="payment-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Condo dues"
                    autoFocus
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="payment-category">Category</Label>
                <select
                    id="payment-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {categories.map((categoryOption) => (
                        <option key={categoryOption} value={categoryOption}>
                            {categoryOption}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="payment-amount">Amount (PHP)</Label>
                    <Input
                        id="payment-amount"
                        type="number"
                        min="0"
                        step="100"
                        inputMode="decimal"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        placeholder="2500"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="payment-date">Due date</Label>
                    <Input
                        id="payment-date"
                        type="date"
                        value={dueDate}
                        min={minDate}
                        onChange={(event) => setDueDate(event.target.value)}
                        required
                    />
                </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
                <input
                    type="checkbox"
                    checked={autoPay}
                    onChange={(event) => setAutoPay(event.target.checked)}
                    className="size-4 rounded border border-input"
                />
                Enable auto-pay flag
            </label>
            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save reminder"}
                </Button>
            </div>
        </form>
    );
}
