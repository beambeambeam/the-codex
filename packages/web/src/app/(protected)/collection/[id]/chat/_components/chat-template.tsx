"use client";

import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { Scroller } from "@/components/ui/scroller";

interface ChatTemplateProps {
  message: {
    role: string;
    content: string;
    id: string;
    collection_chat_id: string;
    created_at: string;
    created_by: string;
  }[];
}

function ChatTemplate(props: ChatTemplateProps) {
  return (
    <Scroller
      className="mx-8 h-full max-h-[calc(100vh-330px)]"
      hideScrollbar
      withNavigation
    >
      <div className="flex flex-col gap-8">
        {props.message.map((msg) =>
          msg.role === "user" ? (
            <Message key={msg.id} className="justify-end">
              <MessageContent>{msg.content}</MessageContent>
            </Message>
          ) : (
            <Message key={msg.id} className="justify-start">
              <MessageAvatar src="/avatars/ai.png" alt="AI" fallback="AI" />
              <div className="flex w-full flex-col gap-2">
                <MessageContent markdown className="bg-transparent p-0">
                  {msg.content}
                </MessageContent>
              </div>
            </Message>
          ),
        )}
      </div>
    </Scroller>
  );
}
export default ChatTemplate;
