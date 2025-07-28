import { createColumnHelper } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import { CheckCircleIcon, Text, UserIcon, XCircleIcon } from "lucide-react";

import FileQueueDropdown from "@/app/(protected)/collection/[id]/docs/_components/documents-queue-table/actions";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Pill, PillIcon, PillStatus } from "@/components/ui/pill";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import { components } from "@/lib/api/path";
import { formatFileType } from "@/lib/files";

export type FileQueue = Omit<
  components["schemas"]["DocumentDetailResponse"],
  "chunks" | "relations"
>;

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
  columnHelper.accessor("title", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const title = row.original.title;
      const fileName = row.original.file_name;
      if (!title || title === fileName) {
        return <span className="text-muted-foreground">-</span>;
      }
      return <span>{title}</span>;
    },
    meta: {
      label: "Title",
      placeholder: "Search titles...",
      variant: "text",
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
    cell: ({ row }) => <Pill>{formatFileType(row.original.file_type)}</Pill>,
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
      <DataTableColumnHeader column={column} title="Knowledge Graph" />
    ),
    cell: (info) => (
      <Pill>
        <PillStatus>
          {info.getValue() ? (
            <CheckCircleIcon className="text-emerald-500" size={12} />
          ) : (
            <XCircleIcon className="text-destructive" size={12} />
          )}
        </PillStatus>
        {info.getValue() ? "Yes" : "No"}
      </Pill>
    ),
    meta: { label: "Graph Extracted", placeholder: "", variant: "boolean" },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("created_by", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => (
      <Pill>
        <PillIcon icon={UserIcon} />
        {row.original.created_by}
      </Pill>
    ),
    meta: {
      label: "Created By",
      placeholder: "Search creators...",
      variant: "text",
    },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("updated_by", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => (
      <Pill>
        <PillIcon icon={UserIcon} />
        {row.original.updated_by}
      </Pill>
    ),
    meta: {
      label: "Updated By",
      placeholder: "Search updaters...",
      variant: "text",
    },
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
  columnHelper.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }: { row: Row<FileQueue> }) => <FileQueueDropdown row={row} />,
    meta: { label: "Actions" },
    enableColumnFilter: false,
    enableSorting: false,
  }),
];
