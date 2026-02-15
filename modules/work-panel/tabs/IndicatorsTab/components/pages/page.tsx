"use client";

import React from "react";
import {Box,} from "@mui/material";
import {Classification} from "./charts/Classification/Classification";
import {Company} from "./charts/companies/Company";
import {Examination} from "./charts/Examination/Examination";
import {Branch} from "./charts/branch/Branch";
import {Holidays} from "./charts/Total_holidays/Holidays";


export function cards() {
    return (
        <Box className="mt-20 grid grid-cols-5 gap-5">

            <Box>
                <Company/>
            </Box>
            <Box>
                <Classification/>
            </Box>
            <Box>
                <Holidays/>
            </Box>
            <Box>
                <Examination/>
            </Box>
            <Box>
                <Branch/>
            </Box>


        </Box>
    );
}

export default cards;

