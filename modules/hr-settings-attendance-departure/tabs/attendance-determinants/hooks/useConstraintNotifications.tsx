import { useQuery } from "@tanstack/react-query";
import { AttendanceConstraints } from "@/services/api/attendance-constraints";
import type { PatchConstraintNotificationsParams } from "@/services/api/attendance-constraints/types/params";
import type { ConstraintNotifications } from "@/services/api/attendance-constraints/types/response";

export const constraintNotificationsQueryKey = (
  constraintId: string | undefined,
) => ["constraint-notifications", constraintId] as const;

function readBool(
  source: Record<string, unknown>,
  keys: string[],
): boolean | undefined {
  for (const key of keys) {
    const raw = source[key];
    if (raw === true || raw === 1 || raw === "1") return true;
    if (raw === false || raw === 0 || raw === "0") return false;
  }
  return undefined;
}

function parseConstraintNotifications(
  data: unknown,
): Partial<ConstraintNotifications> | null {
  if (data == null || typeof data !== "object") return null;

  const root = data as Record<string, unknown>;
  const payload = root.payload;
  const source =
    payload != null && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : root;

  const parsed: Partial<ConstraintNotifications> = {};

  const late = readBool(source, ["notify_late_arrival"]);
  if (late != null) parsed.notify_late_arrival = late;

  const absence = readBool(source, ["notify_unexcused_absence"]);
  if (absence != null) parsed.notify_unexcused_absence = absence;

  const early = readBool(source, ["notify_early_departure"]);
  if (early != null) parsed.notify_early_departure = early;

  return Object.keys(parsed).length > 0 ? parsed : null;
}

export function mergeNotificationValues(
  fromApi: Partial<ConstraintNotifications> | null | undefined,
): ConstraintNotifications {
  return {
    notify_late_arrival: fromApi?.notify_late_arrival ?? false,
    notify_unexcused_absence: fromApi?.notify_unexcused_absence ?? false,
    notify_early_departure: fromApi?.notify_early_departure ?? false,
  };
}

export function useConstraintNotifications(constraintId: string | undefined) {
  return useQuery({
    queryKey: constraintNotificationsQueryKey(constraintId),
    queryFn: async () => {
      const res = await AttendanceConstraints.getNotifications(constraintId!);
      return parseConstraintNotifications(res.data);
    },
    enabled: Boolean(constraintId),
    refetchOnWindowFocus: false,
  });
}

export function notificationValuesToPatchBody(
  values: ConstraintNotifications,
): PatchConstraintNotificationsParams {
  return {
    notify_late_arrival: values.notify_late_arrival,
    notify_unexcused_absence: values.notify_unexcused_absence,
    notify_early_departure: values.notify_early_departure,
  };
}
