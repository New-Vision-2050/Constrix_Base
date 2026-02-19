"use client";;
import React from "react";
import {Box,} from "@mui/material";
import Contract from "./component/Contract";

export default function ContractManagementView() {


  return (

      <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
        <Contract/>
      </Box>
  );
}

