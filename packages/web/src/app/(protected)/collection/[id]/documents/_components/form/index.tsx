"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon, UploadIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatBytes } from "@/hooks/use-file-upload";
import type { FormProps } from "@/types";

const MIN_FILES = 1;
const MAX_FILES = 10;
const MAX_SIZE = 5 * 1024 * 1024;

const fileArraySchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(MIN_FILES, "At least 1 file for upload")
    .max(MAX_FILES, "You can upload up to 10 files"),
});

export type FileArraySchemaType = z.infer<typeof fileArraySchema>;

export default function CollectionFileForm(
  props: FormProps<FileArraySchemaType>,
) {
  const form = useForm<FileArraySchemaType>({
    resolver: zodResolver(fileArraySchema),
    defaultValues: { files: [] },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          props.onSubmit?.(values);
        })}
      >
        <div>
          <div>
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <div className="flex w-full justify-between">
                    <FormLabel>Upload to collection!</FormLabel>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => form.resetField("files")}
                    >
                      <Trash2Icon
                        className="-ms-0.5 size-3.5 opacity-60"
                        aria-hidden="true"
                      />
                      Remove all
                    </Button>
                  </div>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFiles={MAX_FILES}
                      maxSize={MAX_SIZE}
                      onFileReject={(_, message) => {
                        form.setError("files", {
                          message,
                        });
                      }}
                      multiple
                    >
                      <FileUploadList className="border-border flex flex-row flex-wrap items-start justify-center gap-4 rounded border border-dashed p-4">
                        {field.value.map((file, index) => (
                          <FileUploadItem
                            key={index}
                            value={file}
                            className="bg-background relative flex w-[10rem] flex-col items-start justify-start rounded-md border p-0"
                          >
                            <div className="absolute top-0.5 right-0.5 z-10">
                              <FileUploadItemDelete asChild>
                                <Button
                                  variant="default"
                                  size="icon"
                                  className="size-6 rounded-full"
                                >
                                  <X />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </FileUploadItemDelete>
                            </div>
                            <FileUploadItemPreview className="size-[10rem]" />
                            <FileUploadItemMetadata className="w-full px-2" />
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                      <FileUploadDropzone className="border-dotted text-center">
                        <div className="flex items-center justify-center rounded-full border p-2.5">
                          <UploadIcon className="text-muted-foreground size-6" />
                        </div>
                        <p className="text-sm font-medium">
                          Drag & drop images here
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Or click to browse Upload up to {MAX_FILES} images up
                          to {formatBytes(MAX_SIZE)} each.
                        </p>
                      </FileUploadDropzone>
                    </FileUpload>
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end">
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
