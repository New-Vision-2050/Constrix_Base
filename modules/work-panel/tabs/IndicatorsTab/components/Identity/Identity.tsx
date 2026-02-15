"use client";

import React from "react";
import {Box,} from "@mui/material";
import {Classification} from "./Classification/Classification";
import {Trend} from "./Identity_trend/Trend";


export function Identity() {
    return (
        <Box className="mt-20 flex flex-row gap-2">

            <Box className="flex-1">
                <Classification/>
            </Box>

            <Box className="flex-1">
                <Trend/>
            </Box>


        </Box>
    );
}

export default Identity;

