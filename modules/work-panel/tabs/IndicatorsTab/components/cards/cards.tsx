"use client";

import React from "react";
import {Box,Typography} from "@mui/material";
import {EmployeesChart} from "./employees/Employees"
import {SectionsChart} from "./sections/Sections"
import { useTranslations } from "next-intl";

export function cards() {
    const t = useTranslations("WorkPanel");
    return (
        <Box className="mt-6 grid grid-cols-2 gap-5 col-span-10">

            <Box className="col-span-1 flex justify-center items-center">
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {t("jobType")}
                </Typography>
                <SectionsChart/>
            </Box>
            <Box   className="col-span-1 flex justify-center items-center">
                <Typography  variant="h6" className="col-span-1" >
                    {t("gender")}
                </Typography>
                <EmployeesChart/>
            </Box>

        </Box>
    );
}

