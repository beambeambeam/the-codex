import { ToggleThemeButton } from '@/components/button/toggle-theme';
import { Logo } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { UserIcon } from 'lucide-react';

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
            <CardContent className="flex-row flex gap-2 px-6 items-center">
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
      </SidebarContent>
      <SidebarFooter className="justify-end items-end">
        <ToggleThemeButton />
      </SidebarFooter>
    </Sidebar>
  );
}
export default HomeSidebar;
