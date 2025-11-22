/**
 * List of URL segments that should be disabled (non-clickable) in breadcrumbs
 * Add any additional terms here that you want to disable in the breadcrumbs navigation
 */
export const DISABLED_BREADCRUMB_SEGMENTS: string[] = [
  // Add your custom disabled segments here
  "bouquet",
  "bouquetDetails",
  "company-dashboard",
  "content-management-system"
];

/**
 * Check if a segment should be disabled in breadcrumbs
 * @param segment - URL segment to check
 * @returns true if segment should be disabled
 */
export const isDisabledBreadcrumbSegment = (segment: string): boolean => {
  return DISABLED_BREADCRUMB_SEGMENTS.includes(segment);
};
