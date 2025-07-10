"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormLabel,
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

  // Reset selectedFileIndex when files are cleared
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
        <div></div>
        <div className="grid h-full w-full gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="border-border hidden h-full w-full rounded-2xl border-2 p-4 lg:flex">
            {selectedFileIndex !== null && files[selectedFileIndex] && (
              <FilePreviwer file={files[selectedFileIndex]} />
            )}
          </div>
          <div className="grid h-full w-full grid-rows-[auto_1fr] gap-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uploaded Files ({field.value.length})</FormLabel>
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
                        // Only update form value here
                        field.onChange(files.map((fwp) => fwp.file));
                      }}
                      selectedFileIndex={selectedFileIndex}
                      onSelectFile={setSelectedFileIndex}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button type="submit">Upload</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
