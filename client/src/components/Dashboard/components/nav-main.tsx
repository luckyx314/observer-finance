import { IconMail, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import AddTransactionDialog from "@/components/Dialog/AddTransactionDialog/AddTrannsactionDialog";
import { Link } from "react-router-dom";

export function NavMain({
    items,
    onTransactionCreated,
}: {
    items: {
        title: string;
        url: string;
        icon?: Icon;
    }[];
    onTransactionCreated?: () => void;
}) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <AddTransactionDialog onSuccess={onTransactionCreated}>
                            {/* Custom form or content here */}
                        </AddTransactionDialog>
                        <Button
                            size="icon"
                            className="size-8 group-data-[collapsible=icon]:opacity-0"
                            variant="outline"
                        >
                            <IconMail />
                            <span className="sr-only">Inbox</span>
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <Link to={`/${String(item.title).toLowerCase()}`}>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
