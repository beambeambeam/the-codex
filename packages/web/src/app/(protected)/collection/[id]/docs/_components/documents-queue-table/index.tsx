import { MOCK_DOCUMENT } from "@/app/(protected)/collection/[id]/__mock__/documents";
import { fileQueueColumns } from "@/app/(protected)/collection/[id]/docs/_components/documents-queue-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";

function FileQueueTable() {
  const { table } = useDataTable({
    data: MOCK_DOCUMENT.map((doc) => ({
      ...doc,
      created_at: new Date(doc.created_at),
      updated_at: new Date(doc.updated_at),
    })),
    columns: fileQueueColumns,
    pageCount: 10,
    getRowId: (row) => row.id,
    initialState: {
      columnVisibility: {
        id: false,
        source_file_path: false,
        created_at: false,
        created_by: false,
        is_vectorized: false,
      },
    },
  });

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
