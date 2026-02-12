"use client";


import React from "react";
import { Box, } from "@mui/material";
import Charts from "./charts/charts";
import { cards as Cards } from "./cards/cards";

export function DashbaordPage() {


    return (
        <Box className="mt-6">
         <Box>
             <Charts/>
         </Box>
         <Box className="mt-10 ">
             <Cards/>
         </Box>
        </Box>
    );
}

export default  DashbaordPage