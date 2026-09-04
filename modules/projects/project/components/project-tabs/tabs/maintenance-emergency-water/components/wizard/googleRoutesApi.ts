const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const ENABLE_ROUTES_API = process.env.NEXT_PUBLIC_ENABLE_ROUTES_API === "true";

export const MAX_ROUTE_ORIGINS = 10;
const CACHE_EXPIRY_HOURS = 24;
const CACHE_KEY_PREFIX = "gmaps_route_cache_";
const CACHE_VERSION = "v1";

interface CachedRoute {
  distanceMeters: number;
  durationSeconds: number;
  timestamp: number;
}

interface CachedPolylineRoute extends CachedRoute {
  encodedPolyline: string;
}

function getCacheKey(origin: { lat: number; lng: number }, dest: { lat: number; lng: number }): string {
  return `${CACHE_KEY_PREFIX}${CACHE_VERSION}_${origin.lat.toFixed(5)},${origin.lng.toFixed(5)}_${dest.lat.toFixed(5)},${dest.lng.toFixed(5)}`;
}

function isCacheValid(timestamp: number): boolean {
  const now = Date.now();
  const expiryMs = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
  return now - timestamp < expiryMs;
}

function getFromCache(key: string): CachedRoute | CachedPolylineRoute | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (!isCacheValid(parsed.timestamp)) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveToCache(key: string, data: CachedRoute | CachedPolylineRoute): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ ...data, timestamp: Date.now() }));
  } catch (e) {
    cleanupOldCache();
  }
}

function cleanupOldCache(): void {
  if (typeof window === "undefined") return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_KEY_PREFIX)) {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (!isCacheValid(parsed.timestamp)) {
              keysToRemove.push(key);
            }
          } catch {
            keysToRemove.push(key);
          }
        }
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {}
}

const pendingRequests = new Map<string, Promise<any>>();

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
  if (!API_KEY || !ENABLE_ROUTES_API || origins.length === 0) return [];

  const result: Array<{ distanceMeters: number; durationSeconds: number } | null> =
    new Array(origins.length).fill(null);
  const uncachedIndices: number[] = [];
  const uncachedOrigins: { lat: number; lng: number }[] = [];

  origins.forEach((origin, idx) => {
    const cacheKey = getCacheKey(origin, destination);
    const cached = getFromCache(cacheKey) as CachedRoute | null;
    if (cached) {
      result[idx] = {
        distanceMeters: cached.distanceMeters,
        durationSeconds: cached.durationSeconds,
      };
    } else {
      uncachedIndices.push(idx);
      uncachedOrigins.push(origin);
    }
  });

  if (uncachedOrigins.length === 0) return result;

  const requestKey = `matrix_${uncachedOrigins.map(o => `${o.lat.toFixed(5)},${o.lng.toFixed(5)}`).join("|")}_${destination.lat.toFixed(5)},${destination.lng.toFixed(5)}`;
  
  if (pendingRequests.has(requestKey)) {
    const pendingResult = await pendingRequests.get(requestKey);
    pendingResult.forEach((item: any, i: number) => {
      if (item) result[uncachedIndices[i]] = item;
    });
    return result;
  }

  const requestPromise = (async () => {
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
          origins: uncachedOrigins.map((o) => ({
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
    const apiResult: Array<{ distanceMeters: number; durationSeconds: number } | null> =
      new Array(uncachedOrigins.length).fill(null);
    for (const item of data) {
      const idx = item.originIndex;
      if (idx == null || idx < 0 || idx >= uncachedOrigins.length) continue;
      if (item.distanceMeters == null || item.duration == null) continue;
      const seconds = parseInt(item.duration, 10);
      if (Number.isNaN(seconds)) continue;
      apiResult[idx] = { distanceMeters: item.distanceMeters, durationSeconds: seconds };
      
      const cacheKey = getCacheKey(uncachedOrigins[idx], destination);
      saveToCache(cacheKey, { distanceMeters: item.distanceMeters, durationSeconds: seconds });
    }
    return apiResult;
  })();

  pendingRequests.set(requestKey, requestPromise);
  
  try {
    const apiResult = await requestPromise;
    apiResult.forEach((item, i) => {
      if (item) result[uncachedIndices[i]] = item;
    });
  } finally {
    pendingRequests.delete(requestKey);
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
  if (!API_KEY || !ENABLE_ROUTES_API) return null;

  const cacheKey = getCacheKey(origin, destination) + "_polyline";
  const cached = getFromCache(cacheKey) as CachedPolylineRoute | null;
  if (cached && "encodedPolyline" in cached) {
    return {
      distanceMeters: cached.distanceMeters,
      durationSeconds: cached.durationSeconds,
      encodedPolyline: cached.encodedPolyline,
    };
  }

  const requestKey = `route_${origin.lat.toFixed(5)},${origin.lng.toFixed(5)}_${destination.lat.toFixed(5)},${destination.lng.toFixed(5)}`;
  
  if (pendingRequests.has(requestKey)) {
    return await pendingRequests.get(requestKey);
  }

  const requestPromise = (async () => {
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
    
    const result = {
      distanceMeters: route.distanceMeters,
      durationSeconds: seconds,
      encodedPolyline: route.polyline.encodedPolyline,
    };
    
    saveToCache(cacheKey, result);
    return result;
  })();

  pendingRequests.set(requestKey, requestPromise);
  
  try {
    return await requestPromise;
  } finally {
    pendingRequests.delete(requestKey);
  }
}
