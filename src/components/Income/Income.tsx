import { AppSidebar } from "@/components/Dashboard/components/app-sidebar";
import { SiteHeader } from "@/components/Dashboard/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Income() {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader headerTitle="Income" />
            </SidebarInset>
        </SidebarProvider>
    );
}
