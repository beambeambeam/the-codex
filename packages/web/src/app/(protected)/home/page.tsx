"use client";

import HomeCanvas from "@/app/(protected)/home/_components/canvas";
import { ToggleThemeButton } from "@/components/button/toggle-theme";
import SettingDialog from "@/components/settings/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/store/userStore";

function HomePage() {
  const { username } = useUser();
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
      <HomeCanvas
        nodes={[
          {
            data: {
              header: "LLM with SQL.",
              paragraph:
                "Large Language Models (LLMs)—like ChatGPT, GPT-4, Claude, or others—in combination with Structured Query Language (SQL).",
              href: "/collection/1",
            },
          },
        ]}
      />
    </div>
  );
}
export default HomePage;
