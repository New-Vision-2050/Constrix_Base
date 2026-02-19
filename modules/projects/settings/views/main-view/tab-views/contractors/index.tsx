"use client";;
import React from "react";
import {Box,} from "@mui/material";
import Contractors from "./component/contractors";

export default function ContractorsView() {


  return (

        <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
         <Contractors/>
      </Box>
  );
}

