"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import type { Batch } from "@/components/batches/types";
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
import { useUpdateBatchName } from "@/features/batches/hooks";

const editBatchSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters."),
});

type EditBatchValues = z.infer<typeof editBatchSchema>;

type EditBatchDialogProps = {
  batch: Batch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditBatchDialog({
  batch,
  open,
  onOpenChange,
}: EditBatchDialogProps) {
  const updateBatchName = useUpdateBatchName();
  const resetMutationRef = useRef(updateBatchName.reset);
  const form = useForm<EditBatchValues>({
    resolver: zodResolver(editBatchSchema),
    defaultValues: {
      name: batch.name,
    },
  });
  const name = useWatch({ control: form.control, name: "name" }) ?? "";
  const { reset } = form;

  useEffect(() => {
    resetMutationRef.current = updateBatchName.reset;
  }, [updateBatchName.reset]);

  useEffect(() => {
    if (open) {
      reset({ name: batch.name });
      resetMutationRef.current();
    }
  }, [batch.name, open, reset]);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  function handleSubmit(values: EditBatchValues) {
    updateBatchName.mutate(
      { batchId: batch.id, name: values.name.trim() },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  }

  const submitError =
    updateBatchName.error instanceof Error ? updateBatchName.error.message : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-[16px] border border-hairline bg-surface-card p-0 shadow-none sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader className="border-b border-hairline px-6 py-5">
              <DialogTitle className="text-lg font-normal text-ink">
                Edit batch
              </DialogTitle>
              <DialogDescription>
                Rename this batch so it is easier to find later.
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

            <div className="flex items-center justify-end gap-2 rounded-b-[16px] border-t border-hairline bg-surface-card px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="border-hairline bg-surface-card text-ink hover:bg-surface-stone"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateBatchName.isPending}>
                {updateBatchName.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
