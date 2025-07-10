import { PanelsLeftBottomIcon, Share2Icon } from "lucide-react";

import CollectionShare from "@/app/(protected)/collection/[id]/_components/sidebar/settings/share";
import { Scroller } from "@/components/ui/scroller";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CollectionIdSidebarSettingPanel() {
  const TABS_TRIGGER_CLASSNAME =
    "hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none";

  return (
    <Tabs
      defaultValue="tab-1"
      orientation="vertical"
      className="h-[70vh] w-full flex-row"
    >
      <TabsList className="text-foreground flex-col items-start justify-start gap-1 rounded-none bg-transparent px-1 py-0">
        <TabsTrigger value="tab-1" className={TABS_TRIGGER_CLASSNAME}>
          <PanelsLeftBottomIcon
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          Overall
        </TabsTrigger>
        <TabsTrigger value="tab-2" className={TABS_TRIGGER_CLASSNAME}>
          <Share2Icon
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          share
        </TabsTrigger>
      </TabsList>
      <Separator orientation="vertical" />
      <TabsContent value="tab-1" className="pl-4">
        <Scroller className="flex h-full flex-col gap-y-4"></Scroller>
      </TabsContent>
      <TabsContent value="tab-2" className="pl-4">
        <CollectionShare />
      </TabsContent>
    </Tabs>
  );
}
export default CollectionIdSidebarSettingPanel;
