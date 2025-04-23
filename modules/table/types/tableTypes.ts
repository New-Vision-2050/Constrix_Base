export interface ColumnConfig {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'relation' | 'action';
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  relation?: {
    model: string;
    displayField: string;
  };
  format?: (value: any) => string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableConfig {
  columns: ColumnConfig[];
  apiUrl: string;
  pagination?: {
    enabled: boolean;
    pageSize: number;
  };
  search?: {
    enabled: boolean;
    placeholder?: string;
  };
  sort?: {
    enabled: boolean;
    defaultField?: string;
    defaultOrder?: 'asc' | 'desc';
  };
  rowActions?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    custom?: Array<{
      label: string;
      onClick: (row: any) => void;
      icon?: React.ReactNode;
    }>;
  };
  selection?: {
    enabled: boolean;
    multiple?: boolean;
  };
  filters?: Array<{
    field: string;
    label: string;
    type: 'select' | 'date' | 'text';
    options?: Array<{ value: string; label: string }>;
  }>;
}