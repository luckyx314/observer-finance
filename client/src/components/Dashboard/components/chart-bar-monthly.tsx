"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { Transaction } from "@/types";

interface MonthOption {
    value: string;
    label: string;
}

interface ChartBarMonthlyProps {
    transactions: Transaction[];
    monthOptions: MonthOption[];
    initialMonth?: string;
}

const chartConfig = {
    income: {
        label: "Income",
        color: "hsl(200, 70%, 60%)",
    },
    expenses: {
        label: "Expenses",
        color: "hsl(285, 65%, 52%)",
    },
    savings: {
        label: "Savings",
        color: "hsl(160, 70%, 45%)",
    },
} satisfies ChartConfig;

export function ChartBarMonthly({
    transactions,
    monthOptions,
    initialMonth,
}: ChartBarMonthlyProps) {
    const [selectedMonth, setSelectedMonth] = React.useState<string>(() => {
        if (initialMonth && initialMonth !== "all") {
            return initialMonth;
        }
        return monthOptions[0]?.value || "";
    });

    React.useEffect(() => {
        if (!selectedMonth && monthOptions.length) {
            setSelectedMonth(monthOptions[0].value);
        }
    }, [selectedMonth, monthOptions]);

    React.useEffect(() => {
        if (initialMonth && initialMonth !== "all") {
            setSelectedMonth(initialMonth);
        }
    }, [initialMonth]);

    const monthlyTotals = React.useMemo(() => {
        const totals = new Map<
            string,
            { income: number; expenses: number; savings: number }
        >();

        transactions.forEach((transaction) => {
            const monthKey = format(new Date(transaction.date), "yyyy-MM");
            const existing = totals.get(monthKey) || {
                income: 0,
                expenses: 0,
                savings: 0,
            };

            if (transaction.type === "Income") {
                existing.income += transaction.amount;
            } else if (transaction.type === "Expense") {
                existing.expenses += transaction.amount;
            } else if (transaction.type === "Savings") {
                existing.savings += transaction.amount;
            }

            totals.set(monthKey, existing);
        });

        return totals;
    }, [transactions]);

    const monthlyData = React.useMemo(() => {
        if (!selectedMonth) {
            return {
                totals: { income: 0, expenses: 0, savings: 0 },
                data: [],
            };
        }

        const totals =
            monthlyTotals.get(selectedMonth) || {
                income: 0,
                expenses: 0,
                savings: 0,
            };

        const data = [
            {
                key: "income",
                category: "Income",
                amount: totals.income,
                fill: chartConfig.income.color,
            },
            {
                key: "expenses",
                category: "Expenses",
                amount: totals.expenses,
                fill: chartConfig.expenses.color,
            },
            {
                key: "savings",
                category: "Savings",
                amount: totals.savings,
                fill: chartConfig.savings.color,
            },
        ];

        return { totals, data };
    }, [monthlyTotals, selectedMonth]);

    const hasData = monthlyData.data.some((item) => item.amount > 0);

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <CardTitle>Monthly Comparison</CardTitle>
                        <CardDescription>
                            Income vs expenses vs savings
                        </CardDescription>
                    </div>
                    <CardAction>
                        <Select
                            value={selectedMonth}
                            onValueChange={setSelectedMonth}
                            disabled={!monthOptions.length}
                        >
                            <SelectTrigger className="w-[200px]" size="sm">
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
                            </SelectContent>
                        </Select>
                    </CardAction>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                {monthOptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No monthly data available yet. Add transactions to get
                        started.
                    </p>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="mt-3 h-[260px] w-full aspect-auto overflow-hidden"
                    >
                        <BarChart
                            data={monthlyData.data}
                            margin={{ left: 8, right: 8, bottom: 12 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="category"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) =>
                                    new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(value)
                                }
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => value}
                                        formatter={(value, name) => (
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {name}
                                                </span>
                                                <span>
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                        minimumFractionDigits: 0,
                                                    }).format(Number(value))}
                                                </span>
                                            </div>
                                        )}
                                    />
                                }
                            />
                            <Bar
                                dataKey="amount"
                                radius={[6, 6, 0, 0]}
                                barSize={50}
                                maxBarSize={28}
                            >
                                {monthlyData.data.map((entry) => (
                                    <Cell
                                        key={entry.key}
                                        fill={entry.fill}
                                        name={entry.category}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
                {!hasData && monthOptions.length > 0 && (
                    <p className="mt-4 text-sm text-muted-foreground">
                        No income, expense, or savings activity recorded for the
                        selected month.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
