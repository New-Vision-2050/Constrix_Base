"use client";
import React from "react";
import {Box,} from "@mui/material";
import Contractors from "./component/contractors";

interface ContractorsViewProps {
    projectTypeId: number | null;
}

export default function ContractorsView({ projectTypeId }: ContractorsViewProps) {
  return (
        <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
         <Contractors projectTypeId={projectTypeId} />
      </Box>
  );
}

