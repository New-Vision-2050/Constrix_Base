"use client";
import React from "react";
import {Box,} from "@mui/material";
import Calder from "./component/Calder";

interface TeamViewProps {
    projectTypeId: number | null;
}

export default function TeamView({ projectTypeId }: TeamViewProps) {
  return (
      <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
        <Calder projectTypeId={projectTypeId} />
      </Box>
  );
}

