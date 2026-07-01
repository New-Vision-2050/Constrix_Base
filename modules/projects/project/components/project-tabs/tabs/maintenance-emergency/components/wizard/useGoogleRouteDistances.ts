"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectNotificationEmployee } from "@/services/api/projects/notifications/types/response";
import { computeRouteMatrix, formatDistance, formatDuration } from "./googleRoutesApi";

export interface RouteInfo {
  distance: {
    value: number;
    text: string;
  };
  duration: {
    value: number;
    text: string;
  };
}

export function useGoogleRouteDistances(
  employees: ProjectNotificationEmployee[],
  destination: { lat: number; lng: number } | null,
): Record<string, RouteInfo> {
  const [routes, setRoutes] = useState<Record<string, RouteInfo>>({});

  const validEmployees = useMemo(() => {
    if (!destination) return [];
    return employees.filter((employee) => {
      const lat = employee.location?.latitude;
      const lng = employee.location?.longitude;
      if (lat == null || lng == null) return false;
      return !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));
    });
  }, [employees, destination]);

  useEffect(() => {
    if (!destination || validEmployees.length === 0) {
      setRoutes({});
      return;
    }

    const dest = {
      lat: Number(destination.lat),
      lng: Number(destination.lng),
    };
    if (Number.isNaN(dest.lat) || Number.isNaN(dest.lng)) {
      setRoutes({});
      return;
    }

    let cancelled = false;
    setRoutes({});

    async function fetchRoutes() {
      const origins = validEmployees.map((e) => ({
        lat: Number(e.location!.latitude),
        lng: Number(e.location!.longitude),
      }));
      const matrix = await computeRouteMatrix(origins, dest);
      if (cancelled) return;
      const result: Record<string, RouteInfo> = {};
      validEmployees.forEach((emp, i) => {
        const entry = matrix[i];
        if (entry) {
          result[emp.user_id] = {
            distance: {
              value: entry.distanceMeters,
              text: formatDistance(entry.distanceMeters),
            },
            duration: {
              value: entry.durationSeconds,
              text: formatDuration(entry.durationSeconds),
            },
          };
        }
      });
      if (!cancelled) setRoutes(result);
    }

    fetchRoutes();

    return () => {
      cancelled = true;
    };
  }, [validEmployees, destination]);

  return routes;
}
