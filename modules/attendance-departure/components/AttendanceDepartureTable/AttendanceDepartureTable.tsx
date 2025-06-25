'use client'
import React from "react";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { getAttendanceDepartureTableConfig } from "../../config/AttendanceDepartureTableConfig";
import { Button } from "@/components/ui/button";
import { useAttendance } from "../../context/AttendanceContext";

const AttendanceDepartureTable: React.FC = () => {
  // declare state & vars
  const { toggleView } = useAttendance();

  // render
  return (
    <div className="mt-4">
      <TableBuilder 
      config={getAttendanceDepartureTableConfig()} 
      searchBarActions={
        <div className="flex items-center gap-3">
          <Button onClick={() => toggleView("map")}>الخريطة</Button>
        </div>
      }
      />
    </div>
  );
};

export default AttendanceDepartureTable;
