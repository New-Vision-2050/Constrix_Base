const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getDistanceKilometers(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  return getDistanceMeters(lat1, lng1, lat2, lng2) / 1000;
}

export function isWithinRadius(
  userLat: number,
  userLng: number,
  centerLat: number,
  centerLng: number,
  radiusMeters: number,
) {
  return (
    getDistanceMeters(userLat, userLng, centerLat, centerLng) <= radiusMeters
  );
}

export type GeolocationErrorCode =
  | "NOT_SUPPORTED"
  | "PERMISSION_DENIED"
  | "POSITION_UNAVAILABLE"
  | "TIMEOUT"
  | "UNKNOWN";

export class GeolocationRequestError extends Error {
  code: GeolocationErrorCode;

  constructor(code: GeolocationErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
  }
}

export function requestCurrentLocation() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new GeolocationRequestError("NOT_SUPPORTED"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new GeolocationRequestError("PERMISSION_DENIED"));
          return;
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new GeolocationRequestError("POSITION_UNAVAILABLE"));
          return;
        }

        if (error.code === error.TIMEOUT) {
          reject(new GeolocationRequestError("TIMEOUT"));
          return;
        }

        reject(new GeolocationRequestError("UNKNOWN", error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  });
}
