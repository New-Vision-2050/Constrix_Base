"use client";

import React from "react";
import {Box,} from "@mui/material";
import {Guarantor} from "./Guarantor_cases/Guarantor";
import {Identity} from "./Identity_cases/Identity";
import {Shipping} from "./Shipping_cases/Shipping";


export function Store() {
    return (
        <Box className="mt-20 grid grid-cols-3 gap-4">

            <Box>
                <Shipping/>
            </Box>

            <Box>
                <Identity/>
            </Box>
            
            <Box>
                <Guarantor/>
            </Box>

        </Box>
    );
}

export default Store;

