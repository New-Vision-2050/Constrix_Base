
import { TableData } from './tableTypes';
import { ColumnConfig } from './tableConfig';

/**
 * Gets a nested value from an object using dot notation
 */
export const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return obj;
  
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : null;
  }, obj);
};

/**
 * Formats a value for display, applying any custom rendering or data mapping
 */
export const formatValue = (value: any, column?: ColumnConfig, row?: TableData): React.ReactNode => {
  if (column?.render && row) {
    return column.render(value, row);
  }
  
  if (column?.dataMapper && row) {
    value = column.dataMapper(value, row);
  }
  
  if (value === null || value === undefined) return '—';
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    return JSON.stringify(value);
  }
  
  return String(value);
};

/**
 * Extracts columns from a data row if no columns are provided
 */
export const extractColumnsFromData = (sampleRow: TableData) => {
  return Object.keys(sampleRow).map(key => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    sortable: true,
    searchable: true
  }));
};

/**
 * Processes API response data into a usable format
 */
export const processApiResponse = (result: any): TableData[] => {
  let tableData: TableData[] = [];
  
  if (Array.isArray(result)) {
    tableData = result;
  } else if (result.data && Array.isArray(result.data)) {
    tableData = result.data;
  } else if (result.payload && Array.isArray(result.payload)) {
    // Handle responses with payload property
    tableData = result.payload;
  } else if (typeof result === 'object') {
    const arrayCandidate = Object.values(result).find(val => Array.isArray(val));
    if (arrayCandidate && Array.isArray(arrayCandidate)) {
      tableData = arrayCandidate;
    } else {
      tableData = [result];
    }
  }
  
  return tableData;
};

export type ApiPaginationMeta = {
  page?: number;
  next_page?: number;
  last_page?: number;
  result_count?: number;
  total?: number;
  total_count?: number;
};

/**
 * Reads pagination metadata from common API response shapes
 * (top-level fields or nested `pagination` object).
 */
export const extractPaginationMeta = (
  result: Record<string, unknown> | null | undefined,
  itemsPerPage: number,
  currentPageRowCount: number,
): { totalItems: number; totalPages: number } => {
  const pagination = result?.pagination as ApiPaginationMeta | undefined;

  const lastPageRaw =
    result?.last_page ?? pagination?.last_page;
  const lastPage = lastPageRaw != null ? Number(lastPageRaw) : 0;

  const explicitTotal =
    result?.total_count ??
    result?.total ??
    pagination?.total_count ??
    pagination?.total;

  let totalItems = 0;

  if (explicitTotal != null && !Number.isNaN(Number(explicitTotal))) {
    totalItems = Number(explicitTotal);
  } else if (lastPage > 0) {
    const currentPage = Number(pagination?.page ?? result?.page ?? 1);
    if (currentPage === lastPage && currentPageRowCount > 0) {
      totalItems = (lastPage - 1) * itemsPerPage + currentPageRowCount;
    } else {
      totalItems = lastPage * itemsPerPage;
    }
  } else {
    const resultCount = pagination?.result_count ?? result?.result_count;
    totalItems =
      resultCount != null && !Number.isNaN(Number(resultCount))
        ? Number(resultCount)
        : currentPageRowCount;
  }

  const totalPages =
    lastPage > 0
      ? lastPage
      : totalItems > 0
        ? Math.ceil(totalItems / itemsPerPage)
        : 1;

  return {
    totalItems: Math.max(0, totalItems),
    totalPages: Math.max(1, totalPages),
  };
};
