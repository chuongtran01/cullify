"use client";

import * as React from "react";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Search,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

import { AuthDialog } from "@/components/auth/auth-dialog";
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
import { authClient } from "@/lib/auth-client";
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

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getFileExtension(file: File) {
  return file.name.split(".").pop()?.toUpperCase() || "IMAGE";
}

export function UploadDialog({
  open,
  onOpenChange,
  onUploadSessionCreated,
}: UploadDialogProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isManagingSelection, setIsManagingSelection] = React.useState(false);
  const [fileSearch, setFileSearch] = React.useState("");
  const [authOpen, setAuthOpen] = React.useState(false);
  const [uploadProgress, setUploadProgress] =
    React.useState<UploadProgress | null>(null);
  const { data: session, refetch: refetchSession } = authClient.useSession();
  const uploadBatch = useUploadBatch();
  const isSubmitting = uploadBatch.isPending;
  const uploadProgressValue =
    uploadProgress && uploadProgress.total > 0
      ? Math.round((uploadProgress.completed / uploadProgress.total) * 100)
      : 0;
  const selectedSizeInBytes = React.useMemo(
    () => files.reduce((total, file) => total + file.size, 0),
    [files],
  );
  const fileTypeSummary = React.useMemo(() => {
    const counts = new Map<string, number>();

    for (const file of files) {
      const extension = getFileExtension(file);
      counts.set(extension, (counts.get(extension) || 0) + 1);
    }

    return Array.from(counts.entries())
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 4)
      .map(([extension, count]) => `${extension} ${count}`)
      .join(" / ");
  }, [files]);
  const filteredFiles = React.useMemo(() => {
    const query = fileSearch.trim().toLowerCase();

    if (!query) {
      return files;
    }

    return files.filter((file) => file.name.toLowerCase().includes(query));
  }, [fileSearch, files]);
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

  function clearFiles() {
    if (!isSubmitting) {
      setFiles([]);
      setFileSearch("");
      setIsManagingSelection(false);
    }
  }

  function startUpload() {
    if (files.length === 0 || uploadBatch.isPending) {
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

  function handleContinue() {
    if (files.length === 0 || isSubmitting) {
      return;
    }

    if (!session?.user) {
      setAuthOpen(true);
      return;
    }

    startUpload();
  }

  async function handleAuthenticatedForUpload() {
    await refetchSession();
    startUpload();
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) {
      return;
    }

    onOpenChange(nextOpen);

    if (!nextOpen) {
      setFiles([]);
      setFileSearch("");
      setIsManagingSelection(false);
      setUploadProgress(null);
      setAuthOpen(false);
      uploadBatch.reset();
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[calc(100dvh-2rem)] !max-w-3xl flex-col overflow-hidden rounded-[22px] border border-hairline bg-surface-card p-0 text-ink shadow-none sm:!max-w-3xl">
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

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          {isManagingSelection ? (
            <div className="rounded-[16px] border border-hairline bg-surface-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <button
                    type="button"
                    className="mb-4 inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:text-action-blue hover:underline"
                    onClick={() => setIsManagingSelection(false)}
                  >
                    <ArrowLeft className="size-4" />
                    Back to upload
                  </button>
                  <p className="font-mono text-xs uppercase tracking-[0.02em] text-muted">
                    Manage selection
                  </p>
                  <p className="mt-1 text-sm text-body">
                    Remove individual files or search by filename before
                    starting review.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="w-fit text-sm text-ink underline-offset-4 hover:text-action-blue hover:underline disabled:pointer-events-none disabled:opacity-50"
                  onClick={clearFiles}
                >
                  Clear all
                </button>
              </div>

              <label className="mt-5 flex h-11 items-center gap-3 rounded-full border border-hairline bg-canvas px-4">
                <Search className="size-4 text-muted" />
                <span className="sr-only">Search selected files</span>
                <input
                  value={fileSearch}
                  onChange={(event) => setFileSearch(event.target.value)}
                  placeholder="Search selected files"
                  className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                />
              </label>

              <div className="mt-4 flex items-center justify-between gap-3 border-y border-hairline py-3 font-mono text-xs uppercase tracking-[0.02em] text-muted">
                <span>
                  {filteredFiles.length} of {files.length} shown
                </span>
                <span>{formatFileSize(selectedSizeInBytes)}</span>
              </div>

              <div className="max-h-[46vh] overflow-y-auto pr-2">
                {filteredFiles.map((file) => (
                  <div
                    key={`${file.name}-${file.size}`}
                    className="flex items-center justify-between gap-3 border-b border-hairline px-1 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">{file.name}</p>
                      <p className="text-xs text-body">
                        {getFileExtension(file)} / {formatFileSize(file.size)}
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
                {filteredFiles.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted">
                    No selected files match that search.
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <>
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
                    JPG, PNG, and other standard image formats are accepted.
                    Large batches stay grouped into one review project.
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.02em] text-muted">
                      Batch intake
                    </p>
                    <p className="mt-1 text-sm text-body">
                      {files.length === 0
                        ? "No files selected yet."
                        : "Review the batch summary before starting."}
                    </p>
                  </div>
                  {files.length > 0 ? (
                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className="text-sm text-ink underline-offset-4 hover:text-action-blue hover:underline disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => setIsManagingSelection(true)}
                      >
                        Manage selection
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className="text-sm text-ink underline-offset-4 hover:text-action-blue hover:underline disabled:pointer-events-none disabled:opacity-50"
                        onClick={clearFiles}
                      >
                        Clear all
                      </button>
                    </div>
                  ) : null}
                </div>

                {files.length > 0 ? (
                  <>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {[
                        [
                          "Images",
                          `${files.length}`,
                          `${files.length === 1 ? "file" : "files"} selected`,
                        ],
                        [
                          "Total size",
                          formatFileSize(selectedSizeInBytes),
                          "queued for upload",
                        ],
                        [
                          "Formats",
                          fileTypeSummary || "Images",
                          "detected in batch",
                        ],
                      ].map(([label, value, helper]) => (
                        <div
                          key={label}
                          className="rounded-[16px] border border-card-border bg-surface-stone/60 p-4"
                        >
                          <p className="font-mono text-xs uppercase tracking-[0.02em] text-muted">
                            {label}
                          </p>
                          <p className="mt-2 truncate text-2xl font-normal tracking-[-0.02em] text-ink">
                            {value}
                          </p>
                          <p className="mt-1 text-xs text-body">{helper}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 border-y border-hairline">
                      {files.slice(0, 4).map((file) => (
                        <div
                          key={`${file.name}-${file.size}`}
                          className="flex items-center justify-between gap-3 border-b border-hairline py-3 last:border-b-0"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm text-ink">
                              {file.name}
                            </p>
                            <p className="text-xs text-body">
                              {getFileExtension(file)} /{" "}
                              {formatFileSize(file.size)}
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
                      {files.length > 4 ? (
                        <button
                          type="button"
                          className="w-full py-3 text-left text-sm text-body underline-offset-4 hover:text-action-blue hover:underline"
                          onClick={() => setIsManagingSelection(true)}
                        >
                          +{files.length - 4} more files. Manage full
                          selection.
                        </button>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            </>
          )}

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

      <AuthDialog
        key={authOpen ? "upload-auth-open" : "upload-auth-closed"}
        open={authOpen}
        onOpenChange={setAuthOpen}
        initialMode="sign-in"
        copy={{
          "sign-in": {
            title: "Sign in to start review",
            description:
              "Your batch needs an account so the review stays private and tied to you.",
            submit: "Sign in and start",
          },
          "sign-up": {
            title: "Create an account to start review",
            description:
              "Your batch needs an account so the review stays private and tied to you.",
            submit: "Create account and start",
          },
        }}
        onAuthenticated={handleAuthenticatedForUpload}
      />
    </>
  );
}
