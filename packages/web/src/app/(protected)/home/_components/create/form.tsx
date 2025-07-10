"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TextareaAutosize } from "@/components/ui/textarea";

const createLibrarySchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(1, "Description is required"),
});

export type CreateLibrarySchemaType = z.infer<typeof createLibrarySchema>;

export default function CreateLibraryForm({
  defaultValues = { topic: "", description: "" },
  onSubmit,
}: {
  defaultValues?: CreateLibrarySchemaType;
  onSubmit: (values: CreateLibrarySchemaType) => void;
}) {
  const form = useForm<CreateLibrarySchemaType>({
    resolver: zodResolver(createLibrarySchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="topic">Topic</FormLabel>
              <FormControl>
                <Input id="topic" placeholder="Enter topic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <TextareaAutosize
                  id="description"
                  placeholder="Enter desciortion"
                  {...field}
                  className="max-w-full resize-none"
                  minRows={2}
                  maxRows={6}
                />
              </FormControl>
              <FormDescription>
                Enter a short description can be change/auto generted after!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="pt-6 pb-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button>Let&apos;s Go!</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
