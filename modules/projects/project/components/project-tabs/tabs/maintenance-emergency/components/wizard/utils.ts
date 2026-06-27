import type { MapPolygon } from "@/components/shared/MapPolygonDrawer";

export function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: MapPolygon,
): boolean {
  let inside = false;
  const x = point.lng;
  const y = point.lat;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function isPointInAnyPolygon(
  point: { lat: number; lng: number } | null,
  polygons: MapPolygon[] | undefined,
): boolean {
  if (!point || !polygons || polygons.length === 0) return true;
  return polygons.some((polygon) => isPointInPolygon(point, polygon));
}
