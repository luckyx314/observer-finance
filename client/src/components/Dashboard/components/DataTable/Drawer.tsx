import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/STATIC_DATA/STATIC_DATA";
import type { Transaction } from "@/types";
import { IconTrendingUp } from "@tabler/icons-react";

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--color-desktop)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--color-mobile)",
    },
} satisfies ChartConfig;

export default function TableCellViewer({
    item,
}: {
    item: Transaction;
}) {
    const isMobile = useIsMobile();

    return (
        <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button
                    variant="link"
                    className="w-fit px-0 text-left text-foreground"
                >
                    {item.merchant}
                </Button>
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.merchant}</DrawerTitle>
                    <DrawerDescription>
                        Showing total visitors for the last 6 months
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    {!isMobile && (
                        <>
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    data={chartData}
                                    margin={{ left: 0, right: 10 }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) =>
                                            value.slice(0, 3)
                                        }
                                        hide
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent indicator="dot" />
                                        }
                                    />
                                    <Area
                                        dataKey="mobile"
                                        type="natural"
                                        fill="var(--color-mobile)"
                                        fillOpacity={0.6}
                                        stroke="var(--color-mobile)"
                                        stackId="a"
                                    />
                                    <Area
                                        dataKey="desktop"
                                        type="natural"
                                        fill="var(--color-desktop)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-desktop)"
                                        stackId="a"
                                    />
                                </AreaChart>
                            </ChartContainer>

                            <Separator />

                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 font-medium leading-none">
                                    Trending up by 5.2% this month
                                    <IconTrendingUp className="size-4" />
                                </div>
                                <p className="text-muted-foreground">
                                    Showing total visitors for the last 6
                                    months. This is just some random text to
                                    test the layout. It spans multiple lines and
                                    should wrap around.
                                </p>
                            </div>

                            <Separator />
                        </>
                    )}

                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="mercant">Merchant</Label>
                            <Input id="mercant" defaultValue={item.merchant} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="type">Category</Label>
                                <Select defaultValue={item.category}>
                                    <SelectTrigger id="type" className="w-full">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="status">Status</Label>
                                <Select defaultValue={item.status}>
                                    <SelectTrigger
                                        id="status"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Done">
                                            Done
                                        </SelectItem>
                                        <SelectItem value="In Progress">
                                            In Progress
                                        </SelectItem>
                                        <SelectItem value="Not Started">
                                            Not Started
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="amount">Amount</Label>
                                <Input id="amount" type="number" defaultValue={item.amount} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="reviewer">Reviewer</Label>
                            <Select>
                                <SelectTrigger id="reviewer" className="w-full">
                                    <SelectValue placeholder="Select a reviewer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Eddie Lake">
                                        Eddie Lake
                                    </SelectItem>
                                    <SelectItem value="Jamik Tashpulatov">
                                        Jamik Tashpulatov
                                    </SelectItem>
                                    <SelectItem value="Emily Whalen">
                                        Emily Whalen
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </form>
                </div>

                <DrawerFooter>
                    <Button>Update</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
