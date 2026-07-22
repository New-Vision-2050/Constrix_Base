import type { DocumentRequirementStat } from "../types";

export const DOCUMENT_REQUIREMENT_STATS: DocumentRequirementStat[] = [
  { key: "awaitingAcceptance", count: 8, percent: 10 },
  { key: "rejected", count: 12, percent: 10 },
  { key: "accepted", count: 127, percent: 10 },
  { key: "inProgress", count: 127, percent: 10 },
  { key: "certified", count: 127, percent: 10 },
];
