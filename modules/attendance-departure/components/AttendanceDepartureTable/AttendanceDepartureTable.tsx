"use client";
import React, { useEffect, useCallback, useMemo } from "react";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { getAttendanceDepartureTableConfig } from "../../config/AttendanceDepartureTableConfig";
import { Button } from "@/components/ui/button";
import { useAttendance } from "../../context/AttendanceContext";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { useTranslations } from "next-intl";
import useCurrentAuthCompany from "@/hooks/use-auth-company";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

const AttendanceDepartureTable: React.FC = () => {
  // declare state & vars
  const { data: authCompanyData } = useCurrentAuthCompany();
  
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const companyCreatedAt = authCompanyData?.payload?.created_at ? new Date(authCompanyData.payload.created_at) : oneYearAgo;
  const { toggleView, setStartDate, setEndDate } = useAttendance();
  const t = useTranslations("AttendanceDepartureModule.Table");
  const { can } = usePermissions();
  const tableId = useMemo(
    () => getAttendanceDepartureTableConfig(t, companyCreatedAt, can).tableId || "default",
    [t, companyCreatedAt, can]
  );

  // Using a different approach to access column state to avoid infinite loop
  const tables = useTableStore((state) => state.tables);
  const columnSearchState = useMemo(() => {
    const tableState = tables[tableId];
    return tableState ? tableState.columnSearchState : {};
  }, [tables, tableId]);

  // When search state changes, update the context
  useEffect(() => {
    if (columnSearchState) {
      // Update start date if changed
      if (
        columnSearchState["start_date"] &&
        typeof columnSearchState["start_date"] === "string"
      ) {
        const dateValue = columnSearchState["start_date"];
        setStartDate(new Date(dateValue));
      }

      // Update end date if changed
      if (
        columnSearchState["end_date"] &&
        typeof columnSearchState["end_date"] === "string"
      ) {
        const dateValue = columnSearchState["end_date"];
        setEndDate(new Date(dateValue));
      }
    }
  }, [columnSearchState, setStartDate, setEndDate]);

  // render
  return (
    <div className="mt-4">
      <TableBuilder
        config={getAttendanceDepartureTableConfig(t, companyCreatedAt, can)}
        searchBarActions={
          <div className="flex items-center gap-3">
            <Button onClick={() => toggleView("map")}>{t("mapView")}</Button>
          </div>
        }
      />
    </div>
  );
};

export default AttendanceDepartureTable;
