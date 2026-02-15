"use client";

import React from "react";
import {Box,} from "@mui/material";
import {NationalityChart} from "./Classification/Classification";
import {AgeDistributionChart} from "./Identity_trend/Trend";


export function Identity() {
    return (
        <Box className="mt-20 flex flex-row gap-2">

            <Box className="flex-1">
                <NationalityChart/>
            </Box>

            <Box className="flex-1">
                <AgeDistributionChart/>
            </Box>


        </Box>
    );
}

export default Identity;

