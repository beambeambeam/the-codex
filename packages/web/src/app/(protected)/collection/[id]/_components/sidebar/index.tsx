import CollectionIdSidebarSearchbox from "@/app/(protected)/collection/[id]/_components/sidebar/search";
import { Separator } from "@/components/ui/separator";

interface CollectionIdSidebarProps {
  title: string;
  description: string;
}

function CollectionIdSidebar(props: CollectionIdSidebarProps) {
  return (
    <div className="bg-sidebar text-sidebar-foreground flex h-full w-[16.5rem] flex-col border-r">
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto p-4 group-data-[collapsible=icon]:overflow-hidden">
        <h1 className="text-2xl font-semibold">{props.title}</h1>
        <p className="text-muted-foreground text-sm font-light">
          {props.description}
        </p>
        <Separator />
        <CollectionIdSidebarSearchbox />
      </div>
    </div>
  );
}

export default CollectionIdSidebar;
