import { Row } from "@tanstack/react-table";
import { MoreHorizontalIcon, TrashIcon } from "lucide-react";

import { FileQueue } from "@/app/(protected)/collection/[id]/docs/_components/documents-queue-table/columns";
import useRemoveDocument from "@/app/(protected)/collection/[id]/docs/_lib/use-remove-document";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function FileQueueDropdown(props: { row: Row<FileQueue> }) {
  const { remove, isPending } = useRemoveDocument();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          Manage {props.row.original.file_name}
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() =>
            remove({
              params: { path: { document_id: props.row.original.id } },
            })
          }
          disabled={isPending}
          variant="destructive"
        >
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FileQueueDropdown;
