"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AttendanceReportStatus } from "../../types/reports";
import { REPORTS_COLORS } from "./reports-theme";

export function ReportStatusBadge({
  status,
}: {
  status: AttendanceReportStatus;
}) {
  const t = useTranslations("AttendancePresence.reports.reportStatus");

  if (status === "approved") {
    return (
      <span
        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
        style={{
          color: REPORTS_COLORS.success,
          borderColor: REPORTS_COLORS.approvedBorder,
          backgroundColor: REPORTS_COLORS.approvedBg,
        }}
      >
        {t("approved")}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      {t(status)}
    </span>
  );
}

export function ReportActionButton() {
  const t = useTranslations("AttendancePresence.reports");

  return (
    <DropdownMenu open={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled
          className={cn(
            "  h-8 gap-1.5 rounded-md border px-3 text-xs font-normal text-white hover:text-white",
          )}
          style={{
            backgroundColor: REPORTS_COLORS.actionButton,
            borderColor: REPORTS_COLORS.actionButtonBorder,
          }}
        >
          {t("action")}
          <ChevronDown size={14} className="shrink-0 opacity-80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem disabled>{t("viewDetails")}</DropdownMenuItem>
        <DropdownMenuItem disabled>{t("download")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
