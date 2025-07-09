import Link from "next/link";
import { HomeIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const imageUrl = "";
  const name = "";

  return (
    <div className="flex h-full w-full shrink-0 border-l">
      <div className="flex w-[70px] flex-col items-center gap-6 border-r px-5 py-4">
        <Avatar className="size-8">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <Separator />
        <Link href="/home">
          <HomeIcon className="size-6" />
        </Link>
      </div>
      {children}
    </div>
  );
}
