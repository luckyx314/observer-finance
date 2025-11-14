import { AppSidebar } from "@/components/Dashboard/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/Dashboard/components/chart-area-interactive";
import { ChartBarMonthly } from "@/components/Dashboard/components/chart-bar-monthly";
import { ChartPieCategory } from "@/components/Dashboard/components/chart-pie-category";
import { DataTable } from "@/components/Dashboard/components/DataTable/DataTable";
import { SectionCards } from "@/components/Dashboard/components/section-cards";
import { WalletManager } from "@/components/Dashboard/components/wallet-manager";
import { SiteHeader } from "@/components/Dashboard/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { transactionAPI } from "@/services/api";
import type { Transaction } from "@/types";
import { toast } from "sonner";

export default function Dashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<string>("");

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await transactionAPI.getAll();
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            toast.error("Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const monthOptions = useMemo(() => {
        const monthSet = new Set<string>();
        transactions.forEach((transaction) => {
            const key = format(new Date(transaction.date), "yyyy-MM");
            monthSet.add(key);
        });

        return Array.from(monthSet)
            .sort((a, b) => b.localeCompare(a))
            .map((key) => ({
                value: key,
                label: format(new Date(`${key}-01T00:00:00`), "MMMM yyyy"),
            }));
    }, [transactions]);

    useEffect(() => {
        if (!selectedMonth && monthOptions.length) {
            setSelectedMonth(monthOptions[0].value);
        }
    }, [monthOptions, selectedMonth]);

    const scopedTransactions = useMemo(() => {
        if (!selectedMonth || selectedMonth === "all") {
            return transactions;
        }

        return transactions.filter(
            (transaction) =>
                format(new Date(transaction.date), "yyyy-MM") === selectedMonth
        );
    }, [transactions, selectedMonth]);

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

    const resolvedSelectValue =
        selectedMonth || monthOptions[0]?.value || "all";

    const comparisonInitialMonth =
        selectedMonth && selectedMonth !== "all"
            ? selectedMonth
            : monthOptions[0]?.value;

    const handleTransactionCreated = () => {
        fetchTransactions();
        toast.success("Transaction created successfully!");
    };

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar
                variant="inset"
                onTransactionCreated={handleTransactionCreated}
            />
            <SidebarInset>
                <SiteHeader headerTitle="Dashboard" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <div className="flex flex-col gap-2 rounded-2xl border bg-card/60 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Data scope</p>
                                        <p className="text-xs text-muted-foreground">
                                            Controls cards and category charts
                                        </p>
                                    </div>
                                    <Select
                                        value={resolvedSelectValue}
                                        onValueChange={setSelectedMonth}
                                    >
                                        <SelectTrigger className="w-full sm:w-[220px]" size="sm">
                                            <SelectValue placeholder="Select period" />
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
                            </div>
                            <SectionCards
                                transactions={scopedTransactions}
                                periodLabel={periodLabel}
                            />
                            <div className="px-4 lg:px-6">
                                <WalletManager />
                            </div>
                            <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-6">
                                <ChartPieCategory
                                    transactions={scopedTransactions}
                                    type="Expense"
                                    periodLabel={periodLabel}
                                />
                                <ChartPieCategory
                                    transactions={scopedTransactions}
                                    type="Income"
                                    periodLabel={periodLabel}
                                />
                                <ChartBarMonthly
                                    transactions={transactions}
                                    monthOptions={monthOptions}
                                    initialMonth={comparisonInitialMonth}
                                />
                            </div>
                            <div className="px-4 lg:px-6">
                                <ChartAreaInteractive transactions={transactions} />
                            </div>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-center">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                        <p className="mt-4 text-muted-foreground">Loading transactions...</p>
                                    </div>
                                </div>
                            ) : (
                                <DataTable
                                    data={transactions}
                                    onRefresh={fetchTransactions}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
