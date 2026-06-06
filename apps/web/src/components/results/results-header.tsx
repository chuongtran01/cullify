"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateCollectionName } from "@/features/collections/hooks";
import type { CollectionResultsSummary } from "@/services/collections";

type ResultsHeaderProps = {
  summary: UseQueryResult<CollectionResultsSummary, Error>;
};

const MAX_COLLECTION_NAME_LENGTH = 100;

const editCollectionNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(MAX_COLLECTION_NAME_LENGTH, "Name must be at most 100 characters."),
});

type EditCollectionNameValues = z.infer<typeof editCollectionNameSchema>;

export function ResultsHeader({ summary }: ResultsHeaderProps) {
  const title = summary.data?.collectionName ?? "Results";
  const collectionId = summary.data?.collectionId ?? "";
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateCollectionName = useUpdateCollectionName();
  const canEdit = Boolean(summary.data);
  const form = useForm<EditCollectionNameValues>({
    resolver: zodResolver(editCollectionNameSchema),
    mode: "onChange",
    defaultValues: {
      name: title,
    },
  });

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const cancelEdit = () => {
    if (updateCollectionName.isPending) {
      return;
    }

    form.reset({ name: title });
    updateCollectionName.reset();
    setIsEditing(false);
  };

  const saveName = async (values: EditCollectionNameValues) => {
    if (!collectionId) {
      return;
    }

    if (values.name === title) {
      setIsEditing(false);
      return;
    }

    try {
      await updateCollectionName.mutateAsync({
        collectionId,
        name: values.name,
      });
      setIsEditing(false);
    } catch {
      // The mutation error is rendered below the field.
    }
  };

  const startEditing = () => {
    if (!canEdit) {
      return;
    }

    form.reset({ name: title });
    updateCollectionName.reset();
    setIsEditing(true);
  };

  const submitError =
    updateCollectionName.error instanceof Error
      ? updateCollectionName.error.message
      : null;

  return (
    <header className="flex items-center justify-between gap-4 pb-4">
      <div className="min-w-0">
        {summary.isPending ? (
          <Skeleton className="h-6 w-48" />
        ) : isEditing ? (
          <Form {...form}>
            <form
              className="grid max-w-sm gap-1.5"
              onSubmit={form.handleSubmit(saveName)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormControl>
                      <Input
                        {...field}
                        ref={(node) => {
                          field.ref(node);
                          inputRef.current = node;
                        }}
                        maxLength={MAX_COLLECTION_NAME_LENGTH}
                        disabled={updateCollectionName.isPending}
                        aria-label="Collection name"
                        onBlur={() => {
                          field.onBlur();
                          cancelEdit();
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") {
                            event.preventDefault();
                            cancelEdit();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              {submitError ? (
                <p className="text-xs text-semantic-error">{submitError}</p>
              ) : null}
            </form>
          </Form>
        ) : (
          <Button
            variant="ghost"
            type="button"
            disabled={!canEdit}
            className="block max-w-full cursor-text text-left text-base font-medium disabled:cursor-default"
            onClick={startEditing}
          >
            <span className="truncate">{title}</span>
          </Button>
        )}
        {summary.isError ? (
          <p className="mt-1 text-xs text-body">
            Unable to refresh collection details.
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-9 shrink-0 rounded-lg px-4"
      >
        Share
      </Button>
    </header>
  );
}
