import { Settings2Icon } from "lucide-react";

import SettingPanel from "@/components/settings/panel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function SettingDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full md:min-w-4xl" clickOutside={false}>
        <DialogHeader>
          <DialogTitle>User&apos;s Settings</DialogTitle>
          <DialogDescription hidden>
            This is dialog for settings change for overall
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto">
          <SettingPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default SettingDialog;
