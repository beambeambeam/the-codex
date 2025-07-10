import CollectionIdSidebarSearchbox from "@/app/(protected)/collection/[id]/_components/sidebar/search";
import CollectionIdSidebarSettings from "@/app/(protected)/collection/[id]/_components/sidebar/settings";
import CollectionUploaderButton from "@/app/(protected)/collection/[id]/_components/uploader/button";
import { useCollectionIdContext } from "@/app/(protected)/collection/[id]/_components/use-collection-id-context";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/ui/sidebar";

function CollectionIdSidebar() {
  const context = useCollectionIdContext();

  return (
    <Sidebar>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto p-4 group-data-[collapsible=icon]:overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{context.title}</h1>
          <CollectionIdSidebarSettings />
        </div>
        <p className="text-muted-foreground text-sm font-light">
          {context.description}
        </p>
        <Separator />
        <div className="flex w-full">
          <CollectionIdSidebarSearchbox />
          <CollectionUploaderButton />
        </div>
      </div>
    </Sidebar>
  );
}

export default CollectionIdSidebar;
