"use client";

import React from "react";
import ProjectStatsBar from "./components/stats-bar";
import ProjectTabs from "./components/project-tabs";
import { Box } from "@mui/material";

export default function AllProjectDetails() {
  return (
    <Box className="container mx-auto p-6">
      {/* Top Stats Bar */}
      <ProjectStatsBar />

      {/* Horizontal Tabs */}
      <ProjectTabs />
    </Box>
  );
}

