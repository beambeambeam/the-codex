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
      <DialogContent className="max-w-full md:min-w-4xl" clickOutside={false}>
        <DialogHeader>
          <DialogTitle>{title}, Project&apos;s Settings</DialogTitle>
          <DialogDescription hidden>
            This is dialog for settings the {title}&apos;s Project settings
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto">
          <CollectionIdSidebarSettingPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default CollectionIdSidebarSettings;
