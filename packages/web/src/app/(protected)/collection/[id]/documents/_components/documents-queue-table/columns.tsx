import { createColumnHelper } from "@tanstack/react-table";
import { Text } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

type FileQueue = {
  id: string;
  name: string;
};

const columnHelper = createColumnHelper<FileQueue>();

export const fileQueueColumns = [
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    meta: {
      label: "Title",
      placeholder: "Search titles...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  }),
];
