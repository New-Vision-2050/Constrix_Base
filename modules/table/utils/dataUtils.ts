
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
