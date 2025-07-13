"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LibraryIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

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

  const QueryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = $api.useMutation(
    "post",
    "/collections/",
    {
      onSuccess: (data) => {
        toast.success("Library created successfully!");
        setOpen(false);
        QueryClient.invalidateQueries({ queryKey: ["get", "/collections/"] });
      },
      onError: (error: unknown) => {
        const message =
          typeof error === "object" && error !== null && "detail" in error
            ? (error as { detail?: string }).detail
            : undefined;
        toast.error(message || "Failed to create library. Please try again.");
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
