
import React from 'react';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { ColumnConfig } from '@/modules/table/utils/configs/columnConfig';
import { SortState } from '@/modules/table/utils/tableTypes';

interface TableHeaderProps {
  columns: ColumnConfig[];
  sortState: SortState;
  onSort: (column: string) => void;
  enableSorting: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  sortState,
  onSort,
  enableSorting
}) => {
  const getSortIcon = (column: string) => {
    // Use logical properties (ms-1 for RTL support instead of ml-1)
    if (sortState.column !== column) {
      return <ArrowUpDown className="ms-1 h-4 w-4 text-muted-foreground/70" />;
    }
    
    if (sortState.direction === 'asc') {
      return <ChevronUp className="ms-1 h-4 w-4 text-primary" />;
    }
    
    return <ChevronDown className="ms-1 h-4 w-4 text-primary" />;
  };

  return (
    <thead>
      <tr className="border-b border-border bg-background">
        {columns.map((column) => {
          const isMobileHidden = column.hideOnMobile ? 'hidden sm:table-cell' : '';
          // Use logical properties for RTL/LTR support
          const alignment = column.align ? `text-${column.align}` : 'text-start'; // text-start respects RTL/LTR
          const width = column.width ? `w-[${column.width}]` : '';
          
          return (
            <th
              key={column.key}
              className={`p-2 md:p-3 font-medium text-foreground/80 text-sm ${alignment} ${isMobileHidden} ${width}`}
            >
              {enableSorting && column.sortable ? (
                <button
                  onClick={() => onSort(column.key)}
                  className="flex items-center hover:text-foreground focus:outline-none focus:text-foreground transition-colors"
                  dir="auto" // Ensures proper text direction based on content
                >
                  {column.label}
                  {getSortIcon(column.key)}
                </button>
              ) : (
                column.label
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
