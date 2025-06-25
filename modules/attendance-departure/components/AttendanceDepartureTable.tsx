'use client'
import React from "react";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { getAttendanceDepartureTableConfig } from "../AttendanceDepartureTableConfig";

const AttendanceDepartureTable: React.FC = () => {
  return (
    <div className="mt-4">
      <TableBuilder config={getAttendanceDepartureTableConfig()} />
    </div>
  );
};

export default AttendanceDepartureTable;
