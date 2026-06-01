"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import type { Collection } from "@/components/collections/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateCollectionName } from "@/features/collections/hooks";

const editCollectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters."),
});

type EditCollectionValues = z.infer<typeof editCollectionSchema>;

type EditCollectionDialogProps = {
  collection: Collection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditCollectionDialog({
  collection,
  open,
  onOpenChange,
}: EditCollectionDialogProps) {
  const updateCollectionName = useUpdateCollectionName();
  const resetMutationRef = useRef(updateCollectionName.reset);
  const form = useForm<EditCollectionValues>({
    resolver: zodResolver(editCollectionSchema),
    defaultValues: {
      name: collection.name,
    },
  });
  const name = useWatch({ control: form.control, name: "name" }) ?? "";
  const { reset } = form;

  useEffect(() => {
    resetMutationRef.current = updateCollectionName.reset;
  }, [updateCollectionName.reset]);

  useEffect(() => {
    if (open) {
      reset({ name: collection.name });
      resetMutationRef.current();
    }
  }, [collection.name, open, reset]);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  function handleSubmit(values: EditCollectionValues) {
    updateCollectionName.mutate(
      { collectionId: collection.id, name: values.name.trim() },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  }

  const submitError =
    updateCollectionName.error instanceof Error ? updateCollectionName.error.message : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-2xl border border-hairline bg-surface-card p-0 shadow-none sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader className="border-b border-hairline px-6 py-5">
              <DialogTitle className="text-lg font-normal text-ink">
                Edit collection
              </DialogTitle>
              <DialogDescription>
                Rename this collection so it is easier to find later.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2 px-6 py-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className="h-10"
                        maxLength={100}
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-start justify-between gap-3">
                      <FormMessage className="min-h-5 text-xs" />
                      <p className="shrink-0 text-xs text-muted">
                        {name.trim().length}/100
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              {submitError ? (
                <p className="text-xs text-semantic-error">{submitError}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-2 rounded-b-2xl border-t border-hairline bg-surface-card px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="border-hairline bg-surface-card text-ink hover:bg-surface-stone"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateCollectionName.isPending}>
                {updateCollectionName.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
