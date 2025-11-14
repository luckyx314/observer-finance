import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import SelectComponent from "@/components/Select/SelectComponent";
import { DatePickerComponent } from "@/components/DatePicker/DatePicker";
import { categories, transactionType } from "@/STATIC_DATA/STATIC_DATA";
import { useState } from "react";
import { transactionAPI } from "@/services/api";
import { TransactionType, TransactionStatus } from "@/types";
import { toast } from "sonner";

interface AddSpendingDialogProps {
    label?: string;
    icon?: React.ReactNode;
    onSuccess?: () => void;
}

const AddTransactionDialog = ({
    label = "Add Transaction",
    icon = <IconCirclePlusFilled />,
    onSuccess,
}: AddSpendingDialogProps) => {
    const [title, setTitle] = useState("Transaction");
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [category, setCategory] = useState("");
    const [merchant, setMerchant] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleTypeChange = (value: string) => {
        setTitle(value);
        setType(value as TransactionType);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
    };

    const handleDateChange = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const resetForm = () => {
        setTitle("Transaction");
        setType(TransactionType.EXPENSE);
        setCategory("");
        setMerchant("");
        setAmount("");
        setDate(new Date());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!merchant || !category || !amount || !type) {
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
            await transactionAPI.create({
                merchant,
                category,
                type,
                status: TransactionStatus.DONE,
                amount: amountNum,
                date: date.toISOString().split("T")[0],
            });

            toast.success("Transaction created successfully!");
            resetForm();
            setOpen(false);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error("Failed to create transaction:", error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to create transaction. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SidebarMenuButton
                    tooltip={label}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                    {icon}
                    <span>{label}</span>
                </SidebarMenuButton>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Add {title}</DialogTitle>
                        <DialogDescription>
                            Add a new transaction to be tracked.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="merchant-1">Transaction Type</Label>
                            <SelectComponent
                                items={transactionType}
                                label="Transaction Type"
                                onChange={handleTypeChange}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5 w-full">
                            <div className="flex flex-col gap-3 flex-1">
                                <Label htmlFor="category-1">Category</Label>
                                <SelectComponent
                                    items={categories}
                                    label="Category"
                                    onChange={handleCategoryChange}
                                />
                            </div>

                            <div className="flex flex-col gap-3 flex-1">
                                <Label htmlFor="date-picker-1">Date</Label>
                                <DatePickerComponent onDateChange={handleDateChange} />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="merchant-1">Merchant</Label>
                            <Input
                                id="merchant-1"
                                name="merchant"
                                placeholder="ex. Jollibee"
                                value={merchant}
                                onChange={(e) => setMerchant(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="amount-1">Amount</Label>
                            <Input
                                id="amount-1"
                                name="amount"
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Transaction"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTransactionDialog;
