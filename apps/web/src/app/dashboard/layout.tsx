import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar
          user={{
            name: session.user.name,
            email: session.user.email,
          }}
        />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-hairline bg-canvas/95 px-4 backdrop-blur">
            <SidebarTrigger className="md:hidden" />
            <div className="min-w-0 flex-1">
              <DashboardBreadcrumb />
            </div>
          </header>
          <main className="min-h-[calc(100svh-3.5rem)] bg-canvas px-4 py-5 text-ink sm:px-6 lg:px-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
