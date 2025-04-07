import React from 'react';
import { cn } from '@/lib/utils';

interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  error?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  className?: string;
  dir?: 'rtl' | 'ltr';
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading,
  error,
  sortColumn,
  sortDirection,
  onSort,
  className,
  dir = 'rtl',
}) => {
  return (
    <div className={cn('table-container', className)} dir={dir}>
      {loading && (
        <div className="table-loading">
          <span className="loading-spinner" />
          جاري التحميل...
        </div>
      )}
      
      {error && (
        <div className="table-error">
          {error}
        </div>
      )}
      
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'table-header',
                  column.sortable && 'sortable',
                  sortColumn === column.key && 'sorted',
                  `align-${column.align || 'right'}`
                )}
                style={{ width: column.width }}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="header-content">
                  {column.title}
                  {column.sortable && sortColumn === column.key && (
                    <span className={cn(
                      'sort-indicator',
                      sortDirection === 'desc' && 'desc'
                    )} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-message">
                لا يوجد بيانات
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'table-cell',
                      `align-${column.align || 'right'}`
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Styles matching the Figma design
const styles = `
.table-container {
  width: 100%;
  overflow-x: auto;
  background: #140F35;
  border-radius: 10px;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.table-header {
  padding: 16px 20px;
  font-family: Inter;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5em;
  letter-spacing: 1.063%;
  text-transform: uppercase;
  color: rgba(234, 234, 255, 0.87);
  background: transparent;
  border-bottom: 1px solid rgba(234, 234, 255, 0.12);
  cursor: default;
}

.table-header.sortable {
  cursor: pointer;
}

.table-header.sorted {
  color: #F42588;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-indicator {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid currentColor;
}

.sort-indicator.desc {
  transform: rotate(180deg);
}

.table-cell {
  padding: 16px 20px;
  font-family: TheSans;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.57em;
  letter-spacing: 0.714%;
  color: rgba(234, 234, 255, 0.87);
  border-bottom: 1px solid rgba(234, 234, 255, 0.12);
}

.align-right {
  text-align: right;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.empty-message {
  text-align: center;
  padding: 24px;
  color: rgba(234, 234, 255, 0.5);
}

.table-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: rgba(234, 234, 255, 0.87);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(234, 234, 255, 0.12);
  border-top-color: #F42588;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.table-error {
  padding: 16px;
  color: #F42588;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

[dir="rtl"] .table-header,
[dir="rtl"] .table-cell {
  text-align: right;
}

[dir="rtl"] .sort-indicator {
  margin-right: 4px;
}
`; 