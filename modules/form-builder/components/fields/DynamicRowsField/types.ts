import { FieldConfig, DynamicRowFieldConfig } from "../../../types/formTypes";
import React from "react";

// Types for state management
export type RowData = Record<string, any>;
export type RowErrors = Record<number, Record<string, string | React.ReactNode>>;
export type PendingChanges = Record<number, Record<string, any>>;

// Action types for reducer
export type RowsAction =
  | { type: 'SET_ROWS'; rows: RowData[] }
  | { type: 'ADD_ROW'; defaultValues: Record<string, any> }
  | { type: 'DELETE_ROW'; rowIndex: number }
  | { type: 'UPDATE_ROW'; rowIndex: number; fieldName: string; value: any }
  | { type: 'MOVE_ROW'; oldIndex: number; newIndex: number }
  | { type: 'RESET'; defaultRows: RowData[] }
  | { type: 'SET_ROW_ERRORS'; rowErrors: RowErrors }
  | { type: 'CLEAR_PENDING_CHANGES' };

// State type for reducer
export interface RowsState {
  rows: RowData[];
  pendingChanges: PendingChanges;
  rowErrors: RowErrors;
}

// Props for the main DynamicRowsField component
export interface DynamicRowsFieldProps {
  field: FieldConfig;
  value: any[];
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: any[]) => void;
  onBlur: () => void;
  // Form values for validation context
  formValues?: Record<string, any>;
  // Form ID for form store
  formId?: string;
}

// Props for the SortableRow component
export interface SortableRowProps {
  id: string;
  rowIndex: number;
  rowData: Record<string, any>;
  fields: DynamicRowFieldConfig[];
  onFieldChange: (rowIndex: number, fieldName: string, value: any) => void;
  onDeleteRow: (rowIndex: number) => void;
  isDeleteDisabled: boolean;
  rowErrors?: Record<string, string | React.ReactNode>;
  columnsPerRow?: number;
}

// Props for the RegularRow component
export interface RegularRowProps {
  rowIndex: number;
  rowData: Record<string, any>;
  fields: DynamicRowFieldConfig[];
  onFieldChange: (rowIndex: number, fieldName: string, value: any) => void;
  onDeleteRow: (rowIndex: number) => void;
  isDeleteDisabled: boolean;
  rowErrors?: Record<string, string | React.ReactNode>;
  columnsPerRow?: number;
  touched?: boolean;
}