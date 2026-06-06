"use client";

import { CheckCircle2, CirclePlus, Images, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarUser } from "@/components/dashboard/sidebar-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

type DashboardUser = {
  name?: string | null;
  email?: string | null;
};

type AppSidebarProps = {
  user: DashboardUser;
};

export const APP_SIDEBAR_DEFAULT_OPEN = false;

const navItems = [
  {
    title: "New collection",
    icon: CirclePlus,
    href: "/dashboard/collections/new",
  },
  {
    title: "Collections",
    href: "/dashboard",
    icon: Images,
  },
  {
    title: "Review",
    href: "/dashboard/review",
    icon: CheckCircle2,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarBrand() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (isCollapsed) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarTrigger
            className="size-8 w-full rounded-md hover:bg-sidebar-accent"
            aria-label="Expand sidebar"
          />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex w-full items-center gap-1">
          <SidebarMenuButton asChild size="lg" className="min-w-0 flex-1">
            <Link href="/dashboard">
              <span className="truncate text-lg font-semibold tracking-tight">
                Cullify
              </span>
            </Link>
          </SidebarMenuButton>
          <SidebarTrigger
            className="size-8 shrink-0 rounded-md hover:bg-sidebar-accent"
            aria-label="Collapse sidebar"
          />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 px-3 py-3 group-data-[collapsible=icon]:px-2">
        <SidebarBrand />
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(pathname, item.href)}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        <SidebarUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
