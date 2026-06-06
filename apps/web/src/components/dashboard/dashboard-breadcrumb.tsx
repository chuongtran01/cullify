"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbSegment = {
  label: string;
  href?: string;
};

function getDashboardBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  if (pathname === "/dashboard") {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Collections" },
    ];
  }

  if (pathname === "/dashboard/review") {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Review" },
    ];
  }

  if (pathname === "/dashboard/settings") {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings" },
    ];
  }

  if (/^\/dashboard\/collections\/[^/]+\/progress$/.test(pathname)) {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Collections", href: "/dashboard" },
      { label: "Progress" },
    ];
  }

  if (/^\/dashboard\/collections\/[^/]+\/results$/.test(pathname)) {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Collections", href: "/dashboard" },
      { label: "Results" },
    ];
  }

  if (/^\/dashboard\/collections\/[^/]+\/results\/low-quality$/.test(pathname)) {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Collections", href: "/dashboard" },
      { label: "Results", href: pathname.replace(/\/low-quality$/, "") },
      { label: "Low Quality" },
    ];
  }

  return [{ label: "Dashboard" }];
}

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = getDashboardBreadcrumbs(pathname);

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap overflow-hidden">
        {segments.map((segment, index) => {
          const isCurrent = index === segments.length - 1;

          return (
            <Fragment key={`${segment.label}-${index}`}>
              {index > 0 ? (
                <BreadcrumbSeparator className="shrink-0" />
              ) : null}
              <BreadcrumbItem className="min-w-0">
                {isCurrent || !segment.href ? (
                  <BreadcrumbPage className="truncate text-sm">
                    {segment.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="truncate text-sm">
                    <Link href={segment.href}>{segment.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
