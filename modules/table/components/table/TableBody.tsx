
import React from 'react';
import { ColumnConfig } from '@/modules/table/utils/configs/columnConfig';
import { TableData } from '@/modules/table/utils/tableTypes';
import { formatValue, getNestedValue } from '@/modules/table/utils/dataUtils';
import { Database } from 'lucide-react';

interface TableBodyProps {
  data: TableData[];
  columns: ColumnConfig[];
  searchQuery?: string;
}

const TableBody: React.FC<TableBodyProps> = ({ data, columns, searchQuery }) => {
  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="p-6 text-center text-muted-foreground">
            <div className="flex flex-col items-center justify-center py-4">
              <Database className="h-8 w-8 text-muted-foreground/60 mb-2" />
              <span>No results found{searchQuery ? ` for "${searchQuery}"` : ''}</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-border last:border-0 transition-colors"
        >
          {columns.map((column, colIndex) => {
            const value = getNestedValue(row, column.key);
            const isMobileHidden = column.hideOnMobile ? 'hidden sm:table-cell' : '';
            const alignment = column.align ? `text-${column.align}` : 'text-start';

            return (
              <td
                key={`${rowIndex}-${column.key}`}
                className={`p-3 text-sm table-cell-fade-in ${alignment} ${isMobileHidden}`}
                style={{ '--index': colIndex } as React.CSSProperties}
              >
                {formatValue(value, column, row)}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default React.memo(TableBody);
