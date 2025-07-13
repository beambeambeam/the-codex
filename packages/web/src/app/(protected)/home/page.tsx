"use client";

import { useEffect } from "react";

import HomeCanvas from "@/app/(protected)/home/_components/canvas";
import { useHomeActions } from "@/app/(protected)/home/_components/context";
import { ToggleThemeButton } from "@/components/button/toggle-theme";
import SettingDialog from "@/components/settings/dialog";
import { Loader } from "@/components/ui/loader";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { $api } from "@/lib/api/client";
import { useUser } from "@/store/userStore";

function HomePage() {
  const { username } = useUser();
  const { setCollections, setIsPending } = useHomeActions();

  const { data, isPending, isSuccess } = $api.useQuery("get", "/collections/");

  useEffect(() => {
    if (isSuccess) {
      setCollections(data);
      setIsPending(false);
    }
  }, [isSuccess, data, setCollections, setIsPending]);

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
        <HomeCanvas
          nodes={(data ?? []).map((item) => ({
            data: {
              header: item.name,
              paragraph: item.description ?? "",
              href: `/collection/${item.id}`,
            },
          }))}
        />
      )}
    </div>
  );
}
export default HomePage;
