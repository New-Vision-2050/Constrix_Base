import { cleanParams, forumClient, readList } from "./client";
import type {
  ForumReport,
  ReportAction,
  ReportListParams,
  ReportStats,
} from "../types";

export async function getReports(forumId: string, params: ReportListParams) {
  const response = await forumClient.get(`/forums/${forumId}/reports`, {
    params: cleanParams({ ...params }),
  });
  return readList<ForumReport, ReportStats>(response);
}

export async function resolveReport(
  forumId: string,
  reportId: string,
  body: { action: ReportAction; note: string },
) {
  await forumClient.post(
    `/forums/${forumId}/reports/${reportId}/resolve`,
    body,
  );
}
