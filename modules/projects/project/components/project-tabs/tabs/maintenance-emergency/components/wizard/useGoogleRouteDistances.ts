"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ProjectNotificationEmployee } from "@/services/api/projects/notifications/types/response";
import {
  computeRouteMatrix,
  formatDistance,
  formatDuration,
  haversineDistanceMeters,
  MAX_ROUTE_ORIGINS,
} from "./googleRoutesApi";

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

const routeCache = new Map<
  string,
  { distanceMeters: number; durationSeconds: number }
>();

function cacheKey(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
): string {
  return `${origin.lat.toFixed(6)},${origin.lng.toFixed(6)}|${dest.lat.toFixed(6)},${dest.lng.toFixed(6)}`;
}

const DEBOUNCE_MS = 600;

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

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    async function fetchRoutes() {
      const allOrigins = validEmployees.map((e) => ({
        lat: Number(e.location!.latitude),
        lng: Number(e.location!.longitude),
        userId: e.user_id,
      }));

      // Pre-sort by haversine distance and only send closest N to the API
      const sortedByHaversine = allOrigins
        .map((o) => ({
          ...o,
          haversine: haversineDistanceMeters(o, dest),
        }))
        .sort((a, b) => a.haversine - b.haversine);

      const toFetch = sortedByHaversine.slice(0, MAX_ROUTE_ORIGINS);
      const remaining = sortedByHaversine.slice(MAX_ROUTE_ORIGINS);

      // Check cache for all origins we need
      const uncached: typeof toFetch = [];
      const result: Record<string, RouteInfo> = {};

      for (const o of toFetch) {
        const key = cacheKey(o, dest);
        const cached = routeCache.get(key);
        if (cached) {
          result[o.userId] = {
            distance: {
              value: cached.distanceMeters,
              text: formatDistance(cached.distanceMeters),
            },
            duration: {
              value: cached.durationSeconds,
              text: formatDuration(cached.durationSeconds),
            },
          };
        } else {
          uncached.push(o);
        }
      }

      // Fetch uncached origins from API
      if (uncached.length > 0) {
        const matrix = await computeRouteMatrix(
          uncached.map((o) => ({ lat: o.lat, lng: o.lng })),
          dest,
        );
        if (cancelled) return;

        uncached.forEach((o, i) => {
          const entry = matrix[i];
          if (entry) {
            const key = cacheKey(o, dest);
            routeCache.set(key, {
              distanceMeters: entry.distanceMeters,
              durationSeconds: entry.durationSeconds,
            });
            result[o.userId] = {
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
      }

      // For remaining employees beyond MAX_ROUTE_ORIGINS, use haversine as fallback
      for (const o of remaining) {
        const approxDriveMeters = Math.round(o.haversine * 1.3);
        const approxDurationSeconds = Math.round((approxDriveMeters / 13000) * 3600);
        result[o.userId] = {
          distance: {
            value: approxDriveMeters,
            text: formatDistance(approxDriveMeters),
          },
          duration: {
            value: approxDurationSeconds,
            text: formatDuration(approxDurationSeconds),
          },
        };
      }

      if (!cancelled) setRoutes(result);
    }

    debounceRef.current = setTimeout(() => {
      fetchRoutes();
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [validEmployees, destination]);

  return routes;
}
