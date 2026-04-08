"use client";

import React from "react";
import ProjectTabs from "./components/project-tabs";
import { Box } from "@mui/material";
import { ProjectProvider } from "@/modules/all-project/context/ProjectContext";

interface AllProjectDetailsProps {
  projectId: string;
}

export default function AllProjectDetails({ projectId }: AllProjectDetailsProps) {
  return (
    <ProjectProvider projectId={projectId}>
      <Box className="w-full max-w-none p-6">
        {/* Top Stats Bar */}
        {/* <ProjectStatsBar /> */}

        {/* Horizontal Tabs */}
        <ProjectTabs />
      </Box>
    </ProjectProvider>
  );
}

