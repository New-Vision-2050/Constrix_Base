"use client";

import React from "react";
import ProjectStatsBar from "./components/stats-bar";
import ProjectTabs from "./components/project-tabs";
import { Box } from "@mui/material";
import { ProjectProvider } from "./context/ProjectContext";

interface AllProjectDetailsProps {
  projectId: string;
}

export default function AllProjectDetails({ projectId }: AllProjectDetailsProps) {
  return (
    <ProjectProvider projectId={projectId}>
      <Box className="container mx-auto p-6">
        {/* Top Stats Bar */}
        <ProjectStatsBar />

        {/* Horizontal Tabs */}
        <ProjectTabs />
      </Box>
    </ProjectProvider>
  );
}

