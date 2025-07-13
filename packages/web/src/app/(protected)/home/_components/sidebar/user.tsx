"use client";

import { UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/store/userStore";

function HomeSidebarUser() {
  const user = useUser();

  return (
    <Card className="py-5">
      <CardContent className="flex flex-row items-center gap-2 px-6">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h4 className="text-sm">{user.username}</h4>
          <p className="text-xs">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
export default HomeSidebarUser;
