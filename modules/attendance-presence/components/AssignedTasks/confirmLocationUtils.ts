import { getDistanceMeters } from "../../utils/geolocation";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";

export function computeConfirmLocationMetrics(
  userLatitude: number,
  userLongitude: number,
  notification: ProjectNotification,
): { distance_meters: number; is_inside_location: 0 | 1 } {
  const taskLatitude = notification.task_latitude;
  const taskLongitude = notification.task_longitude;
  const locationRadius = notification.location_radius ?? 0;

  if (
    taskLatitude == null ||
    taskLongitude == null ||
    Number.isNaN(taskLatitude) ||
    Number.isNaN(taskLongitude)
  ) {
    return { distance_meters: 0, is_inside_location: 0 };
  }

  const distance_meters = Math.round(
    getDistanceMeters(userLatitude, userLongitude, taskLatitude, taskLongitude),
  );

  const is_inside_location =
    locationRadius > 0 && distance_meters <= locationRadius ? 1 : 0;

  return { distance_meters, is_inside_location };
}
