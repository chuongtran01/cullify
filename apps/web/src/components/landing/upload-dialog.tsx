"use client";

import * as React from "react";
import { ImagePlus, Sparkles, Upload, X } from "lucide-react";
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
      <DialogContent className="!max-w-3xl rounded-2xl border border-hairline bg-surface-card p-0 text-ink sm:!max-w-3xl">
        <DialogHeader className="gap-4 border-b border-hairline px-8 pt-8 pb-6">
          <div className="flex items-start gap-4">
            <div className="grid size-11 place-items-center rounded-xl border border-hairline bg-canvas-soft">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-normal text-ink">
                Upload a batch to Cullify
              </DialogTitle>
              <DialogDescription className="max-w-prose text-sm leading-6 text-body">
                Add a set of images and let the review pipeline handle blur
                checks, grouping, and best-shot ranking.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 px-8 py-8">
          <div
            {...getRootProps()}
            className={cn(
              "rounded-2xl border border-dashed bg-canvas-soft p-8 transition-colors outline-none",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-hairline-strong",
            )}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center text-center">
              <div className="grid size-14 place-items-center rounded-full border border-hairline bg-surface-card">
                <ImagePlus className="size-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-ink">
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
                className="mt-6 h-10 cursor-pointer border-ink !bg-ink px-4 !text-canvas hover:!border-ink hover:!bg-ink/90 hover:!text-canvas"
                onClick={openFilePicker}
              >
                <Upload className="size-4" />
                Choose Files
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-canvas-soft/70 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Selected photos</p>
                <p className="mt-1 text-sm text-body">
                  {files.length === 0
                    ? "No files selected yet."
                    : `${files.length} image${files.length === 1 ? "" : "s"} ready for upload.`}
                </p>
              </div>
            </div>

            {files.length > 0 ? (
              <div className="mt-4 grid gap-2">
                {files.slice(0, 6).map((file) => (
                  <div
                    key={`${file.name}-${file.size}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-surface-card px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {file.name}
                      </p>
                      <p className="text-xs text-body">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="grid size-8 place-items-center rounded-md text-body transition-colors hover:bg-canvas-soft hover:text-ink disabled:pointer-events-none disabled:opacity-50"
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
            <p className="rounded-lg border border-hairline bg-canvas-soft px-4 py-3 text-sm text-body">
              Uploading{" "}
              {uploadProgress.completed > 0
                ? `${uploadProgress.completed} of ${uploadProgress.total}`
                : `0 of ${uploadProgress.total}`}
              …
              {uploadProgress.fileName ? (
                <span className="mt-1 block truncate text-xs text-muted">
                  {uploadProgress.fileName}
                </span>
              ) : null}
            </p>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-semantic-error/30 bg-semantic-error/10 px-4 py-3 text-sm text-semantic-error"
            >
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter className="rounded-b-2xl border-hairline bg-transparent px-8 py-6 sm:justify-between">
          <p className="text-xs leading-5 text-muted">
            Processing begins after confirmation. Files stay private to your
            review project.
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="h-10 cursor-pointer px-4"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-10 cursor-pointer px-4"
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
