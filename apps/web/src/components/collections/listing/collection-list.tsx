"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckCircle2,
  CircleX,
  Clock3,
  Loader2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  formatCollectionDate,
  getCollectionActionLabel,
} from "@/components/collections/listing/collection-ui";
import { EditCollectionDialog } from "@/components/collections/listing/edit-collection-dialog";
import type { Collection, CollectionStatus } from "@/components/collections/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type CollectionListProps = {
  collections: Collection[];
};

type CollectionListSkeletonProps = {
  rowCount?: number;
};

const listStatusMeta: Record<
  CollectionStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  UPLOADING: {
    label: "Uploading",
    icon: Loader2,
    className: "text-text-link",
  },
  PROCESSING: {
    label: "Processing",
    icon: Loader2,
    className: "text-semantic-success",
  },
  READY_FOR_REVIEW: {
    label: "Ready for Review",
    icon: Sparkles,
    className: "text-accent-preview",
  },
  IN_REVIEW: {
    label: "In Review",
    icon: Clock3,
    className: "text-text-link",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className: "text-semantic-success",
  },
  FAILED: {
    label: "Failed",
    icon: CircleX,
    className: "text-semantic-error",
  },
};

function CollectionStatusBlock({ collection }: { collection: Collection }) {
  const meta = listStatusMeta[collection.status];
  const Icon = meta.icon;
  const isSpinning =
    collection.status === "PROCESSING" || collection.status === "UPLOADING";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide",
        meta.className,
      )}
    >
      <Icon
        className={cn("size-3.5", isSpinning && "animate-spin")}
        aria-hidden="true"
      />
      {meta.label}
    </div>
  );
}

function getCollectionActionHref(collection: Collection) {
  if (collection.status === "PROCESSING" || collection.status === "UPLOADING") {
    return `/dashboard/collections/${collection.id}/progress`;
  }

  if (
    collection.status === "READY_FOR_REVIEW" ||
    collection.status === "IN_REVIEW" ||
    collection.status === "COMPLETED"
  ) {
    return `/dashboard/collections/${collection.id}/results`;
  }

  return null;
}

function CollectionRowActions({ collection }: { collection: Collection }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-8 w-8 p-0 text-body hover:text-ink"
            variant="ghost"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditCollectionDialog
        collection={collection}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

const collectionColumns: ColumnDef<Collection>[] = [
  {
    id: "details",
    header: "Collection",
    cell: ({ row }) => {
      const collection = row.original;

      return (
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-ink">{collection.name}</p>
          <p className="mt-1 text-sm font-normal leading-normal text-body">
            {collection.totalImages} photos <span className="px-1">·</span> Created{" "}
            {formatCollectionDate(collection.createdAt)}
          </p>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <CollectionStatusBlock collection={row.original} />,
  },
  {
    id: "primaryAction",
    header: "Action",
    cell: ({ row }) => {
      const collection = row.original;
      const actionHref = getCollectionActionHref(collection);

      return (
        <div className="flex items-center gap-2 lg:justify-end">
          {actionHref ? (
            <Button
              asChild
              className="h-10 min-w-36 cursor-pointer rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink"
              size="sm"
              variant="outline"
            >
              <Link href={actionHref}>
                {getCollectionActionLabel(collection.status)}
              </Link>
            </Button>
          ) : (
            <Button
              className="h-10 min-w-36 cursor-pointer rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink"
              size="sm"
              variant="outline"
            >
              {getCollectionActionLabel(collection.status)}
            </Button>
          )}
        </div>
      );
    },
  },
  {
    id: "rowActions",
    header: "More actions",
    cell: ({ row }) => <CollectionRowActions collection={row.original} />,
  },
];

export function CollectionList({ collections }: CollectionListProps) {
  // TanStack Table exposes function-heavy instances that React Compiler intentionally skips.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: collections,
    columns: collectionColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg border border-hairline-strong bg-surface-card">
      <Table className="min-w-0">
        <TableHeader className="sr-only">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="block">
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="grid gap-4 border-b border-hairline px-4 py-3 hover:bg-transparent has-aria-expanded:bg-transparent last:border-b-0 lg:grid-cols-[minmax(220px,1.2fr)_minmax(260px,1fr)_180px_32px] lg:items-center"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="block whitespace-normal p-0"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function CollectionListSkeleton({
  rowCount = 5,
}: CollectionListSkeletonProps) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-hairline-strong bg-surface-card"
      aria-label="Loading collections"
    >
      <Table className="min-w-0">
        <TableHeader className="sr-only">
          <TableRow>
            <TableHead>Collection</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>More actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="block">
          {Array.from({ length: rowCount }).map((_, index) => (
            <TableRow
              key={index}
              className="grid gap-4 border-b border-hairline px-4 py-3 hover:bg-transparent has-aria-expanded:bg-transparent last:border-b-0 lg:grid-cols-[minmax(220px,1.2fr)_minmax(260px,1fr)_180px_32px] lg:items-center"
            >
              <TableCell className="block whitespace-normal p-0">
                <div className="min-w-0">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="mt-2 h-3 w-56 max-w-full" />
                </div>
              </TableCell>
              <TableCell className="block whitespace-normal p-0">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-3.5 rounded-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </TableCell>
              <TableCell className="block whitespace-normal p-0">
                <div className="flex items-center gap-2 lg:justify-end">
                  <Skeleton className="h-9 w-36" />
                </div>
              </TableCell>
              <TableCell className="block whitespace-normal p-0">
                <Skeleton className="size-8 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
