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
import { Label } from "@/components/ui/label"; // ✅ use shadcn’s label wrapper
import { IconCirclePlusFilled } from "@tabler/icons-react";
import SelectCategory from "@/components/Select/SelectCategory";
import { DatePickerComponent } from "@/components/DatePicker/DatePicker";

interface AddSpendingDialogProps {
    label?: string;
    icon?: React.ReactNode;
}

const AddExpenseDialog = ({
    label = "Add Expense",
    icon = <IconCirclePlusFilled />,
}: AddSpendingDialogProps) => {
    return (
        <Dialog>
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
                <form className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Add Expense</DialogTitle>
                        <DialogDescription>
                            Add a new expense to be tracked.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="flex gap-5">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="category-1">Category</Label>
                                <SelectCategory />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="date-picker-1">Date</Label>
                                <DatePickerComponent />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="merchant-1">Merchant</Label>
                            <Input
                                id="merchant-1"
                                name="merchant"
                                defaultValue="Jollibee"
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="amount-1">Amount</Label>
                            <Input
                                id="amount-1"
                                name="amount"
                                defaultValue="0.00"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Add expense</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddExpenseDialog;
