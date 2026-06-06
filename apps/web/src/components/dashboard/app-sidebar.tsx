"use client";

import { CheckCircle2, Images, Settings, Sparkles } from "lucide-react";
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
} from "@/components/ui/sidebar";

type DashboardUser = {
  name?: string | null;
  email?: string | null;
};

type AppSidebarProps = {
  user: DashboardUser;
};

const navItems = [
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

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 px-3 py-3 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Cullify"
              className="group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/dashboard">
                <span className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <span className="block truncate text-sm font-semibold">
                    Cullify
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    Management
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
