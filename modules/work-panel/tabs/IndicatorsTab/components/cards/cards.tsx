"use client";

import React from "react";
import {Box,Typography} from "@mui/material";
import {EmployeesChart} from "./employees/Employees"
import {SectionsChart} from "./sections/Sections"

export function cards() {
    return (
        <Box className="mt-6 grid grid-cols-2 gap-5 col-span-10">

            <Box className="col-span-1 flex justify-center items-center">
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Sections
                </Typography>
                <SectionsChart/>
            </Box>
            <Box   className="col-span-1 flex justify-center items-center">
                <Typography  variant="h6" className="col-span-1" >
                    Employees
                </Typography>
                <EmployeesChart/>
            </Box>

        </Box>
    );
}

