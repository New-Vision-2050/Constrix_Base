"use client";

import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import HeadlessTableLayout, {
  type ColumnDef,
} from "@/components/headless/table";
import {
  AdvanceRequestsApi,
  type AdvanceRequestInboxRow,
} from "@/services/api/approval-requests";
import { HR_ADVANCE_REQUESTS_INBOX_QUERY_KEY } from "@/modules/hr-inbox/query-keys";
import ApprovalInboxTab, {
  type SummaryColumnsContext,
} from "./ApprovalInboxTab";

const AdvanceInboxTable = HeadlessTableLayout<AdvanceRequestInboxRow>(
  "hr-advance-requests-inbox",
);

export default function AdvanceRequestsTab() {
  const t = useTranslations("HrInbox.approvals");
  const locale = useLocale();

  const summaryColumns = useCallback(
    ({ dash }: SummaryColumnsContext): ColumnDef<AdvanceRequestInboxRow>[] => {
      const formatMoney = (value: number | null | undefined) => {
        if (value == null || Number.isNaN(value)) return dash;
        const formatted = new Intl.NumberFormat(locale, {
          maximumFractionDigits: 2,
        }).format(value);
        return `${formatted} ${t("currency")}`;
      };

      return [
        {
          key: "advance_policy",
          name: t("colPolicy"),
          sortable: false,
          render: (row) => row.summary?.advance_policy ?? dash,
        },
        {
          key: "amount",
          name: t("colAmount"),
          sortable: false,
          render: (row) => (
            <span className="whitespace-nowrap text-sm font-medium">
              {formatMoney(row.summary?.amount)}
            </span>
          ),
        },
        {
          key: "installments",
          name: t("colInstallments"),
          sortable: false,
          render: (row) => {
            const installments = row.summary?.installments;
            if (installments == null) return dash;
            const amount = row.summary?.amount;
            const monthly =
              amount != null && installments > 0
                ? amount / installments
                : null;
            return (
              <Box>
                <Typography variant="body2">
                  {`${installments} ${t("installmentsUnit")}`}
                </Typography>
                {monthly != null ? (
                  <Typography variant="caption" color="text.secondary">
                    {t("monthlyInstallment", {
                      amount: formatMoney(monthly),
                    })}
                  </Typography>
                ) : null}
              </Box>
            );
          },
        },
      ];
    },
    [t, locale],
  );

  return (
    <ApprovalInboxTab
      queryKey={HR_ADVANCE_REQUESTS_INBOX_QUERY_KEY}
      table={AdvanceInboxTable}
      fetchInbox={AdvanceRequestsApi.inbox}
      approveRequest={AdvanceRequestsApi.approve}
      rejectRequest={AdvanceRequestsApi.reject}
      summaryColumns={summaryColumns}
    />
  );
}
