import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Net Expenses</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        P21,250.00
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp className="text-green-500 dark:text-green-400" />
                            <span className="text-green-500 dark:text-green-400">
                                +12.5%
                            </span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Trending up this month{" "}
                        <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Expenses for the last 6 months
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Net Income</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        P121,234
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingDown className="text-red-500 dark:text-red-400" />
                            <span className="text-red-500 dark:text-red-400">
                                -20%
                            </span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Down 20% this period{" "}
                        <IconTrendingDown className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Passive income needs attention
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Net Savings</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        P45,678
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp className="text-green-500 dark:text-green-400" />
                            <span className="text-green-500 dark:text-green-400">
                                +12.5%
                            </span>{" "}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Strong user retention{" "}
                        <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Income outweighs expenses
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Growth Rate</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        4.5%
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp className="text-green-500 dark:text-green-400" />
                            <span className="text-green-500 dark:text-green-400">
                                +12.5%
                            </span>{" "}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Steady performance increase{" "}
                        <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Meets growth projections
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
