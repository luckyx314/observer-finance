"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Transaction } from "@/types";
import { format, subMonths, addMonths, startOfMonth } from "date-fns";

export const description = "An interactive bar chart";

const chartConfig = {
    expenses: {
        label: "Expenses",
        color: "hsl(285, 65%, 52%)",
    },
    income: {
        label: "Income",
        color: "hsl(200, 70%, 60%)",
    },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
    transactions: Transaction[];
}

export function ChartAreaInteractive({ transactions }: ChartAreaInteractiveProps) {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState(isMobile ? "6m" : "12m");

    const chartData = React.useMemo(() => {
        // Group transactions by month
        const dataByMonth = new Map<string, { expenses: number; income: number }>();

        transactions.forEach((transaction) => {
            const monthKey = format(new Date(transaction.date), "yyyy-MM");
            const existing = dataByMonth.get(monthKey) || { expenses: 0, income: 0 };

            if (transaction.type === "Expense") {
                existing.expenses += transaction.amount;
            } else if (transaction.type === "Income") {
                existing.income += transaction.amount;
            }

            dataByMonth.set(monthKey, existing);
        });

        // Convert to array and sort by date
        return Array.from(dataByMonth.entries())
            .map(([month, values]) => ({
                month,
                expenses: values.expenses,
                income: values.income,
                label: format(new Date(`${month}-01T00:00:00`), "MMM yyyy"),
            }))
            .sort((a, b) => a.month.localeCompare(b.month));
    }, [transactions]);

    const chartDataByMonth = React.useMemo(() => {
        return new Map(chartData.map((entry) => [entry.month, entry]));
    }, [chartData]);

    const filteredData = React.useMemo(() => {
        const today = startOfMonth(new Date());
        let rangeLength = 12;

        if (timeRange === "6m") {
            rangeLength = 6;
        } else if (timeRange === "3m") {
            rangeLength = 3;
        }

        const startDate = subMonths(today, rangeLength - 1);
        const series = [];

        for (let monthIndex = 0; monthIndex < rangeLength; monthIndex++) {
            const current = addMonths(startDate, monthIndex);
            const key = format(current, "yyyy-MM");
            const point = chartDataByMonth.get(key);

            series.push({
                month: key,
                label: format(current, "MMM yyyy"),
                expenses: point?.expenses ?? 0,
                income: point?.income ?? 0,
            });
        }

        return series;
    }, [chartDataByMonth, timeRange]);

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Month-over-month income and expenses
                    </span>
                    <span className="@[540px]/card:hidden">Monthly overview</span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="12m">
                            Last 12 months
                        </ToggleGroupItem>
                        <ToggleGroupItem value="6m">
                            Last 6 months
                        </ToggleGroupItem>
                        <ToggleGroupItem value="3m">
                            Last 3 months
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 12 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="12m" className="rounded-lg">
                                Last 12 months
                            </SelectItem>
                            <SelectItem value="6m" className="rounded-lg">
                                Last 6 months
                            </SelectItem>
                            <SelectItem value="3m" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[300px] w-full"
                >
                    <BarChart
                        data={filteredData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 10,
                            bottom: 30,
                        }}
                        barCategoryGap="30%"
                    >
                        <defs>
                            <linearGradient
                                id="expensesGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="hsl(285, 65%, 52%)"
                                    stopOpacity={0.6}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="hsl(285, 65%, 52%)"
                                    stopOpacity={0.05}
                                />
                            </linearGradient>
                            <linearGradient
                                id="incomeGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="hsl(200, 70%, 60%)"
                                    stopOpacity={0.5}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="hsl(200, 70%, 60%)"
                                    stopOpacity={0.05}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => {
                                return new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(value);
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => value}
                                    indicator="dot"
                                />
                            }
                        />
                        <Bar
                            dataKey="income"
                            fill="url(#incomeGradient)"
                            stroke="hsl(200, 70%, 60%)"
                            barSize={10}
                            radius={[6, 6, 0, 0]}
                        />
                        <Bar
                            dataKey="expenses"
                            fill="url(#expensesGradient)"
                            stroke="hsl(285, 65%, 52%)"
                            barSize={10}
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
