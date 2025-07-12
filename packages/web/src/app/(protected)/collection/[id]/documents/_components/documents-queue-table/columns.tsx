import { createColumnHelper } from "@tanstack/react-table";
import { Text } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";

type FileQueue = {
  id: string;
  file_name: string;
  source_file_path: string;
  file_type: string;
  is_vectorized: boolean;
  is_graph_extracted: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
};

const columnHelper = createColumnHelper<FileQueue>();

export const fileQueueColumns = [
  columnHelper.accessor("id", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    meta: { label: "ID", placeholder: "Search IDs...", variant: "text" },
  }),
  columnHelper.accessor("file_name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File Name" />
    ),
    meta: {
      label: "File Name",
      placeholder: "Search file names...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("source_file_path", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source Path" />
    ),
    meta: {
      label: "Source Path",
      placeholder: "Search source paths...",
      variant: "text",
    },
  }),
  columnHelper.accessor("file_type", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File Type" />
    ),
    meta: {
      label: "File Type",
      placeholder: "Search file types...",
      variant: "text",
    },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("is_vectorized", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vectorized" />
    ),
    meta: { label: "Vectorized", placeholder: "", variant: "boolean" },
    enableColumnFilter: true,
    cell: (info) => (info.getValue() ? "Yes" : "No"),
  }),
  columnHelper.accessor("is_graph_extracted", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Graph Extracted" />
    ),
    meta: { label: "Graph Extracted", placeholder: "", variant: "boolean" },
    enableColumnFilter: true,
    cell: (info) => (info.getValue() ? "Yes" : "No"),
  }),
  columnHelper.accessor("created_by", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    meta: {
      label: "Created By",
      placeholder: "Search creators...",
      variant: "text",
    },
  }),
  columnHelper.accessor("updated_by", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    meta: {
      label: "Updated By",
      placeholder: "Search updaters...",
      variant: "text",
    },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    meta: { label: "Created At", placeholder: "", variant: "date" },
    cell: ({ cell }) => <RelativeTimeCard date={cell.getValue()} />,
  }),
  columnHelper.accessor("updated_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    meta: { label: "Updated At", placeholder: "", variant: "date" },
    enableColumnFilter: true,
    cell: ({ cell }) => <RelativeTimeCard date={cell.getValue()} />,
  }),
];
