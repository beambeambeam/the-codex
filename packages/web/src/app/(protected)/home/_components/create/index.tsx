"use client";

import { LibraryIcon, PlusIcon } from "lucide-react";

import CreateLibraryForm, {
  CreateLibrarySchemaType,
} from "@/app/(protected)/home/_components/create/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function CreateNewFormDialog() {
  const handleSubmit = (values: CreateLibrarySchemaType) => {
    console.log("Create Library:", values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <PlusIcon />
          Create new Library!
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-full max-w-full min-w-[27rem]"
        clickOutside={false}
        showCloseButton={false}
      >
        <DialogHeader className="pt-2 pb-6">
          <DialogTitle className="flex items-center gap-2">
            <LibraryIcon />
            <span>Create New Library</span>
          </DialogTitle>
          <DialogDescription>
            Create your Personal Libraries for current topic you want!
          </DialogDescription>
        </DialogHeader>
        <CreateLibraryForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
export default CreateNewFormDialog;
