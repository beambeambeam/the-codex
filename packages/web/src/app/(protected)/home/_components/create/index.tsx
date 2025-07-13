"use client";

import { useState } from "react";
import { LibraryIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { useHomeActions } from "@/app/(protected)/home/_components/context";
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
import { $api } from "@/lib/api/client";

function CreateNewFormDialog() {
  const [open, setOpen] = useState(false);

  const { fetch } = useHomeActions();

  const { mutate, isPending, isSuccess } = $api.useMutation(
    "post",
    "/collections/",
    {
      onSuccess: (data) => {
        toast.success("Collection created successfully!");
        setOpen(false);
        fetch();
      },
      onError: (error: unknown) => {
        const message =
          typeof error === "object" && error !== null && "detail" in error
            ? (error as { detail?: string }).detail
            : undefined;
        toast.error(
          message || "Failed to create collection. Please try again.",
        );
      },
    },
  );

  const handleSubmit = (values: CreateLibrarySchemaType) => {
    mutate({
      body: {
        ...values,
        name: values.topic,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <PlusIcon />
          Create new Collection!
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
            <span>Create New Collection</span>
          </DialogTitle>
          <DialogDescription>
            Create your Personal Collections for current topic you want!
          </DialogDescription>
        </DialogHeader>
        <CreateLibraryForm
          onSubmit={handleSubmit}
          defaultValues={{
            topic: "",
            description: "",
          }}
          disabled={isPending || isSuccess}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
export default CreateNewFormDialog;
