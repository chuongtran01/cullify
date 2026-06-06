"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateCollectionName } from "@/features/collections/hooks";
import type { CollectionResultsSummary } from "@/services/collections";

type ResultsHeaderProps = {
  summary: UseQueryResult<CollectionResultsSummary, Error>;
};

const MAX_COLLECTION_NAME_LENGTH = 100;

export function ResultsHeader({ summary }: ResultsHeaderProps) {
  const title = summary.data?.collectionName ?? "Results";
  const collectionId = summary.data?.collectionId ?? "";
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(title);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateCollectionName = useUpdateCollectionName();
  const canEdit = Boolean(summary.data);

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

    setDraftName(title);
    setErrorMessage(null);
    setIsEditing(false);
  };

  const validateName = (name: string) => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return { error: "Collection name is required.", name: trimmedName };
    }

    if (trimmedName.length > MAX_COLLECTION_NAME_LENGTH) {
      return { error: "Use 100 characters or fewer.", name: trimmedName };
    }

    return { error: null, name: trimmedName };
  };

  const saveName = async () => {
    if (!collectionId) {
      return;
    }

    const validation = validateName(draftName);

    if (validation.error) {
      setErrorMessage(validation.error);
      return;
    }

    if (validation.name === title) {
      setErrorMessage(null);
      setIsEditing(false);
      return;
    }

    try {
      setErrorMessage(null);
      await updateCollectionName.mutateAsync({
        collectionId,
        name: validation.name,
      });
      setDraftName(validation.name);
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update collection name.",
      );
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 pb-4">
      <div className="min-w-0">
        {summary.isPending ? (
          <Skeleton className="h-6 w-48" />
        ) : isEditing ? (
          <form
            className="grid max-w-sm gap-1.5"
            onSubmit={(event) => {
              event.preventDefault();
              void saveName();
            }}
          >
            <Input
              ref={inputRef}
              value={draftName}
              maxLength={MAX_COLLECTION_NAME_LENGTH}
              disabled={updateCollectionName.isPending}
              aria-invalid={Boolean(errorMessage)}
              aria-label="Collection name"
              onBlur={cancelEdit}
              onChange={(event) => {
                setDraftName(event.target.value);
                setErrorMessage(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  cancelEdit();
                }
              }}
            />
            {errorMessage ? (
              <p className="text-xs text-destructive">{errorMessage}</p>
            ) : null}
          </form>
        ) : (
          <Button
            variant="ghost"
            type="button"
            disabled={!canEdit}
            className="block max-w-full cursor-text text-left text-base font-medium disabled:cursor-default"
            onClick={() => {
              if (!canEdit) {
                return;
              }

              setDraftName(title);
              setErrorMessage(null);
              setIsEditing(true);
            }}
          >
            {title}
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
