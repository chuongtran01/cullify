"use client";

import { CheckCircle2, Images, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    title: "Batches",
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

function getInitials(user: DashboardUser) {
  const label = user.name || user.email || "User";
  const words = label
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase()).join("") || "U";
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const userLabel = user.name || user.email || "Account";
  const userDetail = user.email && user.email !== userLabel ? user.email : "Signed in";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="Cullify">
              <Link href="/dashboard">
                <span className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
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
      <SidebarSeparator />
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
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={userLabel}>
              <Avatar className="rounded-md" size="default">
                <AvatarFallback className="rounded-md bg-surface-stone text-xs font-semibold text-ink">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 text-left">
                <span className="block truncate text-sm font-medium">
                  {userLabel}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {userDetail}
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
