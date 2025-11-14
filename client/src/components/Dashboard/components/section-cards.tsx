import { IconTrendingUp } from "@tabler/icons-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Transaction } from "@/types";

interface SectionCardsProps {
    transactions: Transaction[];
    periodLabel: string;
}

export function SectionCards({ transactions, periodLabel }: SectionCardsProps) {
    const stats = useMemo(() => {
        const totalExpenses = transactions
            .filter((t) => t.type === "Expense")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalIncome = transactions
            .filter((t) => t.type === "Income")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalSavings = transactions
            .filter((t) => t.type === "Savings")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalInvestments = transactions
            .filter((t) => t.type === "Investment")
            .reduce((sum, t) => sum + t.amount, 0);

        const netWorth = totalIncome + totalSavings + totalInvestments - totalExpenses;

        const transactionCount = transactions.length;

        return {
            totalExpenses,
            totalIncome,
            totalSavings,
            totalInvestments,
            netWorth,
            transactionCount,
        };
    }, [transactions]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>
                        Total Expenses · {periodLabel}
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-all">
                        {formatCurrency(stats.totalExpenses)}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                            <IconTrendingUp className="text-muted-foreground size-3" />
                            <span className="text-muted-foreground">
                                {transactions.filter((t) => t.type === "Expense").length} transactions
                            </span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Spending overview
                    </div>
                    <div className="text-muted-foreground">
                        {periodLabel === "All time"
                            ? `From ${stats.transactionCount} recorded transactions`
                            : `From ${stats.transactionCount} transactions in ${periodLabel}`}
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>
                        Total Income · {periodLabel}
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-all">
                        {formatCurrency(stats.totalIncome)}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                            <IconTrendingUp className="text-green-600/60 dark:text-green-400/60 size-3" />
                            <span className="text-green-600/60 dark:text-green-400/60">
                                {transactions.filter((t) => t.type === "Income").length} transactions
                            </span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Revenue snapshot{" "}
                        <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        {periodLabel === "All time"
                            ? "Across all sources"
                            : `For ${periodLabel}`}
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>
                        Total Savings · {periodLabel}
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-all">
                        {formatCurrency(stats.totalSavings)}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                            <IconTrendingUp className="text-green-600/60 dark:text-green-400/60 size-3" />
                            <span className="text-green-600/60 dark:text-green-400/60">
                                {transactions.filter((t) => t.type === "Savings").length} transactions
                            </span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Building wealth{" "}
                        <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        {periodLabel === "All time"
                            ? "Saved for the future"
                            : `Saved during ${periodLabel}`}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
