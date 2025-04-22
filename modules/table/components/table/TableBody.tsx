
import React from 'react';
import { ColumnConfig } from '@/modules/table/utils/configs/columnConfig';
import { TableData } from '@/modules/table/utils/tableTypes';
import { formatValue, getNestedValue } from '@/modules/table/utils/dataUtils';
import { Database, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface TableBodyProps {
  data: TableData[];
  columns: ColumnConfig[];
  searchQuery?: string;
  selectionEnabled?: boolean;
  selectedRows?: Record<string | number, boolean>;
  onSelectRow?: (rowId: string | number, selected: boolean) => void;
  onSelectAllRows?: (selected: boolean) => void;
}

const TableBody: React.FC<TableBodyProps> = ({
  data,
  columns,
  searchQuery,
  selectionEnabled = false,
  selectedRows = {},
  onSelectRow,
  onSelectAllRows
}) => {
  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={selectionEnabled ? columns.length + 1 : columns.length} className="p-6 text-center text-muted-foreground">
            <div className="flex flex-col items-center justify-center py-4">
              <Database className="h-8 w-8 text-muted-foreground/60 mb-2" />
              <span>No results found{searchQuery ? ` for "${searchQuery}"` : ''}</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  // Calculate if all rows are selected
  const allSelected = data.length > 0 && data.every((row, index) => {
    const rowId = row.id !== undefined ? row.id : index;
    return selectedRows[rowId];
  });

  const handleSelectAll = (checked: boolean) => {
    if (onSelectAllRows) {
      onSelectAllRows(checked);
    }
  };

  const handleSelectRow = (rowId: string | number, checked: boolean) => {
    if (onSelectRow) {
      onSelectRow(rowId, checked);
    }
  };

  return (
    <tbody>
      {data.map((row, rowIndex) => {
        const rowId = row.id !== undefined ? row.id : rowIndex;
        const isSelected = selectedRows[rowId] || false;
        
        return (
          <tr
            key={rowIndex}
            className={`border-b border-border last:border-0 transition-colors ${isSelected ? 'bg-muted/30' : ''}`}
          >
            {selectionEnabled && (
              <td className="p-2 md:p-3 w-10 text-center">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleSelectRow(rowId, !!checked)}
                  aria-label={`Select row ${rowIndex + 1}`}
                />
              </td>
            )}
            {columns.map((column, colIndex) => {
              const value = getNestedValue(row, column.key);
              const isMobileHidden = column.hideOnMobile ? 'hidden sm:table-cell' : '';
              
              // Use logical properties for RTL/LTR support
              const alignment = column.align
                ? `text-${column.align}`
                : 'text-start'; // text-start respects RTL/LTR
              
              return (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className={`p-2 md:p-3 text-sm table-cell-fade-in ${alignment} ${isMobileHidden}`}
                  style={{ '--index': colIndex } as React.CSSProperties}
                >
                  {formatValue(value, column, row)}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default React.memo(TableBody);
