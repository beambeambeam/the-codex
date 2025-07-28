import { useMemo } from "react";
import { useParams } from "next/navigation";

import { fileQueueColumns } from "@/app/(protected)/collection/[id]/docs/_components/documents-queue-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { $api } from "@/lib/api/client";

function FileQueueTable() {
  const params = useParams<{ id: string }>();

  const { data, isPending } = $api.useQuery(
    "get",
    "/collections/{collection_id}/documents",
    {
      params: {
        path: {
          collection_id: params.id,
        },
      },
    },
  );

  const { table } = useDataTable({
    data: useMemo(() => data ?? [], [data]),
    columns: fileQueueColumns,
    pageCount: 10,
    getRowId: (row) => row.id,
    initialState: {
      columnVisibility: {
        id: false,
        source_file_path: false,
        created_at: false,
        updated_by: false,
        is_vectorized: false,
      },
    },
    manualPagination: true,
  });

  if (isPending) {
    return (
      <DataTableSkeleton
        columnCount={fileQueueColumns.length}
        rowCount={10}
        filterCount={0}
        withViewOptions={true}
        withPagination={true}
        shrinkZero={false}
      />
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DataTableSortList table={table} />
        <DataTableFilterList table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
export default FileQueueTable;
