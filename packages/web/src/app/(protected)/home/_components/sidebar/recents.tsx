import { StarIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

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
      <p className="text-foreground/60 text-sm">Recents Things.</p>
      {props.links.map((link) => (
        <Card
          key={link.href}
          className="hover:bg-muted cursor-pointer py-3 shadow-none transition-colors"
        >
          <CardContent className="flex items-center justify-between overflow-hidden px-4 text-sm text-ellipsis whitespace-nowrap">
            <span>{link.title}</span>
            {link.starred && <StarIcon className="size-4" />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export default HomeSidebarRecents;
