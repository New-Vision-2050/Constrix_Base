
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ColumnConfig } from '@/modules/table/utils/configs/columnConfig';
import { TableData } from '@/modules/table/utils/tableTypes';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';

interface DataTableProps {
  data: TableData[];
  columns: ColumnConfig[];
  searchQuery?: string;
  sortState: { column: string | null; direction: 'asc' | 'desc' | null };
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
  loading = false
}) => {
  const hasColumns = columns && columns.length > 0;

  return (
    <motion.div
      className="backdrop-blur-sm rounded-b-lg border border-border shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto">
        {hasColumns ? (
          <table className="w-full table-auto">
            <TableHeader
              columns={columns}
              sortState={sortState}
              onSort={onSort}
              enableSorting={enableSorting}
            />
            <AnimatePresence mode="wait">
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={columns.length} className="py-8">
                      <LoadingSpinner text="Loading data..." size="small" />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <TableBody
                  data={data}
                  columns={columns}
                  searchQuery={searchQuery}
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
