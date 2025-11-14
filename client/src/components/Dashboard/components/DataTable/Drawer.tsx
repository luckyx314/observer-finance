import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { categoryByType, transactionType, fieldLabelsByType } from "@/STATIC_DATA/STATIC_DATA";
import type { Transaction, TransactionStatus, TransactionType as TransactionTypeEnum } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { transactionAPI } from "@/services/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { DatePickerComponent } from "@/components/DatePicker/DatePicker";

interface TableCellViewerProps {
    item: Transaction;
    onUpdate?: () => void;
    externalOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function TableCellViewer({
    item,
    onUpdate,
    externalOpen,
    onOpenChange,
}: TableCellViewerProps) {
    const isMobile = useIsMobile();

    // Form state
    const [selectedType, setSelectedType] = useState<TransactionTypeEnum>(item.type);
    const [merchant, setMerchant] = useState(item.merchant);
    const [category, setCategory] = useState(item.category);
    const [status, setStatus] = useState(item.status);
    const [amount, setAmount] = useState(item.amount.toString());
    const [date, setDate] = useState<Date>(new Date(item.date));
    const [loading, setLoading] = useState(false);
    const [internalOpen, setInternalOpen] = useState(false);

    // Use external open state if provided, otherwise use internal
    const open = externalOpen !== undefined ? externalOpen : internalOpen;
    const setOpen = (value: boolean) => {
        if (onOpenChange) {
            onOpenChange(value);
        } else {
            setInternalOpen(value);
        }
    };

    // Get categories based on selected transaction type
    const currentCategories = useMemo(() => {
        return categoryByType[selectedType as keyof typeof categoryByType] || categoryByType.Expense;
    }, [selectedType]);

    // Get dynamic field labels based on transaction type
    const fieldLabels = useMemo(() => {
        return fieldLabelsByType[selectedType as keyof typeof fieldLabelsByType] || fieldLabelsByType.Expense;
    }, [selectedType]);

    // Reset form when drawer opens or item changes
    useEffect(() => {
        if (open) {
            setSelectedType(item.type);
            setMerchant(item.merchant);
            setCategory(item.category);
            setStatus(item.status);
            setAmount(item.amount.toString());
            setDate(new Date(item.date));
        }
    }, [open, item]);

    // Reset category when type changes if current category is not in new type's categories
    const handleTypeChange = (newType: TransactionTypeEnum) => {
        setSelectedType(newType);
        if (!currentCategories.includes(category)) {
            setCategory("");
        }
    };

    const handleDateChange = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!merchant || !category || !amount || !selectedType || !date) {
            toast.error("Please fill in all required fields");
            return;
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setLoading(true);

        try {
            await transactionAPI.update(item.id, {
                merchant,
                category,
                type: selectedType,
                status,
                amount: amountNum,
                date: date.toISOString().split("T")[0],
            });

            toast.success("Transaction updated successfully!");
            setOpen(false);
            if (onUpdate) {
                onUpdate();
            }
        } catch (error: any) {
            console.error("Failed to update transaction:", error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to update transaction. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="link"
                    className="w-fit px-0 text-left text-foreground"
                >
                    {merchant}
                </Button>
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{merchant}</DrawerTitle>
                    <DrawerDescription>
                        Edit transaction details
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <div className="grid gap-2 rounded-lg bg-muted p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Transaction ID:</span>
                            <span className="font-medium">#{item.id}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Created:</span>
                            <span className="font-medium">
                                {format(new Date(item.createdAt), "PPp")}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Last Updated:</span>
                            <span className="font-medium">
                                {format(new Date(item.updatedAt), "PPp")}
                            </span>
                        </div>
                    </div>

                    <Separator />

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="transaction-type">Transaction Type</Label>
                            <Select
                                value={selectedType}
                                onValueChange={(value) => handleTypeChange(value as TransactionTypeEnum)}
                                disabled={loading}
                            >
                                <SelectTrigger id="transaction-type" className="w-full">
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {transactionType.map((type) => (
                                        <SelectItem
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="merchant">{fieldLabels.merchant}</Label>
                            <Input
                                id="merchant"
                                value={merchant}
                                onChange={(e) => setMerchant(e.target.value)}
                                placeholder={fieldLabels.merchantPlaceholder}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={category}
                                    onValueChange={setCategory}
                                    disabled={loading}
                                >
                                    <SelectTrigger id="category" className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currentCategories.map((cat) => (
                                            <SelectItem
                                                key={cat}
                                                value={cat}
                                            >
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={status}
                                    onValueChange={(value) => setStatus(value as TransactionStatus)}
                                    disabled={loading}
                                >
                                    <SelectTrigger
                                        id="status"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Done">
                                            Done
                                        </SelectItem>
                                        <SelectItem value="In Process">
                                            In Process
                                        </SelectItem>
                                        <SelectItem value="Pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="Cancelled">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="date">Date</Label>
                            <DatePickerComponent
                                onDateChange={handleDateChange}
                                defaultDate={date}
                            />
                        </div>
                    </form>
                </div>

                <DrawerFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" disabled={loading}>
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
