"use client";

import * as React from "react";
import { ImagePlus, Loader2, Sparkles, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useUploadBatch } from "@/hooks/use-upload-batch";
import type {
  CreateUploadSessionResponse,
  UploadProgress,
} from "@/lib/upload/types";
import { UploadR2Error, UploadSessionError } from "@/services/upload";

type UploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSessionCreated?: (response: CreateUploadSessionResponse) => void;
};

function mergeImageFiles(current: File[], nextFiles: File[]) {
  const seen = new Set(current.map((file) => `${file.name}-${file.size}`));
  const merged = [...current];

  for (const file of nextFiles) {
    const key = `${file.name}-${file.size}`;

    if (!seen.has(key)) {
      seen.add(key);
      merged.push(file);
    }
  }

  return merged;
}

export function UploadDialog({
  open,
  onOpenChange,
  onUploadSessionCreated,
}: UploadDialogProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploadProgress, setUploadProgress] =
    React.useState<UploadProgress | null>(null);
  const uploadBatch = useUploadBatch();
  const isSubmitting = uploadBatch.isPending;
  const uploadProgressValue =
    uploadProgress && uploadProgress.total > 0
      ? Math.round((uploadProgress.completed / uploadProgress.total) * 100)
      : 0;
  const error = uploadBatch.error
    ? uploadBatch.error instanceof UploadSessionError ||
        uploadBatch.error instanceof UploadR2Error
      ? uploadBatch.error.message
      : "Upload failed"
    : null;

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles((current) => mergeImageFiles(current, acceptedFiles));
  }, []);

  const { getRootProps, getInputProps, isDragActive, open: openFilePicker } =
    useDropzone({
      accept: {
        "image/*": [],
      },
      multiple: true,
      noClick: true,
      noKeyboard: false,
      disabled: isSubmitting,
      onDrop,
    });

  function removeFile(fileToRemove: File) {
    setFiles((current) => current.filter((file) => file !== fileToRemove));
  }

  function handleContinue() {
    if (files.length === 0 || isSubmitting) {
      return;
    }

    setUploadProgress({ completed: 0, total: files.length, fileName: "" });

    uploadBatch.mutate(
      {
        files,
        onProgress: setUploadProgress,
      },
      {
        onSuccess: (response) => {
          onUploadSessionCreated?.(response);
          setFiles([]);
          setUploadProgress(null);
          onOpenChange(false);
          uploadBatch.reset();
        },
        onError: () => {
          setUploadProgress(null);
        },
      },
    );
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) {
      return;
    }

    onOpenChange(nextOpen);

    if (!nextOpen) {
      setFiles([]);
      setUploadProgress(null);
      uploadBatch.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="!max-w-3xl overflow-hidden rounded-[22px] border border-hairline bg-surface-card p-0 text-ink shadow-none sm:!max-w-3xl">
        <DialogHeader className="gap-4 border-b border-hairline px-6 pt-7 pb-6 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
              <Sparkles className="size-5" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-normal leading-tight tracking-[-0.01em] text-ink">
                Upload a batch to Cullify
              </DialogTitle>
              <DialogDescription className="max-w-prose text-sm leading-6 text-body">
                Add a set of images and let the review pipeline handle blur
                checks, grouping, and best-shot ranking.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
          <div
            {...getRootProps()}
            className={cn(
              "rounded-[22px] border border-dashed bg-surface-blue-wash p-6 transition-colors outline-none focus-visible:border-focus-blue focus-visible:ring-3 focus-visible:ring-focus-blue/20 sm:p-8",
              isDragActive
                ? "border-action-blue bg-action-blue/5"
                : "border-hairline",
            )}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center text-center">
              <div className="grid size-14 place-items-center rounded-full border border-hairline bg-surface-card text-primary">
                <ImagePlus className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-normal tracking-[-0.01em] text-ink">
                {isDragActive
                  ? "Drop your photos here"
                  : "Drag and drop your photos here"}
              </h3>
              <p className="mt-2 max-w-prose text-sm leading-6 text-body">
                JPG, PNG, and other standard image formats are accepted. Large
                batches stay grouped into one review project.
              </p>
              <Button
                type="button"
                disabled={isSubmitting}
                className="mt-6 h-11 cursor-pointer rounded-full border-primary !bg-primary px-6 !text-on-primary hover:!border-primary hover:!bg-primary/90 hover:!text-on-primary"
                onClick={openFilePicker}
              >
                <Upload className="size-4" />
                Choose Files
              </Button>
            </div>
          </div>

          <div className="rounded-[16px] border border-hairline bg-surface-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.02em] text-muted">
                  Selected photos
                </p>
                <p className="mt-1 text-sm text-body">
                  {files.length === 0
                    ? "No files selected yet."
                    : `${files.length} image${files.length === 1 ? "" : "s"} ready for upload.`}
                </p>
              </div>
            </div>

            {files.length > 0 ? (
              <div className="mt-4 grid border-y border-hairline">
                {files.slice(0, 6).map((file) => (
                  <div
                    key={`${file.name}-${file.size}`}
                    className="flex items-center justify-between gap-3 border-b border-hairline px-1 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">
                        {file.name}
                      </p>
                      <p className="text-xs text-body">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="grid size-9 shrink-0 place-items-center rounded-full text-body transition-colors hover:bg-surface-stone hover:text-ink disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => removeFile(file)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                {files.length > 6 ? (
                  <p className="pt-1 text-xs text-muted">
                    {files.length - 6} more files selected.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          {isSubmitting && uploadProgress && uploadProgress.total > 0 ? (
            <div
              role="status"
              aria-live="polite"
              className="flex gap-3 rounded-[16px] border border-hairline bg-surface-stone px-4 py-3"
            >
              <Loader2
                className="mt-0.5 size-4 shrink-0 animate-spin text-primary"
                aria-hidden
              />
              <div className="min-w-0 flex-1 text-sm text-body">
                <div className="flex items-center justify-between gap-4">
                  <p>
                    Uploading{" "}
                    {uploadProgress.completed > 0
                      ? `${uploadProgress.completed} of ${uploadProgress.total}`
                      : `0 of ${uploadProgress.total}`}
                    …
                  </p>
                  <p className="shrink-0 text-xs text-muted">
                    {uploadProgressValue}%
                  </p>
                </div>
                <Progress
                  value={uploadProgressValue}
                  className="mt-3 h-1.5 bg-hairline"
                />
                {uploadProgress.fileName ? (
                  <p className="mt-1 truncate text-xs text-muted">
                    {uploadProgress.fileName}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="rounded-[16px] border border-semantic-error/30 bg-semantic-error/10 px-4 py-3 text-sm text-semantic-error"
            >
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter className="rounded-b-[22px] border-hairline bg-surface-stone/70 px-6 py-5 sm:justify-between sm:px-8">
          <p className="text-xs leading-5 text-muted">
            Processing begins after confirmation. Files stay private to your
            review project.
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="h-11 cursor-pointer rounded-full border-hairline bg-surface-card px-5 text-ink hover:bg-surface-stone"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-11 cursor-pointer rounded-full px-6"
              onClick={handleContinue}
              disabled={files.length === 0 || isSubmitting}
            >
              {isSubmitting
                ? uploadProgress && uploadProgress.completed > 0
                  ? `Uploading ${uploadProgress.completed}/${uploadProgress.total}…`
                  : "Preparing upload…"
                : "Start Review"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
