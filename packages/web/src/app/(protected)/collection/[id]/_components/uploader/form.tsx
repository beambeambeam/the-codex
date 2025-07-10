"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CollectionUploaderFile from "@/app/(protected)/collection/[id]/_components/uploader/uploader";
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
  file: z.array(z.instanceof(File)),
});

export type CollectionFileSchemaType = z.infer<typeof collectionFileSchema>;

export default function CollectionFileForm(props: {
  onSubmit?: (values: CollectionFileSchemaType) => void;
}) {
  const form = useForm<CollectionFileSchemaType>({
    resolver: zodResolver(collectionFileSchema),
    defaultValues: { file: [] },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          props.onSubmit?.(values);
        })}
      >
        <div></div>
        <div className="grid h-full w-full grid-cols-[3fr_2fr]">
          <div className="h-full w-full"></div>
          <div className="grid h-full w-full grid-rows-[auto_1fr]">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Files</FormLabel>
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
                      onFilesChange={(files) =>
                        field.onChange(files.map((fwp) => fwp.file))
                      }
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
