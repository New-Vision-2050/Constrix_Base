/**
 * Pagination component types
 * Defines the interfaces for the pagination components
 */

// Props for the main pagination component
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  // New props for limit control
  currentLimit?: number;
  limitOptions?: number[];
  onLimitChange?: (limit: number) => void;
  hidePagination?: boolean;
}

// Props for pagination button component
export interface PaginationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
}

// Props for page number component
export interface PageNumberProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}
