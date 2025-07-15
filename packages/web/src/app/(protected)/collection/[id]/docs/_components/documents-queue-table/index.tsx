import { fileQueueColumns } from "@/app/(protected)/collection/[id]/docs/_components/documents-queue-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";

function FileQueueTable() {
  const { table } = useDataTable({
    data: [
      {
        id: "d",
        file_name: "d",
        source_file_path: "",
        file_type: "",
        is_vectorized: false,
        is_graph_extracted: false,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: "",
      },
      {
        id: "d2",
        file_name: "d2",
        source_file_path: "",
        file_type: "",
        is_vectorized: false,
        is_graph_extracted: false,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: "",
      },
    ],
    columns: fileQueueColumns,
    pageCount: 10,
    getRowId: (row) => row.id,
    initialState: {
      columnVisibility: {
        id: false,
        source_file_path: false,
        created_at: false,
        created_by: false,
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
