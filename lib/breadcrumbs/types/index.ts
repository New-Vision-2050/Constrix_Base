/**
 * Represents a single breadcrumb item in the navigation path
 */
export interface BreadcrumbItem {
  /** The text to display for this breadcrumb */
  label: string;
  
  /** The URL that this breadcrumb links to */
  href: string;
  
  /** Whether this is the current page (usually the last item) */
  isCurrent?: boolean;
  
  /** Optional icon component to display before the label */
  icon?: React.ReactNode;
}

/**
 * Props for the Breadcrumbs component
 */
export interface BreadcrumbsProps {
  /** Whether to show the home icon/link at the beginning */
  showHomeLink?: boolean;
  
  /** Optional custom CSS classes */
  className?: string;
}
