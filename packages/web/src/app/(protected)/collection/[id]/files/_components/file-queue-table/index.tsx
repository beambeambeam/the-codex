import { fileQueueColumns } from "@/app/(protected)/collection/[id]/files/_components/file-queue-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";

function FileQueueTable() {
  const { table } = useDataTable({
    data: [
      {
        id: "d",
        name: "d",
      },
    ],
    columns: fileQueueColumns,
    pageCount: 10,
    getRowId: (row) => row.id,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DataTableFilterList table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
export default FileQueueTable;
