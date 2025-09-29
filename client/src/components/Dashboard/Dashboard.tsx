import { AppSidebar } from "@/components/Dashboard/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/Dashboard/components/chart-area-interactive";
import { DataTable } from "@/components/Dashboard/components/DataTable/DataTable";
import { SectionCards } from "@/components/Dashboard/components/section-cards";
import { SiteHeader } from "@/components/Dashboard/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";

export default function Dashboard() {
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
                <SiteHeader headerTitle="Dashboard" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <SectionCards />
                            <div className="px-4 lg:px-6">
                                <ChartAreaInteractive />
                            </div>
                            <DataTable data={data} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
