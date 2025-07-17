import { useHome } from "@/app/(protected)/home/_components/context";
import CreateNewFormDialog from "@/app/(protected)/home/_components/create";
import HomeSidebarRecents from "@/app/(protected)/home/_components/sidebar/recents";
import { HomeSidebarRecentsSkeleton } from "@/app/(protected)/home/_components/sidebar/recents/skeleton";
import HomeSidebarSearchbox from "@/app/(protected)/home/_components/sidebar/search";
import HomeSidebarUser from "@/app/(protected)/home/_components/sidebar/user";
import { Logo } from "@/components/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";

function HomeSidebar() {
  const { collections, isPending } = useHome();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="p-2">
        <SidebarGroup>
          <HomeSidebarUser />
        </SidebarGroup>
        <SidebarGroup>
          <HomeSidebarSearchbox />
        </SidebarGroup>
        <SidebarGroup>
          {isPending ? (
            <HomeSidebarRecentsSkeleton />
          ) : (
            <HomeSidebarRecents
              links={collections
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime(),
                )
                .map((c) => ({
                  title: c.name,
                  href: `/collection/${c.id}`,
                  starred: false,
                }))}
            />
          )}
        </SidebarGroup>
        <SidebarGroup className="flex items-center justify-center">
          <CreateNewFormDialog />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
export default HomeSidebar;
