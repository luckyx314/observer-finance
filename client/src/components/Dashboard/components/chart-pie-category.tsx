"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { Transaction } from "@/types";

interface ChartPieCategoryProps {
    transactions: Transaction[];
    type: "Expense" | "Income";
}

export function ChartPieCategory({ transactions, type }: ChartPieCategoryProps) {
    const chartData = React.useMemo(() => {
        const filteredTransactions = transactions.filter((t) => t.type === type);

        // Group by category and sum amounts
        const categoryMap = new Map<string, number>();
        filteredTransactions.forEach((transaction) => {
            const current = categoryMap.get(transaction.category) || 0;
            categoryMap.set(transaction.category, current + transaction.amount);
        });

        // Custom color palette - vibrant and distinguishable colors
        const expenseColors = [
            "hsl(285, 70%, 55%)",  // Vibrant purple
            "hsl(340, 75%, 55%)",  // Pink/magenta
            "hsl(260, 70%, 58%)",  // Blue purple
            "hsl(310, 68%, 52%)",  // Deep magenta
            "hsl(280, 65%, 60%)",  // Light purple
            "hsl(320, 72%, 50%)",  // Hot pink
            "hsl(270, 68%, 53%)",  // Royal purple
            "hsl(295, 70%, 57%)",  // Medium purple
        ];

        const incomeColors = [
            "hsl(200, 75%, 55%)",  // Vibrant cyan
            "hsl(170, 70%, 50%)",  // Teal
            "hsl(190, 72%, 52%)",  // Bright cyan
            "hsl(210, 75%, 58%)",  // Sky blue
            "hsl(180, 68%, 48%)",  // Deep teal
            "hsl(195, 70%, 60%)",  // Light cyan
            "hsl(165, 72%, 52%)",  // Turquoise
            "hsl(205, 73%, 55%)",  // Ocean blue
        ];

        const colors = type === "Expense" ? expenseColors : incomeColors;

        // Convert to array format for chart
        return Array.from(categoryMap.entries())
            .map(([category, amount], index) => ({
                category,
                amount,
                fill: colors[index % colors.length],
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions, type]);

    const totalAmount = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.amount, 0);
    }, [chartData]);

    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {};
        chartData.forEach((item) => {
            config[item.category] = {
                label: item.category,
                color: item.fill,
            };
        });
        return config;
    }, [chartData]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{type} by Category</CardTitle>
                <CardDescription>Breakdown of {type.toLowerCase()} categories</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="grid gap-2">
                                                <div className="font-medium">{payload[0].name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    ₱{Number(payload[0].value).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Pie
                            data={chartData}
                            dataKey="amount"
                            nameKey="category"
                            innerRadius={80}
                            outerRadius={100}
                            strokeWidth={2}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-normal"
                                                >
                                                    ₱{totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
