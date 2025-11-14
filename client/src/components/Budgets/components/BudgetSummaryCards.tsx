import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface BudgetSummaryCardsProps {
    periodLabel: string;
    totals: {
        allocated: number;
        spent: number;
        remaining: number;
        utilization: number;
        categoriesOnTrack: number;
        categoriesTotal: number;
    };
    formatCurrency: (value: number) => string;
}

export function BudgetSummaryCards({
    periodLabel,
    totals,
    formatCurrency,
}: BudgetSummaryCardsProps) {
    const utilizationLabel = `${totals.utilization.toFixed(0)}% utilized`;

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card @xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-b *:data-[slot=card]:shadow-xs lg:px-6 @md/main:grid-cols-2">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Planned budget · {periodLabel}</CardDescription>
                    <CardTitle className="text-3xl font-semibold tabular-nums">
                        {formatCurrency(totals.allocated)}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="rounded-full">
                            {totals.categoriesTotal} categories
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
                    <p>Baseline allocation for recurring categories.</p>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>
                        Actual spend · {periodLabel}
                    </CardDescription>
                    <CardTitle className="text-3xl font-semibold tabular-nums">
                        {formatCurrency(totals.spent)}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="secondary" className="rounded-full">
                            {utilizationLabel}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
                    <p>Includes all expense transactions scoped to the month.</p>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Available buffer</CardDescription>
                    <CardTitle className="text-3xl font-semibold tabular-nums">
                        {formatCurrency(Math.max(totals.remaining, 0))}
                    </CardTitle>
                    <CardAction>
                        <Badge
                            variant="outline"
                            className="rounded-full text-emerald-600 dark:text-emerald-400"
                        >
                            {totals.categoriesOnTrack} on track
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
                    <p>
                        Buffer before the plan is exhausted. Reassign from lower priority
                        budgets if needed.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
