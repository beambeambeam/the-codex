"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ChatInputWithMentions } from "@/app/(protected)/collection/[id]/chat/_components/chat-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { PromptSuggestion } from "@/components/ui/prompt-suggestion";
import type { FormProps } from "@/types";

const chatFormSchema = z.object({
  chat_message: z.string().min(1, "Message is required"),
});

export type ChatFormSchemaType = z.infer<typeof chatFormSchema>;

function ChatForm(
  props: FormProps<ChatFormSchemaType> & { suggest?: boolean },
) {
  const form = useForm<ChatFormSchemaType>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: props.defaultValues,
    disabled: props.disabled,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(props.onSubmit)}
        className="flex w-full flex-col gap-2"
      >
        {props.suggest && form.watch("chat_message") === "" && (
          <div className="flex flex-wrap gap-2">
            <PromptSuggestion
              onClick={() =>
                form.setValue(
                  "chat_message",
                  "Introduce me to this collections",
                  {
                    shouldValidate: true,
                  },
                )
              }
              type="button"
            >
              Introduce me to this collections
            </PromptSuggestion>

            <PromptSuggestion
              onClick={() =>
                form.setValue("chat_message", "Find me X", {
                  shouldValidate: true,
                })
              }
              type="button"
            >
              Find me X
            </PromptSuggestion>
          </div>
        )}
        <FormField
          control={form.control}
          name="chat_message"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel htmlFor="chat_message" className="sr-only">
                Message
              </FormLabel>
              <FormControl>
                <ChatInputWithMentions
                  value={field.value}
                  onValueChange={field.onChange}
                  onSubmit={() => form.handleSubmit(props.onSubmit)()}
                  placeholder="Type @ to mention someone..."
                  disabled={props.disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default ChatForm;
