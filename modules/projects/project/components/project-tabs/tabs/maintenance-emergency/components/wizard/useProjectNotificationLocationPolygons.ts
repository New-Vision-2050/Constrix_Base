import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import type { MapPolygon } from "@/components/shared/MapPolygonDrawer";
import type { RichInternalProcedureCondition } from "@/services/api/hr-settings/internal-procedure-settings/types/args";

const PROCEDURE_TYPE = "project_notification_task";
const CREATE_FORM_KEY = "createProjectNotificationTask";
const LOCATION_CONDITION_KEY = "inside_custom_locations";

function isPolygonPoint(value: unknown): value is { lat: number; lng: number } {
  return (
    value != null &&
    typeof value === "object" &&
    "lat" in value &&
    typeof value.lat === "number" &&
    "lng" in value &&
    typeof value.lng === "number"
  );
}

function isPolygon(value: unknown): value is MapPolygon {
  return Array.isArray(value) && value.length > 0 && value.every(isPolygonPoint);
}

function extractPolygonValues(
  settings: Record<string, string | number | boolean | MapPolygon[]>,
): MapPolygon[] {
  const polygons: MapPolygon[] = [];
  for (const [key, value] of Object.entries(settings)) {
    if (Array.isArray(value)) {
      if (isPolygon(value)) {
        polygons.push(value);
      } else {
        for (const item of value) {
          if (isPolygon(item)) {
            polygons.push(item);
          } else if (key === "polygons" && Array.isArray(item)) {
            const nested = item.filter(isPolygonPoint);
            if (nested.length > 0) polygons.push(nested);
          }
        }
      }
    }
  }
  return polygons;
}

export function useProjectNotificationLocationPolygons(enabled: boolean) {
  const { data: procedures } = useQuery({
    queryKey: ["project-notification-location-polygons"],
    queryFn: () =>
      InternalProcedureSettingsApi.getInternalProcedures(PROCEDURE_TYPE),
    enabled,
  });

  const polygons = useMemo(() => {
    if (!procedures) return [] as MapPolygon[];
    const createProcedure = procedures.find((p) => p.form === CREATE_FORM_KEY);
    if (!createProcedure) {
      console.debug("[location-polygons] create procedure not found", procedures);
      return [] as MapPolygon[];
    }

    const conditions = Array.isArray(createProcedure.conditions)
      ? createProcedure.conditions
      : [];

    const first = conditions[0];
    const isRich =
      first != null &&
      typeof first === "object" &&
      "is_active" in first &&
      "settings" in first;

    if (!isRich) {
      console.debug("[location-polygons] conditions not rich", conditions);
      return [] as MapPolygon[];
    }

    const richConditions = conditions as RichInternalProcedureCondition[];
    const locationCondition = richConditions.find(
      (c) => c.key === LOCATION_CONDITION_KEY && c.is_active,
    );

    if (!locationCondition) {
      console.debug(
        "[location-polygons] InsideCustomLocations condition not active",
        conditions,
      );
      return [] as MapPolygon[];
    }

    const extracted = extractPolygonValues(locationCondition.settings);
    console.debug("[location-polygons] extracted", extracted, "from", locationCondition.settings);
    return extracted;
  }, [procedures]);

  return polygons;
}
