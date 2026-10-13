"use client";

import { useCallback } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import HeadlessTableLayout, {
  type ColumnDef,
} from "@/components/headless/table";
import {
  LeaveRequestsApi,
  type LeaveRequestInboxRow,
} from "@/services/api/approval-requests";
import { HR_LEAVE_REQUESTS_INBOX_QUERY_KEY } from "@/modules/hr-inbox/query-keys";
import ApprovalInboxTab, {
  type SummaryColumnsContext,
} from "./ApprovalInboxTab";

const LeaveInboxTable = HeadlessTableLayout<LeaveRequestInboxRow>(
  "hr-leave-requests-inbox",
);

function formatDateOnly(
  value: string | null | undefined,
  dash: string,
  locale: string,
) {
  if (!value) return dash;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(locale);
}

export default function LeaveRequestsTab() {
  const t = useTranslations("HrInbox.approvals");
  const locale = useLocale();

  const summaryColumns = useCallback(
    ({ dash }: SummaryColumnsContext): ColumnDef<LeaveRequestInboxRow>[] => [
      {
        key: "leave_type",
        name: t("colLeaveType"),
        sortable: false,
        render: (row) => (
          <Box>
            <Typography variant="body2">
              {row.summary?.leave_type ?? dash}
            </Typography>
            {row.summary?.leave_policy ? (
              <Typography variant="caption" color="text.secondary">
                {row.summary.leave_policy}
              </Typography>
            ) : null}
          </Box>
        ),
      },
      {
        key: "period",
        name: t("colPeriod"),
        sortable: false,
        render: (row) => {
          const start = row.summary?.start_date;
          const end = row.summary?.end_date;
          if (!start && !end) return dash;
          return (
            <span dir="ltr" className="whitespace-nowrap text-sm">
              {formatDateOnly(start, dash, locale)} →{" "}
              {formatDateOnly(end, dash, locale)}
            </span>
          );
        },
      },
      {
        key: "total_days",
        name: t("colTotalDays"),
        sortable: false,
        render: (row) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <span className="text-sm">
              {row.summary?.total_days != null
                ? `${row.summary.total_days} ${t("daysUnit")}`
                : dash}
            </span>
            {row.summary?.is_emergency ? (
              <Chip size="small" color="error" label={t("emergency")} />
            ) : null}
          </Stack>
        ),
      },
    ],
    [t, locale],
  );

  return (
    <ApprovalInboxTab
      queryKey={HR_LEAVE_REQUESTS_INBOX_QUERY_KEY}
      table={LeaveInboxTable}
      fetchInbox={LeaveRequestsApi.inbox}
      approveRequest={LeaveRequestsApi.approve}
      rejectRequest={LeaveRequestsApi.reject}
      summaryColumns={summaryColumns}
    />
  );
}
