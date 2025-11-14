import * as React from "react";
import {
    IconCash,
    IconChartLine,
    IconDashboard,
    IconUser,
    IconWallet,
} from "@tabler/icons-react";

import { NavMain } from "@/components/Dashboard/components/nav-main";
import { NavUser } from "@/components/Dashboard/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import finxLogo from "@/assets/phoenix.png";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
        },
        {
            title: "Budgets",
            url: "/budgets",
            icon: IconWallet,
        },
        {
            title: "Income",
            url: "/income",
            icon: IconCash,
        },
        {
            title: "Investments",
            url: "/investments",
            icon: IconChartLine,
        },
        {
            title: "Account",
            url: "/account",
            icon: IconUser,
        },
    ],
    
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    onTransactionCreated?: () => void;
}

export function AppSidebar({ onTransactionCreated, ...props }: AppSidebarProps) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="/dashboard">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={finxLogo}
                                        alt="Finx icon"
                                        className="size-8 shrink-0"
                                    />
                                    <span className="text-base font-semibold">
                                    Finx.
                                </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} onTransactionCreated={onTransactionCreated} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
