import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { BudgetInsight } from "@/components/Budgets/types";
import type { PaymentReminder } from "@/types";

interface BudgetInsightsPanelProps {
    alerts: BudgetInsight[];
    payments: PaymentReminder[];
    totalUpcoming: number;
    formatCurrency: (value: number) => string;
}

export function BudgetInsightsPanel({
    alerts,
    payments,
    totalUpcoming,
    formatCurrency,
}: BudgetInsightsPanelProps) {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Budget insights</CardTitle>
                    <CardDescription>
                        Flags categories that need attention right now.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {alerts.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            All monitored budgets are within their plan.
                        </p>
                    )}
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="border-b border-dashed border-border pb-3 last:border-0 last:pb-0"
                        >
                            <div className="flex items-center justify-between gap-2 text-sm font-semibold">
                                <span>{alert.label}</span>
                                <Badge
                                    variant={
                                        alert.status === "exceeded"
                                            ? "destructive"
                                            : "secondary"
                                    }
                                    className={
                                        alert.status === "at-risk"
                                            ? "rounded-full text-amber-600 dark:text-amber-400"
                                            : "rounded-full"
                                    }
                                >
                                    {alert.status === "exceeded"
                                        ? "Exceeded"
                                        : "At risk"}
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {alert.status === "exceeded"
                                    ? `Over plan by ${formatCurrency(Math.abs(alert.variance))}. Reassign from lower priority categories.`
                                    : `Only ${formatCurrency(alert.variance)} remaining before the limit of ${formatCurrency(alert.limit)}.`}
                            </p>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Upcoming payments</CardTitle>
                    <CardDescription>
                        Track due dates so automatic debits stay funded.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-xl border border-dashed px-3 py-2 text-sm font-medium">
                        Total upcoming: {formatCurrency(totalUpcoming)}
                    </div>
                    {payments.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No pending charges during this period.
                        </p>
                    )}
                    {payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="flex flex-col gap-1 rounded-lg border p-3 text-sm"
                        >
                            <div className="flex items-center justify-between gap-2 font-medium">
                                <span>{payment.name}</span>
                                <span>{formatCurrency(payment.amount)}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                                <span>
                                    Due{" "}
                                    {format(
                                        new Date(payment.dueDate),
                                        "MMM d"
                                    )}
                                </span>
                                <span>·</span>
                                <span>{payment.category}</span>
                                {payment.autoPay && (
                                    <>
                                        <span>·</span>
                                        <Badge
                                            variant="outline"
                                            className="rounded-full text-xs uppercase tracking-wide"
                                        >
                                            Auto pay
                                        </Badge>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
