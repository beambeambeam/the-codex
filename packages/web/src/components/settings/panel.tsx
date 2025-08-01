import { LogOutIcon, UserIcon, UserPenIcon } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Scroller } from "@/components/ui/scroller";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLogout, useUser } from "@/store/userStore";

function SettingPanel() {
  const TABS_TRIGGER_CLASSNAME =
    "hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none";

  const { user, isPending, isError, error } = useUser();
  const { logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Tabs
      defaultValue="tab-1"
      orientation="vertical"
      className="h-[70vh] w-full flex-row"
    >
      <TabsList className="text-foreground flex-col items-start justify-start gap-1 rounded-none bg-transparent px-1 py-0">
        <TabsTrigger value="tab-1" className={TABS_TRIGGER_CLASSNAME}>
          <UserPenIcon
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          Account
        </TabsTrigger>
      </TabsList>
      <Separator orientation="vertical" />
      <TabsContent value="tab-1" className="pl-4">
        <Scroller className="flex h-full flex-col gap-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="size-36">
              <AvatarImage src="" />
              <AvatarFallback>
                <UserIcon className="size-12" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <h4 className="text-4xl font-bold">{user.username}</h4>
              <p className="text-base">{user.email}</p>
            </div>
          </div>
          {isError && error && (
            <div className="text-destructive text-sm">Error: {error}</div>
          )}
          <div className="">
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isPending}
            >
              <LogOutIcon />
              <span>{isPending ? "Logging out..." : "Logout"}</span>
            </Button>
          </div>
        </Scroller>
      </TabsContent>
    </Tabs>
  );
}

export default SettingPanel;
