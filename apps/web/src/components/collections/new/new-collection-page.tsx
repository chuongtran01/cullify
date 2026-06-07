"use client";

import * as React from "react";
import { Loader2, Lock, Search, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useUploadCollection } from "@/features/collections/hooks";
import { authClient } from "@/lib/auth-client";
import type {
  CollectionUploadProgress,
  CreateCollectionUploadResponse,
} from "@/services/collections";
import { CollectionUploadError, CollectionUploadStorageError } from "@/services/collections";
import { cn } from "@/lib/utils";

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

function getUserFirstName(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    return name.trim().split(/\s+/)[0];
  }

  if (email) {
    return email.split("@")[0] ?? "there";
  }

  return "there";
}

type ManageSelectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: File[];
  fileSearch: string;
  onFileSearchChange: (value: string) => void;
  filteredFiles: File[];
  selectedSizeInBytes: number;
  isSubmitting: boolean;
  onRemoveFile: (file: File) => void;
  onClearFiles: () => void;
};

function ManageSelectionDialog({
  open,
  onOpenChange,
  files,
  fileSearch,
  onFileSearchChange,
  filteredFiles,
  selectedSizeInBytes,
  isSubmitting,
  onRemoveFile,
  onClearFiles,
}: ManageSelectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] max-w-lg flex-col overflow-hidden rounded-lg border border-hairline-strong bg-surface-card p-0 text-ink shadow-none sm:max-w-lg">
        <DialogHeader className="gap-2 border-b border-hairline px-6 py-5 text-left">
          <DialogTitle className="text-lg font-semibold leading-snug text-ink">
            Manage selection
          </DialogTitle>
          <DialogDescription className="text-sm text-body">
            Remove individual files or search by filename before continuing.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-6">
          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              className="text-sm font-medium text-text-link disabled:pointer-events-none disabled:opacity-50"
              onClick={onClearFiles}
            >
              Clear all
            </button>
          </div>

          <label className="flex h-11 items-center gap-3 rounded-md border border-hairline-strong bg-canvas px-4">
            <Search className="size-4 text-muted" />
            <span className="sr-only">Search selected files</span>
            <input
              value={fileSearch}
              onChange={(event) => onFileSearchChange(event.target.value)}
              placeholder="Search selected files"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </label>

          <div className="flex items-center justify-between gap-3 border-y border-hairline py-3 font-mono text-xs uppercase tracking-wide text-muted">
            <span>
              {filteredFiles.length} of {files.length} shown
            </span>
            <span>{formatFileSize(selectedSizeInBytes)}</span>
          </div>

          <div className="max-h-[50vh] overflow-y-auto pr-1">
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
                <Button
                  variant="ghost"
                  size="icon-xs"
                  disabled={isSubmitting}
                  className="cursor-pointer"
                  onClick={() => onRemoveFile(file)}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            {filteredFiles.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">
                No selected files match that search.
              </p>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function NewCollectionPage() {
  const router = useRouter();
  const [files, setFiles] = React.useState<File[]>([]);
  const [selectionDialogOpen, setSelectionDialogOpen] = React.useState(false);
  const [fileSearch, setFileSearch] = React.useState("");
  const [uploadProgress, setUploadProgress] =
    React.useState<CollectionUploadProgress | null>(null);
  const { data: session } = authClient.useSession();
  const uploadCollection = useUploadCollection();
  const isSubmitting = uploadCollection.isPending;
  const firstName = getUserFirstName(session?.user?.name, session?.user?.email);
  const uploadProgressValue =
    uploadProgress && uploadProgress.total > 0
      ? Math.round((uploadProgress.completed / uploadProgress.total) * 100)
      : 0;
  const selectedSizeInBytes = React.useMemo(
    () => files.reduce((total, file) => total + file.size, 0),
    [files],
  );
  const filteredFiles = React.useMemo(() => {
    const query = fileSearch.trim().toLowerCase();

    if (!query) {
      return files;
    }

    return files.filter((file) => file.name.toLowerCase().includes(query));
  }, [fileSearch, files]);
  const error = uploadCollection.error
    ? uploadCollection.error instanceof CollectionUploadError ||
      uploadCollection.error instanceof CollectionUploadStorageError
      ? uploadCollection.error.message
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
    setFiles((current) => {
      const next = current.filter((file) => file !== fileToRemove);

      if (next.length === 0) {
        setSelectionDialogOpen(false);
        setFileSearch("");
      }

      return next;
    });
  }

  function clearFiles() {
    if (!isSubmitting) {
      setFiles([]);
      setFileSearch("");
      setSelectionDialogOpen(false);
    }
  }

  function handleSelectionDialogOpenChange(nextOpen: boolean) {
    if (isSubmitting) {
      return;
    }

    setSelectionDialogOpen(nextOpen);

    if (!nextOpen) {
      setFileSearch("");
    }
  }

  function handleContinue() {
    if (files.length === 0 || isSubmitting) {
      return;
    }

    setUploadProgress({ completed: 0, total: files.length, fileName: "" });

    uploadCollection.mutate(
      {
        files,
        onProgress: setUploadProgress,
      },
      {
        onSuccess: (response: CreateCollectionUploadResponse) => {
          router.push(`/dashboard/collections/${response.collectionId}/progress`);
        },
        onError: () => {
          setUploadProgress(null);
        },
      },
    );
  }

  const intakeMessage =
    files.length === 0
      ? "No files selected yet."
      : `${files.length} ${files.length === 1 ? "file" : "files"} selected · ${formatFileSize(selectedSizeInBytes)}`;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-center text-3xl font-semibold tracking-tight text-ink">
        Hey there, {firstName}
      </h1>

      <div className="mt-8 rounded-lg border border-hairline-strong bg-surface-card p-6 sm:p-8">
        <div
          {...getRootProps()}
          className={cn(
            "rounded-lg border border-dashed bg-canvas-soft p-6 transition-colors outline-none focus-visible:border-ink focus-visible:ring-3 focus-visible:ring-ink/10 sm:p-8",
            isDragActive
              ? "border-text-link bg-gradient-sky-light/20"
              : "border-hairline-strong",
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center text-center">
            <div className="grid size-14 place-items-center rounded-md border border-hairline-strong bg-surface-card text-primary">
              <Upload className="size-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold leading-snug text-ink">
              {isDragActive
                ? "Drop your photos here"
                : "Drag and drop your photos here"}
            </h2>
            <p className="mt-2 max-w-prose text-sm leading-6 text-body">
              JPG, PNG, and other standard image formats are accepted. Large
              collections stay grouped into one review project.
            </p>
            <Button
              type="button"
              disabled={isSubmitting}
              className="mt-6 h-10 cursor-pointer rounded-md px-4.5 text-sm font-medium"
              onClick={openFilePicker}
            >
              <Upload className="size-4" />
              Choose Files
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-hairline-strong bg-surface-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-muted">
                Collection intake
              </p>
              <p className="mt-1 text-sm text-body">{intakeMessage}</p>
            </div>
            {files.length > 0 ? (
              <button
                type="button"
                disabled={isSubmitting}
                className="shrink-0 text-sm font-medium text-text-link disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setSelectionDialogOpen(true)}
              >
                Manage selection
              </button>
            ) : null}
          </div>
        </div>

        {isSubmitting && uploadProgress && uploadProgress.total > 0 ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 flex gap-3 rounded-lg border border-hairline bg-canvas-soft px-4 py-3"
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
                <p className="shrink-0 text-xs text-muted">{uploadProgressValue}%</p>
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

        {files.length > 0 ? (
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              className="h-10 min-w-40 cursor-pointer rounded-md px-4.5 text-sm font-medium"
              disabled={isSubmitting}
              onClick={handleContinue}
            >
              {isSubmitting
                ? uploadProgress && uploadProgress.completed > 0
                  ? `Uploading ${uploadProgress.completed}/${uploadProgress.total}…`
                  : "Preparing upload…"
                : "Continue"}
            </Button>
          </div>
        ) : null}
      </div>





      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-semantic-error/30 bg-semantic-error/10 px-4 py-3 text-sm text-semantic-error"
        >
          {error}
        </p>
      ) : null}

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs leading-5 text-muted">
        <Lock className="size-3.5 shrink-0" aria-hidden="true" />
        Processing begins after confirmation. Files stay private to your review
        project.
      </p>

      <ManageSelectionDialog
        open={selectionDialogOpen}
        onOpenChange={handleSelectionDialogOpenChange}
        files={files}
        fileSearch={fileSearch}
        onFileSearchChange={setFileSearch}
        filteredFiles={filteredFiles}
        selectedSizeInBytes={selectedSizeInBytes}
        isSubmitting={isSubmitting}
        onRemoveFile={removeFile}
        onClearFiles={clearFiles}
      />
    </div>
  );
}
