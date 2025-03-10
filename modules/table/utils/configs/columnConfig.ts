
import { SearchTypeConfig } from '../tableTypes';
import React from 'react';

export interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  dataMapper?: (value: any, row: any) => any;
  hideOnMobile?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  searchType?: SearchTypeConfig;
}
