"use client";

import Pages from "./pages/page"
import React from "react";
import { Box, } from "@mui/material";
import Charts from "./charts/charts";
import { cards as Cards } from "./cards/cards";
import Identity from "./Identity/Identity";
import Store from "./Story/Store";

export function DashbaordPage() {


    return (
        <Box className="mt-6">
         <Box>
             <Charts/>
         </Box>
         <Box className="mt-10 ">
             <Cards/>
         </Box>
            <Box>
                <Pages/>
            </Box>
            <Box>
                <Identity/>
            </Box>
            <Box>
                <Store/>
            </Box>
        </Box>
    );
}

export default  DashbaordPage