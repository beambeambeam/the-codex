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
import { Loader } from "@/components/ui/loader";
import { TextareaAutosize } from "@/components/ui/textarea";
import { FormProps } from "@/types";

const createLibrarySchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  description: z.string(),
});

export type CreateLibrarySchemaType = z.infer<typeof createLibrarySchema>;

export default function CreateLibraryForm(
  props: FormProps<CreateLibrarySchemaType>,
) {
  const form = useForm<CreateLibrarySchemaType>({
    resolver: zodResolver(createLibrarySchema),
    defaultValues: props.defaultValues,
    disabled: props.disabled,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-4">
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
          <Button>{props.isPending ? <Loader /> : "Create new!"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
