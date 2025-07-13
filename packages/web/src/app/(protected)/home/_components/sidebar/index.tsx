import CreateNewFormDialog from "@/app/(protected)/home/_components/create";
import HomeSidebarRecents from "@/app/(protected)/home/_components/sidebar/recents";
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
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <HomeSidebarUser />
        </SidebarGroup>
        <SidebarGroup>
          <HomeSidebarSearchbox />
        </SidebarGroup>
        <SidebarGroup>
          <HomeSidebarRecents
            links={[
              {
                title: "VLM Technical Report",
                href: "home",
                starred: true,
              },
            ]}
          />
        </SidebarGroup>
        <SidebarGroup className="flex items-center justify-center">
          <CreateNewFormDialog />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
export default HomeSidebar;
