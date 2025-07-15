import { ArrowUpRightIcon } from "lucide-react";

import CollectionIdTabs from "@/app/(protected)/collection/[id]/_components/tabs";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Scroller } from "@/components/ui/scroller";

function CollectionIdPage() {
  return (
    <>
      <CollectionIdTabs tab="tab-chat" />
      <div className="bg-background flex h-full w-full flex-col border-l">
        <div className="h-full w-full">
          <header className="relative z-20 border-b p-4">
            Start New Conversation
          </header>
          <Scroller className="mx-8 h-full max-h-[calc(100vh-200px))]">
            d
          </Scroller>
        </div>
        <div className="absolute right-0 bottom-0 left-0 z-10 flex flex-1 flex-col justify-end p-10">
          <PromptInput>
            <PromptInputTextarea placeholder="Type @ to mention a document..." />
            <PromptInputActions className="justify-end pt-2">
              <PromptInputAction tooltip="Send message">
                <Button
                  variant="default"
                  size="icon"
                  aria-label="Send message"
                  className="rounded-full"
                >
                  <ArrowUpRightIcon className="size-5" />
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>
      </div>
    </>
  );
}
export default CollectionIdPage;
