import type { ReportTemplatePickRow } from "@/services/api/hr-reports/attendance";
import { parseListReportsResponse } from "./normalize-report-list";

export function parseTemplatesListResponse(data: unknown): {
  items: ReportTemplatePickRow[];
  total: number;
} {
  const { items, total } = parseListReportsResponse(data);
  return {
    items: items.map((r) => ({
      id: r.id,
      apiName: r.apiName,
      payload: r.payload,
    })),
    total,
  };
}
