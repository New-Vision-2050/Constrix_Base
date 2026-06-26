export function formatDistanceMeters(
  meters: number | null | undefined,
  tMeters: string,
  tKilometers: string,
): string {
  if (meters == null || Number.isNaN(meters)) return "—";
  if (meters < 1000) {
    return `${Math.round(meters)} ${tMeters}`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1).replace(/\.0$/, "")} ${tKilometers}`;
}
