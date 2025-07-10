import { PlusIcon } from "lucide-react";

import CollectionUploader from "@/app/(protected)/collection/[id]/_components/uploader/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function CollectionUploaderButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full min-w-fit" clickOutside={false}>
        <DialogHeader>
          <DialogTitle>Add new files</DialogTitle>
          <DialogDescription hidden>
            This is dialog for add new files to collection
          </DialogDescription>
        </DialogHeader>
        <div className="h-[80vh] max-h-[80vh] w-[90vw] overflow-y-auto">
          <CollectionUploader />
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default CollectionUploaderButton;
