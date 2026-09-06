export type MaintenanceUtilityType = "electricity" | "water";

export const MAINTENANCE_UTILITY_TYPES = [
  "electricity",
  "water",
] as const satisfies readonly MaintenanceUtilityType[];

export function isMaintenanceUtilityType(
  value: unknown,
): value is MaintenanceUtilityType {
  return value === "electricity" || value === "water";
}

/** Tab ids for project detail (query `?tab=`). */
export function projectMaintenanceTabId(
  type: MaintenanceUtilityType,
): string {
  return type === "water"
    ? "project-tab-maintenance-water"
    : "project-tab-maintenance-electricity";
}

/** Tab ids for contractual engagement detail. */
export function engagementMaintenanceTabId(
  type: MaintenanceUtilityType,
): string {
  return type === "water"
    ? "engagement-tab-maintenance-water"
    : "engagement-tab-maintenance-electricity";
}
