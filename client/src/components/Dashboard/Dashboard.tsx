import { AppSidebar } from "@/components/Dashboard/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/Dashboard/components/chart-area-interactive";
import { DataTable } from "@/components/Dashboard/components/DataTable/DataTable";
import { SectionCards } from "@/components/Dashboard/components/section-cards";
import { SiteHeader } from "@/components/Dashboard/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { transactionAPI } from "@/services/api";
import type { Transaction } from "@/types";
import { toast } from "sonner";

export default function Dashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

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
                            <SectionCards transactions={transactions} />
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
