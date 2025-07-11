import HomeCanvas from "@/app/(protected)/home/_components/canvas";
import { ToggleThemeButton } from "@/components/button/toggle-theme";
import SettingDialog from "@/components/settings/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";

function HomePage() {
  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-start gap-2">
          <SidebarTrigger />
          <div className="flex flex-col text-2xl font-semibold">
            <h1>What are you</h1>
            <h1>interest in today?</h1>
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
              header: "",
              paragraph: "",
              href: "",
            },
          },
        ]}
      />
    </div>
  );
}
export default HomePage;
