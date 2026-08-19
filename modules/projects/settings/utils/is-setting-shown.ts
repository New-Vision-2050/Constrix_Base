/** Treat API 0/1 flags and boolean `true`/`false` as a single on/off value. */
export function isSettingShown(value: unknown): boolean {
  return value === true || value === 1;
}
