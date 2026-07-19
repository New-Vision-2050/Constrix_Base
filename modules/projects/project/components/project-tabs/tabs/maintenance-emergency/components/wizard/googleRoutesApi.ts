const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export const MAX_ROUTE_ORIGINS = 25;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours} hr ${minutes} min`;
  return `${minutes} min`;
}

interface RouteMatrixElement {
  originIndex?: number;
  destinationIndex?: number;
  status?: { code?: number; message?: string };
  distanceMeters?: number;
  duration?: string;
  condition?: string;
}

export async function computeRouteMatrix(
  origins: { lat: number; lng: number }[],
  destination: { lat: number; lng: number },
): Promise<Array<{ distanceMeters: number; durationSeconds: number } | null>> {
  if (!API_KEY || origins.length === 0) return [];
  const res = await fetch(
    `https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "originIndex,destinationIndex,status,distanceMeters,duration,condition",
      },
      body: JSON.stringify({
        origins: origins.map((o) => ({
          waypoint: { location: { latLng: { latitude: o.lat, longitude: o.lng } } },
        })),
        destinations: [
          {
            waypoint: {
              location: { latLng: { latitude: destination.lat, longitude: destination.lng } },
            },
          },
        ],
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_UNAWARE",
      }),
    },
  );
  if (!res.ok) return [];
  const data: RouteMatrixElement[] = await res.json();
  const result: Array<{ distanceMeters: number; durationSeconds: number } | null> =
    new Array(origins.length).fill(null);
  for (const item of data) {
    const idx = item.originIndex;
    if (idx == null || idx < 0 || idx >= origins.length) continue;
    if (item.distanceMeters == null || item.duration == null) continue;
    const seconds = parseInt(item.duration, 10);
    if (Number.isNaN(seconds)) continue;
    result[idx] = { distanceMeters: item.distanceMeters, durationSeconds: seconds };
  }
  return result;
}

interface RouteResponse {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;
    polyline?: { encodedPolyline?: string };
  }>;
}

export async function computeRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): Promise<{
  distanceMeters: number;
  durationSeconds: number;
  encodedPolyline: string;
} | null> {
  if (!API_KEY) return null;
  const res = await fetch(
    `https://routes.googleapis.com/directions/v2:computeRoutes?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
      },
      body: JSON.stringify({
        origin: {
          location: { latLng: { latitude: origin.lat, longitude: origin.lng } },
        },
        destination: {
          location: { latLng: { latitude: destination.lat, longitude: destination.lng } },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_UNAWARE",
        polylineEncoding: "ENCODED_POLYLINE",
      }),
    },
  );
  if (!res.ok) return null;
  const data: RouteResponse = await res.json();
  const route = data.routes?.[0];
  if (!route?.distanceMeters || !route?.duration || !route?.polyline?.encodedPolyline)
    return null;
  const seconds = parseInt(route.duration, 10);
  if (Number.isNaN(seconds)) return null;
  return {
    distanceMeters: route.distanceMeters,
    durationSeconds: seconds,
    encodedPolyline: route.polyline.encodedPolyline,
  };
}
