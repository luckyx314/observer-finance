"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
import { format, subDays } from "date-fns";

export const description = "An interactive area chart";

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
    const [timeRange, setTimeRange] = React.useState("90d");

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d");
        }
    }, [isMobile]);

    const chartData = React.useMemo(() => {
        // Group transactions by date
        const dataByDate = new Map<string, { expenses: number; income: number }>();

        transactions.forEach((transaction) => {
            const dateKey = format(new Date(transaction.date), "yyyy-MM-dd");
            const existing = dataByDate.get(dateKey) || { expenses: 0, income: 0 };

            if (transaction.type === "Expense") {
                existing.expenses += transaction.amount;
            } else if (transaction.type === "Income") {
                existing.income += transaction.amount;
            }

            dataByDate.set(dateKey, existing);
        });

        // Convert to array and sort by date
        return Array.from(dataByDate.entries())
            .map(([date, values]) => ({
                date,
                expenses: values.expenses,
                income: values.income,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [transactions]);

    const filteredData = React.useMemo(() => {
        const today = new Date();
        let daysToSubtract = 90;

        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }

        const startDate = subDays(today, daysToSubtract);

        return chartData.filter((item) => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= today;
        });
    }, [chartData, timeRange]);

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Daily income and expenses overview
                    </span>
                    <span className="@[540px]/card:hidden">Daily overview</span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="90d">
                            Last 3 months
                        </ToggleGroupItem>
                        <ToggleGroupItem value="30d">
                            Last 30 days
                        </ToggleGroupItem>
                        <ToggleGroupItem value="7d">
                            Last 7 days
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient
                                id="expenses"
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
                                id="fillIncome"
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
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="income"
                            type="natural"
                            fill="url(#fillIncome)"
                            stroke="hsl(200, 70%, 60%)"
                            strokeWidth={2}
                            stackId="a"
                        />
                        <Area
                            dataKey="expenses"
                            type="natural"
                            fill="url(#expenses)"
                            stroke="hsl(285, 65%, 52%)"
                            strokeWidth={2}
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
