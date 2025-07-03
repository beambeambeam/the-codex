import { UserIcon } from "lucide-react";

import HomeSidebarRecents from "@/app/(protected)/home/_components/sidebar/recents";
import HomeSidebarSearchbox from "@/app/(protected)/home/_components/sidebar/search";
import SettingButton from "@/components/button/settings";
import { ToggleThemeButton } from "@/components/button/toggle-theme";
import { Logo } from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
          <Card className="py-5">
            <CardContent className="flex flex-row items-center gap-2 px-6">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                  <UserIcon className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h4 className="text-sm">Username</h4>
                <p className="text-xs">Email@email.com</p>
              </div>
            </CardContent>
          </Card>
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
      </SidebarContent>
      <SidebarFooter className="flex-row items-end justify-end">
        <ToggleThemeButton />
        <SettingButton />
      </SidebarFooter>
    </Sidebar>
  );
}
export default HomeSidebar;
