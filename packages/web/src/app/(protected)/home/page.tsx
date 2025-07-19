"use client";

import HomeCanvasLayout from "@/app/(protected)/home/_components/canvas/layout";
import { useHome } from "@/app/(protected)/home/_components/context";
import { ToggleThemeButton } from "@/components/button/toggle-theme";
import SettingDialog from "@/components/settings/dialog";
import { Loader } from "@/components/ui/loader";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/store/userStore";

function HomePage() {
  const { username } = useUser();
  const { collections, isPending } = useHome();

  console.log([
    ...(collections ?? []).map((_, index) => ({
      id: `${index + 1}`,
      source: String(index + 1),
      target: "center",
      type: "straight",
    })),
  ]);

  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-start gap-2">
          <SidebarTrigger />
          <div className="flex flex-col text-2xl font-semibold">
            <h1 className="capitalize">Hello {username}!</h1>
            <h1>What are you interest in today?</h1>
          </div>
        </div>

        <div className="flex h-full items-start justify-start gap-4">
          <ToggleThemeButton />
          <SettingDialog />
        </div>
      </div>
      {isPending ? (
        <div className="border-foreground/20 flex h-full w-full items-center justify-center border">
          <Loader
            variant="text-shimmer"
            text="Fetching your collections..."
            className="text-2xl font-bold"
          />
        </div>
      ) : (
        <HomeCanvasLayout
          nodes={[
            {
              id: "center",
              type: "centerNode",
              position: { x: 0, y: 0 },
              data: {
                title: username,
                imageUrl: "",
              },
            },
            ...(collections ?? []).map((item, index) => ({
              id: String(index + 1),
              type: "customNode",
              position: { x: 0, y: 0 },
              data: {
                header: item.name,
                paragraph: item.description ?? "",
                href: `/collection/${item.id}`,
              },
            })),
          ]}
          edges={[
            ...(collections ?? []).map((_, index) => ({
              id: `${index + 1}`,
              source: String(index + 1),
              target: "center",
              type: "straight",
            })),
          ]}
        />
      )}
    </div>
  );
}
export default HomePage;
