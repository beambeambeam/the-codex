"use client";

import type React from "react";
import {
  AlertCircleIcon,
  FileIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Scroller } from "@/components/ui/scroller";
import {
  FileMetadata,
  FileWithPreview,
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload";
import { getFileIcon } from "@/lib/files";
import { cn } from "@/lib/utils";

interface CollectionFileUploaderProps {
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void;
  selectedFileIndex?: number | null;
  onSelectFile?: (index: number | null) => void;
}

export default function CollectionFileUploader(
  props: CollectionFileUploaderProps,
) {
  const maxSize = 10 * 1024 * 1024;
  const maxFiles = 10;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    initialFiles: props.initialFiles,
    onFilesChange: props.onFilesChange,
  });

  return (
    <div className="flex h-full flex-col gap-2">
      <FormLabel>File Uploader</FormLabel>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex h-full flex-col items-center rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload files"
        />

        {files.length > 0 ? (
          <div className="flex h-full w-full flex-col gap-3">
            <div className="flex h-fit items-center justify-between gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={clearFiles}
                type="button"
              >
                <Trash2Icon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Remove all
              </Button>
            </div>
            <Scroller
              className="h-[50vh] w-full space-y-2"
              withNavigation
              hideScrollbar
            >
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className={cn(
                    "bg-background focus-within:border-ring hover:border-ring focus-within:border-offset-1 flex cursor-pointer items-center justify-between gap-2 rounded-lg border p-2 pe-3 transition-all outline-none focus-within:border",
                    props.selectedFileIndex === index && "border-ring",
                  )}
                  tabIndex={0}
                  onClick={() => props.onSelectFile?.(index)}
                  onDoubleClick={() => props.onSelectFile?.(null)}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="truncate text-[13px] font-medium">
                        {file.file instanceof File
                          ? file.file.name
                          : file.file.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatBytes(
                          file.file instanceof File
                            ? file.file.size
                            : file.file.size,
                        )}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                    onClick={() => removeFile(file.id)}
                    aria-label="Remove file"
                    type="button"
                  >
                    <XIcon className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </Scroller>
            {files.length < maxFiles && (
              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={openFileDialog}
                type="button"
              >
                <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                Add more
              </Button>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <FileIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Upload files</p>
            <p className="text-muted-foreground text-xs">
              Max {maxFiles} files ∙ Up to {maxSize}MB
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={openFileDialog}
              type="button"
            >
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Select files
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
