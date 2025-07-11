"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchXIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CollectionUploaderFile from "@/app/(protected)/collection/[id]/_components/uploader/uploader";
import FilePreviwer from "@/components/file-previwer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const collectionFileSchema = z.object({
  file: z.array(z.instanceof(File)).min(1, "Atleast 1 file for upload"),
});

export type CollectionFileSchemaType = z.infer<typeof collectionFileSchema>;

export default function CollectionFileForm(props: {
  onSubmit?: (values: CollectionFileSchemaType) => void;
}) {
  const form = useForm<CollectionFileSchemaType>({
    resolver: zodResolver(collectionFileSchema),
    defaultValues: { file: [] },
  });

  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null,
  );

  const files = form.watch("file");
  useEffect(() => {
    if (files.length === 0) {
      setSelectedFileIndex(null);
    }
  }, [files]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          props.onSubmit?.(values);
        })}
        className="h-full w-full"
      >
        <div className="grid h-full w-full gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="flex h-full w-full flex-col gap-2">
            <div className="border-border hidden h-full w-full items-center justify-around rounded-2xl border lg:flex">
              {selectedFileIndex !== null && files[selectedFileIndex] ? (
                <div className="flex h-full w-full flex-col">
                  <div className="border-b p-4 text-base font-bold">
                    {files[selectedFileIndex].name.replace(/\.[^/.]+$/, "")}{" "}
                    <span className="text-muted-foreground ml-2 text-sm">
                      (
                      {files[selectedFileIndex].name.split(".").pop() ||
                        "unknown"}
                      )
                    </span>
                  </div>
                  <div className="h-full w-full p-4">
                    <FilePreviwer file={files[selectedFileIndex]} />
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground flex h-full w-full flex-col items-center gap-2 p-4">
                  <div
                    className="bg-background flex size-11 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <SearchXIcon className="size-4 opacity-60" />
                  </div>
                  <span className="text-base">
                    No document selected for preview
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="grid h-full w-full grid-rows-[1fr_auto] gap-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CollectionUploaderFile
                      initialFiles={field.value.map((file, idx) => ({
                        file,
                        url: URL.createObjectURL(file),
                        id: file.name + "-" + idx,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                      }))}
                      onFilesChange={(files) => {
                        // Defer the update to avoid setState during render
                        queueMicrotask(() =>
                          field.onChange(files.map((fwp) => fwp.file)),
                        );
                      }}
                      selectedFileIndex={selectedFileIndex}
                      onSelectFile={setSelectedFileIndex}
                    />
                  </FormControl>
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
