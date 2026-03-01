/**
 * Attendance Departure Table V2 - Headless Table Implementation
 * 
 * This module provides a modern table implementation using the headless table pattern.
 * It includes:
 * - Type-safe column definitions
 * - Advanced filtering with dynamic dropdowns
 * - Server-side pagination and sorting
 * - Integration with React Query for data fetching
 * - Material-UI components for consistent UI
 * 
 * @example
 * ```tsx
 * import { AttendanceTableV2 } from './table-v2';
 * 
 * function MyComponent() {
 *   return <AttendanceTableV2 />;
 * }
 * ```
 */

export { AttendanceTableV2 } from "./AttendanceTableV2";
export { AttendanceFilters } from "./AttendanceFilters";
export { getAttendanceColumns } from "./columns";
export { fetchAttendanceData, fetchDropdownOptions } from "./api";
export { ActionsColumn } from "./ActionsColumn";
export type {
  AttendanceApiResponse,
  AttendanceFilterParams,
  DropdownOption,
  AttendanceFiltersProps,
} from "./types";
