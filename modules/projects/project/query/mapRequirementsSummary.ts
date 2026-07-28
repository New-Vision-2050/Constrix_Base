import type { ProjectRequirementsSummary } from "@/services/api/projects/project-requirements/types/response";
import type {
  DocumentRequirementStat,
  DocumentRequirementStatKey,
} from "@/modules/projects/project/components/project-tabs/tabs/document-requirements/types";

const EMPTY_SUMMARY: Required<ProjectRequirementsSummary> = {
  total: 0,
  approved: 0,
  in_progress: 0,
  rejected: 0,
  pending_acceptance: 0,
  under_review: 0,
};

function toCount(value: number | undefined | null): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function percentOfTotal(count: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
}

/**
 * Map list API `summary` → stats cards.
 * `under_review` → certified (معتمدة), `approved` → accepted (مقبولة).
 */
export function mapRequirementsSummaryToStats(
  summary: ProjectRequirementsSummary | null | undefined,
): DocumentRequirementStat[] {
  const s = {
    total: toCount(summary?.total ?? EMPTY_SUMMARY.total),
    approved: toCount(summary?.approved),
    in_progress: toCount(summary?.in_progress),
    rejected: toCount(summary?.rejected),
    pending_acceptance: toCount(summary?.pending_acceptance),
    under_review: toCount(summary?.under_review),
  };

  const items: Array<{ key: DocumentRequirementStatKey; count: number }> = [
    { key: "awaitingAcceptance", count: s.pending_acceptance },
    { key: "rejected", count: s.rejected },
    { key: "accepted", count: s.approved },
    { key: "inProgress", count: s.in_progress },
    { key: "certified", count: s.under_review },
  ];

  return items.map(({ key, count }) => ({
    key,
    count,
    percent: percentOfTotal(count, s.total),
  }));
}
