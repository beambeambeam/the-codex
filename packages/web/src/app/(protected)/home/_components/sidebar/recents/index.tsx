import Link from "next/link";
import { StarIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Scroller } from "@/components/ui/scroller";

interface HomeSidebarRecentProps {
  links: {
    title: string;
    href: string;
    starred: boolean;
  }[];
}

function HomeSidebarRecents(props: HomeSidebarRecentProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-foreground/60 text-sm font-bold">Collection Trees!</p>
      <Scroller
        className="flex h-full max-h-[calc(100vh-30rem))] flex-col gap-2"
        hideScrollbar
        withNavigation
      >
        {props.links.map((link) => (
          <Link href={link.href} key={link.href}>
            <Card
              key={link.href}
              className="hover:bg-muted cursor-pointer py-3 shadow-none transition-colors"
            >
              <CardContent className="flex items-center justify-between overflow-hidden px-4 text-sm">
                <span className="block max-w-[14rem] truncate">
                  {link.title}
                </span>
                {link.starred && <StarIcon className="size-4" />}
              </CardContent>
            </Card>
          </Link>
        ))}
      </Scroller>
    </div>
  );
}

export default HomeSidebarRecents;
