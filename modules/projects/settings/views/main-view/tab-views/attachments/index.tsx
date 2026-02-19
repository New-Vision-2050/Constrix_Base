"use client";
import Contract from "./component/Contract";
import Items from "./component/Items";
import React from "react";
import {Box,} from "@mui/material";


export default function AttachmentsView() {


    return (
        <Box>
            <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
                <Contract/>
            </Box>

            <Box className="mt-6 gap-5 flex bg-transparent">
                <Items/>
            </Box>
        </Box>
    );
}

