/**
 * Define data type for each route in the routes map
 */
export interface RouteMapItem {
  label: string;       // Text to display for the route
  href?: string;       // Optional: Custom URL for the link
}
/**
 * Data type for each route in the routes map
 */
export interface RoutesMap {
  [key: string]: RouteMapItem | string;  // Can be a string (shortcut for the label) or a RouteMapItem object
}

/**
 * Breadcrumbs component properties
 */
export interface BreadcrumbsProps {
  homeLabel?: string;         // Text for the home page
  className?: string;         // CSS classes
  routesMap?: RoutesMap;      // Custom routes map
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;      // Text to display for the breadcrumb
  href: string;       // URL to navigate to when clicked
  isActive: boolean;  // Whether this is the active breadcrumb (current page)
}
