'use client'
import React, { useEffect, useCallback, useMemo } from "react";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { getAttendanceDepartureTableConfig } from "../../config/AttendanceDepartureTableConfig";
import { Button } from "@/components/ui/button";
import { useAttendance } from "../../context/AttendanceContext";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { useTranslations } from "next-intl";

const AttendanceDepartureTable: React.FC = () => {
  // declare state & vars
  const { toggleView, setStartDate, setEndDate } = useAttendance();
  const t = useTranslations("AttendanceDepartureModule.Table");
  const tableId = useMemo(() => getAttendanceDepartureTableConfig(t).tableId || 'default', [t]);
  
  // استخدام نهج مختلف للوصول إلى حالة العمود لتجنب الحلقة اللانهائية
  const tables = useTableStore((state) => state.tables);
  const columnSearchState = useMemo(() => {
    const tableState = tables[tableId];
    return tableState ? tableState.columnSearchState : {};
  }, [tables, tableId]);

  // عند تغيير حالة البحث، نقوم بتحديث الكونتكست
  useEffect(() => {
    if (columnSearchState) {
      // تحديث تاريخ البداية إذا تغير
      if (columnSearchState['start_date'] && typeof columnSearchState['start_date'] === 'string') {
        const dateValue = columnSearchState['start_date'];
        setStartDate(new Date(dateValue));
      }
      
      // تحديث تاريخ النهاية إذا تغير
      if (columnSearchState['end_date'] && typeof columnSearchState['end_date'] === 'string') {
        const dateValue = columnSearchState['end_date'];
        setEndDate(new Date(dateValue));
      }
    }
  }, [columnSearchState, setStartDate, setEndDate]);

  // render
  return (
    <div className="mt-4">
      <TableBuilder
        config={getAttendanceDepartureTableConfig(t)}
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
