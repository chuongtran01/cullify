"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { formatCollectionDate } from "@/components/collections/listing/collection-ui";
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

const statusLabels: Record<CollectionStatus, string> = {
  UPLOADING: "Uploading",
  PROCESSING: "Processing",
  READY_FOR_REVIEW: "Ready for review",
  IN_REVIEW: "In review",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

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

  return `/dashboard/collections/${collection.id}/progress`;
}

function CollectionRowActions({ collection }: { collection: Collection }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="size-8 p-0 text-body hover:text-ink"
            variant="ghost"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setEditOpen(true);
            }}
          >
            <Pencil aria-hidden="true" />
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

function CollectionRowContent({ collection }: { collection: Collection }) {
  const statusClassName = cn(
    "text-sm text-body",
    collection.status === "FAILED" && "text-semantic-error",
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
      <p className="truncate text-sm font-medium text-ink">{collection.name}</p>
      <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-body">
        <span>{collection.totalImages.toLocaleString()} photos</span>
        <span aria-hidden="true">·</span>
        <span className={statusClassName}>{statusLabels[collection.status]}</span>
        <span aria-hidden="true">·</span>
        <span>{formatCollectionDate(collection.createdAt)}</span>
      </div>
    </div>
  );
}

const collectionColumns: ColumnDef<Collection>[] = [
  {
    id: "collection",
    header: "Collection",
    cell: ({ row }) => {
      const collection = row.original;

      return (
        <div className="relative flex min-w-0 items-center gap-3">
          <Link
            href={getCollectionActionHref(collection)}
            className="absolute inset-0 z-10 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Open ${collection.name}`}
          />
          <CollectionRowContent collection={collection} />
          <div className="relative z-20 shrink-0 opacity-0 transition-opacity group-hover/list-row:opacity-100 group-focus-within/list-row:opacity-100">
            <CollectionRowActions collection={collection} />
          </div>
        </div>
      );
    },
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
    <div>
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
              className="group/list-row block border-b border-hairline px-3 py-3 transition-colors hover:rounded-md hover:border-transparent hover:bg-surface-strong/60 has-aria-expanded:rounded-md has-aria-expanded:border-transparent has-aria-expanded:bg-surface-strong/60 last:border-b-0"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="block p-0">
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
    <div aria-label="Loading collections">
      <Table className="min-w-0">
        <TableHeader className="sr-only">
          <TableRow>
            <TableHead>Collection</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="block">
          {Array.from({ length: rowCount }).map((_, index) => (
            <TableRow
              key={index}
              className="block border-b border-hairline px-3 py-3 last:border-b-0"
            >
              <TableCell className="block p-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-baseline gap-3">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                  <Skeleton className="size-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
