"use client";

import { ChevronsUpDown, Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export type SidebarUserInfo = {
  name?: string | null;
  email?: string | null;
};

type SidebarUserProps = {
  user: SidebarUserInfo;
};

function getInitials(user: SidebarUserInfo) {
  const label = user.name || user.email || "User";
  const words = label
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase()).join("") || "U";
}

export function SidebarUser({ user }: SidebarUserProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const userLabel = user.name || user.email || "Account";
  const userDetail = user.email && user.email !== userLabel ? user.email : "Signed in";
  const initials = getInitials(user);

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
            >
              <Avatar className="rounded-md" size="default">
                <AvatarFallback className="rounded-md bg-surface-stone text-xs font-semibold text-ink">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                <span className="block truncate text-sm font-medium">
                  {userLabel}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {userDetail}
                </span>
              </span>
              <ChevronsUpDown
                className="ml-auto size-4 group-data-[collapsible=icon]:hidden"
                aria-hidden="true"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="rounded-md" size="default">
                  <AvatarFallback className="rounded-md bg-surface-stone text-xs font-semibold text-ink">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userLabel}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userDetail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                void handleSignOut();
              }}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <LogOut aria-hidden="true" />
              )}
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
