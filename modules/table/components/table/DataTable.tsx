import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ColumnConfig } from "@/modules/table/utils/configs/columnConfig";
import { TableData } from "@/modules/table/utils/tableTypes";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslations } from "next-intl";

interface DataTableProps {
  data: TableData[];
  columns: ColumnConfig[];
  searchQuery?: string;
  sortState: { column: string | null; direction: "asc" | "desc" | null };
  onSort: (column: string) => void;
  enableSorting: boolean;
  enablePagination: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  loading?: boolean;

  // Row selection props
  selectionEnabled?: boolean;
  selectedRows?: Record<string | number, boolean>;
  onSelectRow?: (rowId: string | number, selected: boolean) => void;
  onSelectAllRows?: (selected: boolean) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  searchQuery,
  sortState,
  onSort,
  enableSorting,
  enablePagination,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  loading = false,

  // Row selection props
  selectionEnabled = false,
  selectedRows = {},
  onSelectRow,
  onSelectAllRows,
}) => {
  const hasColumns = columns && columns.length > 0;
  const t = useTranslations();

  return (
    <motion.div
      className="backdrop-blur-sm rounded-b-lg border border-border shadow-sm overflow-hidden w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto w-full max-w-full">
        {hasColumns ? (
          <table className="w-full table-auto">
            <TableHeader
              columns={columns}
              sortState={sortState}
              onSort={onSort}
              enableSorting={enableSorting}
              selectionEnabled={selectionEnabled}
              allRowsSelected={
                data.length > 0 &&
                data.every((row, index) => {
                  const rowId = row.id !== undefined ? row.id : index;
                  return selectedRows[rowId];
                })
              }
              onSelectAllRows={onSelectAllRows}
            />
            <AnimatePresence mode="wait">
              {loading ? (
                <tbody>
                  <tr>
                    <td
                      colSpan={
                        selectionEnabled ? columns.length + 1 : columns.length
                      }
                      className="py-8"
                    >
                      <LoadingSpinner text={t("Main.Loading")} size="small" />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <TableBody
                  data={data}
                  columns={columns}
                  searchQuery={searchQuery}
                  selectionEnabled={selectionEnabled}
                  selectedRows={selectedRows}
                  onSelectRow={onSelectRow}
                  onSelectAllRows={onSelectAllRows}
                />
              )}
            </AnimatePresence>
          </table>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>No columns defined</p>
          </div>
        )}
      </div>

      {enablePagination && hasColumns && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      )}
    </motion.div>
  );
};

export default DataTable;
