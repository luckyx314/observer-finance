import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import type { ComputedBudget } from "@/components/Budgets/types";
import { IconTrash } from "@tabler/icons-react";

interface BudgetCategoryListProps {
    budgets: ComputedBudget[];
    periodLabel: string;
    formatCurrency: (value: number) => string;
    onDeleteBudget?: (budget: ComputedBudget) => void | Promise<void>;
}

export function BudgetCategoryList({
    budgets,
    periodLabel,
    formatCurrency,
    onDeleteBudget,
}: BudgetCategoryListProps) {
    const sortedBudgets = [...budgets].sort(
        (a, b) => b.utilization - a.utilization
    );

    const resolveStatusBadge = (status: ComputedBudget["status"]) => {
        if (status === "exceeded") {
            return (
                <Badge variant="destructive" className="rounded-full">
                    Exceeded
                </Badge>
            );
        }

        if (status === "at-risk") {
            return (
                <Badge
                    variant="secondary"
                    className="rounded-full text-amber-600 dark:text-amber-400"
                >
                    At risk
                </Badge>
            );
        }

        return (
            <Badge
                variant="outline"
                className="rounded-full text-emerald-600 dark:text-emerald-400"
            >
                On track
            </Badge>
        );
    };

    const getProgressColor = (status: ComputedBudget["status"]) => {
        switch (status) {
            case "exceeded":
                return "bg-destructive";
            case "at-risk":
                return "bg-amber-500 dark:bg-amber-400";
            default:
                return "bg-emerald-500 dark:bg-emerald-400";
        }
    };

    return (
        <div className="space-y-4">
            {sortedBudgets.map((budget) => {
                const Icon = budget.icon;
                const clampedProgress = Math.min(budget.utilization, 100);
                const varianceLabel =
                    budget.variance >= 0
                        ? `${formatCurrency(budget.variance)} left`
                        : `${formatCurrency(Math.abs(budget.variance))} over`;

                return (
                    <Card key={budget.id} className="flex flex-col gap-4">
                        <CardHeader className="gap-2 sm:flex-row sm:items-center">
                            <div className="flex flex-col gap-1">
                                <CardTitle className="text-base font-semibold">
                                    {budget.label}
                                </CardTitle>
                                <CardDescription>
                                    {budget.description} · {periodLabel}
                                </CardDescription>
                            </div>
                            <div className="sm:ml-auto sm:flex sm:items-center sm:gap-3 sm:text-right">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-9 items-center justify-center rounded-full border bg-muted/50">
                                        <Icon className="size-4 text-muted-foreground" />
                                    </div>
                                    {resolveStatusBadge(budget.status)}
                                </div>
                                {onDeleteBudget && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onDeleteBudget(budget)}
                                        aria-label={`Delete ${budget.label} budget`}
                                        className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        <IconTrash className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
                                <div>
                                    {formatCurrency(budget.spent)}{" "}
                                    <span className="text-muted-foreground font-normal">
                                        of {formatCurrency(budget.limit)}
                                    </span>
                                </div>
                                <div className="text-muted-foreground">
                                    {varianceLabel}
                                </div>
                            </div>
                            <div className="h-2 rounded-full bg-muted">
                                <div
                                    className={`h-full rounded-full transition-[width] ${getProgressColor(budget.status)}`}
                                    style={{ width: `${clampedProgress}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
