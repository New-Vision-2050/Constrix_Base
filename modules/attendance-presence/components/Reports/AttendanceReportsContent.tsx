"use client";

import React, { useMemo } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { useUserConstraintToday } from "../../hooks/useAttendanceActions";
import { useEmployeeAttendanceReports } from "../../hooks/useEmployeeAttendanceReports";
import { useAttendanceDirection } from "../../utils/direction";
import { mapContractSummaryCards } from "../../utils/reports-mapper";
import AttendanceReportsTable from "./AttendanceReportsTable";
import ContractSummaryCards from "./ContractSummaryCards";

export default function AttendanceReportsContent() {
  const t = useTranslations("AttendancePresence");
  const { dir } = useAttendanceDirection();
  const authUserId = useAuthStore((state) => state.user?.id);
  const {
    data: constraintData,
    isLoading: isConstraintLoading,
    isError: isConstraintError,
  } = useUserConstraintToday();
  const employeeId = authUserId ?? constraintData?.user_id;
  const isResolvingEmployeeId = !employeeId && isConstraintLoading;
  const { data, isLoading, isError } = useEmployeeAttendanceReports(employeeId, {
    page: 1,
    per_page: 12,
  });

  const contractCards = useMemo(
    () => (data ? mapContractSummaryCards(data) : []),
    [data],
  );

  if ((isLoading || isResolvingEmployeeId) && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError || isConstraintError || !employeeId) {
    return (
      <Box sx={{ py: 2 }}>
        <Alert severity="error">{t("loadError")}</Alert>
      </Box>
    );
  }

  return (
    <div className="flex flex-col gap-4" dir={dir}>
      <ContractSummaryCards cards={contractCards} />
      <AttendanceReportsTable employeeId={employeeId} />
    </div>
  );
}
