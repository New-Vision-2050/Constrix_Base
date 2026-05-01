"use client";



import React from "react";

import { Box, Typography } from "@mui/material";

import { useTranslations } from "next-intl";

import AttendanceReportCharts from "./components/AttendanceReportCharts";

import AttendanceReportTable from "./components/AttendanceReportTable";



export default function HRReportsAttendanceIndex() {

  const t = useTranslations("HRReports");



  return (

    <Box className="container mx-auto p-6">

      <Box className="mb-8">

        <Typography variant="h4" className="font-bold">

          {t("attendanceReports")}

        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          className="mt-2 max-w-2xl leading-relaxed"
        >
          {t("description")}
        </Typography>

      </Box>



      <AttendanceReportCharts />

      <AttendanceReportTable />

    </Box>

  );

}

