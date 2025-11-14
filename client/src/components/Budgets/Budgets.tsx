import { useEffect, useMemo, useState } from "react";
import type { Icon } from "@tabler/icons-react";
import {
    IconBook,
    IconCalendarEvent,
    IconCar,
    IconCreditCard,
    IconHeart,
    IconHome,
    IconMovie,
    IconPlus,
    IconShoppingCart,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { AppSidebar } from "@/components/Dashboard/components/app-sidebar";
import { SiteHeader } from "@/components/Dashboard/components/site-header";
import { BudgetSummaryCards } from "@/components/Budgets/components/BudgetSummaryCards";
import { BudgetCategoryList } from "@/components/Budgets/components/BudgetCategoryList";
import { BudgetInsightsPanel } from "@/components/Budgets/components/BudgetInsightsPanel";
import { BudgetEntryForm } from "@/components/Budgets/components/BudgetEntryForm";
import { PaymentReminderForm } from "@/components/Budgets/components/PaymentReminderForm";
import type {
    BudgetInsight,
    ComputedBudget,
    BudgetFormInput,
    PaymentReminderInput,
} from "@/components/Budgets/types";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { budgetAPI, paymentReminderAPI, transactionAPI } from "@/services/api";
import type { Budget, PaymentReminder, Transaction } from "@/types";

const CATEGORY_ICON_MAP: Record<string, Icon> = {
    Food: IconShoppingCart,
    Transportation: IconCar,
    Bills: IconCreditCard,
    Utilities: IconHome,
    Healthcare: IconHeart,
    Entertainment: IconMovie,
    Education: IconBook,
};

const resolveCategoryIcon = (category: string) =>
    CATEGORY_ICON_MAP[category] || IconShoppingCart;

export default function Budgets() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [budgetEntries, setBudgetEntries] = useState<Budget[]>([]);
    const [payments, setPayments] = useState<PaymentReminder[]>([]);
    const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [transactionsData, budgetsData, paymentsData] = await Promise.all([
                    transactionAPI.getAll(),
                    budgetAPI.getAll(),
                    paymentReminderAPI.getAll(),
                ]);
                setTransactions(transactionsData);
                setBudgetEntries(budgetsData);
                setPayments(paymentsData);
            } catch (error) {
                console.error("Failed to load budgets context:", error);
                toast.error("Unable to load budgets data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fallbackMonth = useMemo(
        () => format(new Date(), "yyyy-MM"),
        []
    );

    const monthOptions = useMemo(() => {
        const monthSet = new Set<string>();
        transactions.forEach((transaction) => {
            const key = format(new Date(transaction.date), "yyyy-MM");
            monthSet.add(key);
        });

        if (monthSet.size === 0) {
            monthSet.add(fallbackMonth);
        }

        return Array.from(monthSet)
            .sort((a, b) => b.localeCompare(a))
            .map((key) => ({
                value: key,
                label: format(new Date(`${key}-01T00:00:00`), "MMMM yyyy"),
            }));
    }, [transactions, fallbackMonth]);

    useEffect(() => {
        if (!selectedMonth && monthOptions.length) {
            setSelectedMonth(monthOptions[0].value);
        }
    }, [monthOptions, selectedMonth]);

    const periodLabel = useMemo(() => {
        if (!selectedMonth || selectedMonth === "all") {
            return "All time";
        }

        try {
            return format(new Date(`${selectedMonth}-01T00:00:00`), "MMMM yyyy");
        } catch {
            return "All time";
        }
    }, [selectedMonth]);

    const expenseTransactions = useMemo(() => {
        const expensesOnly = transactions.filter(
            (transaction) => transaction.type === "Expense"
        );

        if (!selectedMonth || selectedMonth === "all") {
            return expensesOnly;
        }

        return expensesOnly.filter(
            (transaction) =>
                format(new Date(transaction.date), "yyyy-MM") === selectedMonth
        );
    }, [transactions, selectedMonth]);

    const expensesByCategory = useMemo(() => {
        return expenseTransactions.reduce<Record<string, number>>(
            (acc, transaction) => {
                const key = transaction.category;
                acc[key] = (acc[key] || 0) + transaction.amount;
                return acc;
            },
            {}
        );
    }, [expenseTransactions]);

    const computedBudgets = useMemo<ComputedBudget[]>(() => {
        return budgetEntries.map((budget) => {
            const spent = expensesByCategory[budget.category] || 0;
            const variance = budget.limit - spent;
            const utilization =
                budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

            let status: ComputedBudget["status"] = "on-track";
            if (variance < 0) {
                status = "exceeded";
            } else if (utilization >= 80) {
                status = "at-risk";
            }

            return {
                ...budget,
                icon: resolveCategoryIcon(budget.category),
                spent,
                variance,
                utilization,
                status,
            };
        });
    }, [expensesByCategory, budgetEntries]);

    const totals = useMemo(() => {
        const allocated = computedBudgets.reduce(
            (sum, budget) => sum + budget.limit,
            0
        );
        const spent = computedBudgets.reduce(
            (sum, budget) => sum + budget.spent,
            0
        );
        const remaining = allocated - spent;
        const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;
        const categoriesOnTrack = computedBudgets.filter(
            (budget) => budget.status === "on-track"
        ).length;

        return {
            allocated,
            spent,
            remaining,
            utilization,
            categoriesOnTrack,
            categoriesTotal: computedBudgets.length,
        };
    }, [computedBudgets]);

    const alerts = useMemo<BudgetInsight[]>(() => {
        return computedBudgets
            .filter((budget) => budget.status !== "on-track")
            .map((budget) => ({
                id: budget.id,
                label: budget.label,
                status: budget.status === "exceeded" ? "exceeded" : "at-risk",
                variance: budget.variance,
                limit: budget.limit,
            }));
    }, [computedBudgets]);

    const scopedPayments = useMemo(() => {
        if (!selectedMonth || selectedMonth === "all") {
            return payments;
        }

        return payments.filter(
            (payment) =>
                format(new Date(payment.dueDate), "yyyy-MM") === selectedMonth
        );
    }, [payments, selectedMonth]);

    const totalUpcomingPayments = useMemo(
        () => scopedPayments.reduce((sum, payment) => sum + payment.amount, 0),
        [scopedPayments]
    );

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(value);

    const resolvedSelectValue =
        selectedMonth || monthOptions[0]?.value || "all";

    const handleAddBudgetEntry = async (input: BudgetFormInput) => {
        try {
            const created = await budgetAPI.create(input);
            setBudgetEntries((previous) => [...previous, created]);
            toast.success("Budget allocation saved");
            return true;
        } catch (error) {
            console.error("Failed to create budget", error);
            toast.error("Unable to save budget, please try again.");
            return false;
        }
    };

    const handleAddPayment = async (input: PaymentReminderInput) => {
        try {
            const created = await paymentReminderAPI.create(input);
            setPayments((previous) => [...previous, created]);
            toast.success("Payment reminder saved");
            return true;
        } catch (error) {
            console.error("Failed to create payment reminder", error);
            toast.error("Unable to save reminder, please try again.");
            return false;
        }
    };

    const handleDeleteBudget = async (id: number) => {
        try {
            await budgetAPI.remove(id);
            setBudgetEntries((previous) =>
                previous.filter((budget) => budget.id !== id)
            );
            toast.success("Budget removed");
        } catch (error) {
            console.error("Failed to remove budget", error);
            toast.error("Unable to delete budget");
        }
    };

    return (
        <>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader headerTitle="Budgets" />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <div className="flex flex-col gap-4 rounded-2xl border bg-card/60 p-4 shadow-sm">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="text-sm font-medium">
                                                Budget period
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Scopes spend, insights, and reminders.
                                            </p>
                                        </div>
                                        <Select
                                            value={resolvedSelectValue}
                                            onValueChange={setSelectedMonth}
                                        >
                                            <SelectTrigger className="w-full md:w-[220px]" size="sm">
                                                <SelectValue placeholder="Select month" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {monthOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="rounded-lg"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="all" className="rounded-lg">
                                                    All time
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            onClick={() => setBudgetDialogOpen(true)}
                                            size="sm"
                                            className="gap-2"
                                        >
                                            <IconPlus className="size-4" />
                                            Add budget
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setPaymentDialogOpen(true)}
                                            size="sm"
                                            className="gap-2"
                                        >
                                            <IconCalendarEvent className="size-4" />
                                            Schedule payment
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {loading ? (
                                <div className="flex flex-1 items-center justify-center">
                                    <div className="text-center">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
                                        <p className="mt-4 text-sm text-muted-foreground">
                                            Loading budgets…
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <BudgetSummaryCards
                                        periodLabel={periodLabel}
                                        totals={totals}
                                        formatCurrency={formatCurrency}
                                    />
                                    <div className="grid gap-4 px-4 lg:px-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                                        <BudgetCategoryList
                                            budgets={computedBudgets}
                                            periodLabel={periodLabel}
                                            formatCurrency={formatCurrency}
                                            onDeleteBudget={handleDeleteBudget}
                                        />
                                        <BudgetInsightsPanel
                                            alerts={alerts}
                                            payments={scopedPayments}
                                            totalUpcoming={totalUpcomingPayments}
                                            formatCurrency={formatCurrency}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
            <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>New budget allocation</DialogTitle>
                        <DialogDescription>
                            Add a category limit to track alongside your other budgets.
                        </DialogDescription>
                    </DialogHeader>
                    <BudgetEntryForm
                        onSubmit={handleAddBudgetEntry}
                        onSuccess={() => setBudgetDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Schedule payment reminder</DialogTitle>
                        <DialogDescription>
                            Keep tabs on upcoming charges and automatic debits.
                        </DialogDescription>
                    </DialogHeader>
                    <PaymentReminderForm
                        onSubmit={handleAddPayment}
                        onSuccess={() => setPaymentDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
