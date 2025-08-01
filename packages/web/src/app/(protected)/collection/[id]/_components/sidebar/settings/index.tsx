"use client";

import { Settings2Icon } from "lucide-react";

import CollectionIdSidebarSettingPanel from "@/app/(protected)/collection/[id]/_components/sidebar/settings/panel";
import { useCollectionIdContext } from "@/app/(protected)/collection/[id]/_components/use-collection-id-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function CollectionIdSidebarSettings() {
  const { title } = useCollectionIdContext();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-full p-0 md:min-w-4xl"
        clickOutside={false}
      >
        <DialogHeader className="border-b p-4">
          <DialogTitle>
            {title && title.length > 30 ? title.slice(0, 30) + "..." : title}{" "}
            Project&apos;s Settings
          </DialogTitle>
          <DialogDescription hidden>
            This is dialog for settings the {title}&apos;s Project settings
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto px-4">
          <CollectionIdSidebarSettingPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default CollectionIdSidebarSettings;
