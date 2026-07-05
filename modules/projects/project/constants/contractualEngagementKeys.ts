/** Backend `code` values from GET /projects/contractual-engagements */
export const CONTRACTUAL_ENGAGEMENT_KEYS = {
  MAKKAH_UNIFIED: "MAKKAH_UNIFIED",
  JEDDAH_UNIFIED: "JEDDAH_UNIFIED",
} as const;

export type ContractualEngagementKey =
  (typeof CONTRACTUAL_ENGAGEMENT_KEYS)[keyof typeof CONTRACTUAL_ENGAGEMENT_KEYS];

export function isContractualEngagementKey(
  value: string | undefined | null,
): value is ContractualEngagementKey {
  return (
    value === CONTRACTUAL_ENGAGEMENT_KEYS.MAKKAH_UNIFIED ||
    value === CONTRACTUAL_ENGAGEMENT_KEYS.JEDDAH_UNIFIED
  );
}

export function getContractualEngagementTitleKey(
  key: ContractualEngagementKey,
): "UnifiedContractMakkah" | "UnifiedContractJeddah" {
  return key === CONTRACTUAL_ENGAGEMENT_KEYS.MAKKAH_UNIFIED
    ? "UnifiedContractMakkah"
    : "UnifiedContractJeddah";
}
